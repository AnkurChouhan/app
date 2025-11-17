from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login, logout, get_user_model
from django.contrib import messages
from django.contrib.auth.decorators import login_required
from django.views.decorators.http import require_http_methods

from accounts.models import User, UserSubscription  # Custom user model

User = get_user_model()


# ---------------------- LOGIN STEP 1: USERNAME / EMAIL ----------------------
def login_step1(request):
    if request.method == 'POST':
        username_or_email = request.POST.get('username', '').strip()
        user = None

        if User.objects.filter(username=username_or_email).exists():
            user = User.objects.get(username=username_or_email)
        elif User.objects.filter(email=username_or_email).exists():
            user = User.objects.get(email=username_or_email)

        if user:
            request.session['login_username'] = user.username
            return redirect('accounts:login_step2')
        else:
            messages.error(request, "Invalid email or username.")

    return render(request, 'accounts/auth/login_step.html')


# ---------------------- LOGIN STEP 2: PASSWORD ----------------------
def login_step2(request):
    username = request.session.get('login_username')
    if not username:
        messages.error(request, "Session expired. Please enter your username again.")
        return redirect('accounts:login_step1')

    if request.method == 'POST':
        password = request.POST.get('password', '').strip()
        remember_me = request.POST.get('remember_me')

        user = authenticate(request, username=username, password=password)
        if user:
            login(request, user)

            # Set session expiry
            if remember_me:
                request.session.set_expiry(1209600)  # 2 weeks
            else:
                request.session.set_expiry(0)  # expire on browser close

            # Remove temporary session key
            request.session.pop('login_username', None)

            # Redirect based on subscription
            has_subscription = UserSubscription.objects.filter(user=user, active=True).exists()
            return redirect('accounts:user_profile' if has_subscription else 'accounts:subscription')
        else:
            messages.error(request, "Invalid password.")

    return render(request, 'accounts/auth/login_secrets.html', {'username': username})


# ---------------------- LOGOUT ----------------------
def logout_view(request):
    logout(request)
    return redirect('accounts:login_step1')


# ---------------------- SIGNUP STEP 1 ----------------------
def signup_step1(request):
    if request.method == 'POST':
        email = request.POST.get('email', '').strip()
        country = request.POST.get('country')
        consent = request.POST.get('consent')

        if not consent:
            messages.error(request, "You must consent to continue.")
        elif not email or not country:
            messages.error(request, "Please provide all required details.")
        else:
            request.session['signup_email'] = email
            request.session['signup_country'] = country
            return redirect('accounts:signup_step2')

    return render(request, 'accounts/auth/signup_step.html')


# ---------------------- SIGNUP STEP 2 ----------------------
def signup_step2(request):
    email = request.session.get('signup_email')
    country = request.session.get('signup_country')

    if not email or not country:
        messages.error(request, "Session expired. Start signup again.")
        return redirect('accounts:signup_step1')

    if request.method == 'POST':
        if 'back' in request.POST:
            return redirect('accounts:signup_step1')

        request.session['signup_first_name'] = request.POST.get('first_name', '').strip()
        request.session['signup_last_name'] = request.POST.get('last_name', '').strip()
        request.session['signup_birth_day'] = request.POST.get('birth_day')
        request.session['signup_birth_month'] = request.POST.get('birth_month')
        request.session['signup_birth_year'] = request.POST.get('birth_year')

        return redirect('accounts:signup_step3')

    return render(request, 'accounts/auth/signup_form.html')


# ---------------------- SIGNUP STEP 3 ----------------------
def signup_step3(request):
    required_keys = ['signup_email', 'signup_country', 'signup_first_name', 'signup_last_name']
    if not all(request.session.get(k) for k in required_keys):
        messages.error(request, "Session expired. Start signup again.")
        return redirect('accounts:signup_step1')

    if request.method == 'POST':
        if 'back' in request.POST:
            return redirect('accounts:signup_step2')

        username = request.POST.get('username', '').strip()
        password = request.POST.get('password')
        password2 = request.POST.get('password2')

        if not username or not password or not password2:
            messages.error(request, "Please fill in all required fields.")
        elif password != password2:
            messages.error(request, "Passwords do not match.")
        elif User.objects.filter(username=username).exists():
            messages.error(request, "Username already taken.")
        else:
            request.session['signup_username'] = username
            request.session['signup_password'] = password
            return redirect('accounts:signup_step4')

    return render(request, 'accounts/auth/signup_secrets.html')


