# accounts/urls.py
from django.urls import path
from django.contrib.auth import views as auth_views
from . import views

# Import player view from home
from home.views import player_page

# Optional: Home dashboard check
try:
    from home import views as home_views
    home_dashboard_available = True
except ImportError:
    home_dashboard_available = False

app_name = 'accounts'

urlpatterns = [

    # ---------------------- LOGIN ----------------------
    path('login/', views.login_step1, name='login_step1'),
    path('login/secrets/', views.login_step2, name='login_step2'),

    # ---------------------- LOGOUT ----------------------
    path('logout/', views.logout_view, name='logout'),

    # ---------------------- SIGNUP ----------------------
    path('signup/', views.signup_step1, name='signup_step1'),
    path('signup/form/', views.signup_step2, name='signup_step2'),
    path('signup/secrets/', views.signup_step3, name='signup_step3'),
    path('signup/verify/', views.signup_step4, name='signup_step4'),

    # ---------------------- PASSWORD RESET ----------------------
    path(
        'password_reset/',
        auth_views.PasswordResetView.as_view(template_name='accounts/auth/forget_password.html'),
        name='password_reset'
    ),
    path(
        'password_reset/done/',
        auth_views.PasswordResetDoneView.as_view(template_name='accounts/auth/password_reset_done.html'),
        name='password_reset_done'
    ),
    path(
        'reset/<uidb64>/<token>/',
        auth_views.PasswordResetConfirmView.as_view(template_name='accounts/auth/password_reset_confirm.html'),
        name='password_reset_confirm'
    ),
    path(
        'reset/done/',
        auth_views.PasswordResetCompleteView.as_view(template_name='accounts/auth/password_reset_complete.html'),
        name='password_reset_complete'
    ),

    # ---------------------- USERS LIST ----------------------
    path('users/', views.users_view, name='users'),

    # ---------------------- PROFILE ----------------------
    path('profile/', views.user_profile_view, name='user_profile'),
    path('profile/edit/', views.user_edit_profile_view, name='user_edit_profile'),
    path('subscription/', views.user_subscription_view, name='subscription'),

    # ---------------------- 🔥 NEW: Player page fix ----------------------
    # This makes /accounts/player work properly
    path('player/', player_page, name='accounts_player'),
]

# ---------------------- OPTIONAL HOME DASHBOARD ----------------------
if home_dashboard_available:
    urlpatterns.append(
        path('home-dashboard/', home_views.dashboard_view, name='home_dashboard')
    )