# ---------------------- SIGNUP STEP 4 ----------------------
@require_http_methods(["GET", "POST"])
def signup_step4(request):
    """
    Final step of signup: verify user and create account.
    Redirects new users to subscription page.
    """
    required_keys = [
        'signup_email', 'signup_country', 'signup_first_name', 'signup_last_name',
        'signup_username', 'signup_password'
    ]

    if not all(request.session.get(k) for k in required_keys):
        messages.error(request, "Session expired. Please start signup again.")
        return redirect('accounts:signup_step1')

    if request.method == 'POST':
        if 'back' in request.POST:
            return redirect('accounts:signup_step3')

        code_entered = request.POST.get('verification_code', '').strip()

        if code_entered:
            email = request.session['signup_email']
            username = request.session['signup_username']

            # Check if email or username already exists
            if User.objects.filter(email=email).exists():
                messages.error(request, "An account with this email already exists.")
                return redirect('accounts:signup_step1')

            if User.objects.filter(username=username).exists():
                messages.error(request, "This username is already taken.")
                return redirect('accounts:signup_step3')

            # Create the user
            user = User.objects.create_user(
                username=username,
                email=email,
                password=request.session['signup_password'],
                first_name=request.session['signup_first_name'],
                last_name=request.session['signup_last_name'],
                terms_accepted=True  # permanently track acceptance
            )

            # Clear signup session keys
            for key in list(request.session.keys()):
                if key.startswith('signup_'):
                    del request.session[key]

            # Log in the user
            login(request, user)

            # Redirect based on subscription
            has_subscription = UserSubscription.objects.filter(user=user, active=True).exists()
            return redirect('accounts:user_profile' if has_subscription else 'accounts:subscription')

        else:
            messages.error(request, "Invalid verification code. Please try again.")

    return render(request, 'accounts/auth/signup_verification.html', {
        'username': request.session.get('signup_username'),
        'email': request.session.get('signup_email')
    })


# ---------------------- USER PROFILE ----------------------
@login_required
def user_profile_view(request):
    """
    Display the logged-in user's profile, subscription status,
    and recent activity.
    """

    # Active subscriptions for this user
    subscriptions = UserSubscription.objects.filter(user=request.user, active=True)

    # Example recent activity (replace with DB logs or real model later)
    recent_activity = [
        {
            "icon": "fa-music",
            "message": "Streamed: Blinding Lights",
            "timestamp": "2025-09-18 14:32"
        },
        {
            "icon": "fa-download",
            "message": "Downloaded: Shape of You",
            "timestamp": "2025-09-18 13:10"
        },
        {
            "icon": "fa-star",
            "message": "Added Top Hits to favorites",
            "timestamp": "2025-09-17 21:45"
        },
    ]

    context = {
        "user": request.user,
        "subscriptions": subscriptions,
        "recent_activity": recent_activity,
    }
    return render(request, "accounts/users/user_profile.html", context)

# ---------------------- USER EDIT PROFILE ----------------------
@login_required
def user_edit_profile_view(request):
    """
    Allow users to update their profile info (username, email, etc.).
    Extend this later for avatar uploads, first/last name, etc.
    """
    if request.method == "POST":
        username = request.POST.get("username", "").strip()
        email = request.POST.get("email", "").strip()

        if not username or not email:
            messages.error(request, "Username and email are required.")
        else:
            # Ensure username/email are unique (excluding current user)
            if User.objects.filter(username=username).exclude(id=request.user.id).exists():
                messages.error(request, "This username is already taken.")
            elif User.objects.filter(email=email).exclude(id=request.user.id).exists():
                messages.error(request, "This email is already in use.")
            else:
                request.user.username = username
                request.user.email = email
                request.user.save()
                messages.success(request, "Profile updated successfully.")
                return redirect("accounts:user_profile")

    return render(request, "accounts/users/user_edit_profile.html", {
        "user": request.user
    })

# ---------------------- USER SUBSCRIPTION PAGE ----------------------
@login_required
def user_subscription_view(request):
    user = request.user
    # Using related_name='subscriptions' in UserSubscription model
    has_subscription = user.subscriptions.filter(active=True).exists()  

    context = {
        'user': user,
        'has_subscription': has_subscription
    }
    return render(request, 'pages/subscription.html', context)

# ---------------------- USERS LIST (ADMIN ONLY) ----------------------
@login_required
def users_view(request):
    if not request.user.is_staff:
        messages.error(request, "Access denied.")
        return redirect('accounts:user_profile')

    all_users = User.objects.all()
    return render(request, 'accounts/users/users.html', {'users': all_users})

