from django.shortcuts import render, get_object_or_404, redirect
from django.contrib.auth.decorators import login_required
from django.utils import timezone
from datetime import timedelta
from .models import SubscriptionPlan, UserSubscription, PaymentMethod, Transaction

@login_required
def payments_home(request):
    """
    Display available subscription plans, active subscriptions,
    and transaction history for the logged-in user.
    """
    plans = SubscriptionPlan.objects.all()
    subscriptions = UserSubscription.objects.filter(user=request.user, active=True)
    transactions = Transaction.objects.filter(user=request.user).order_by('-timestamp')
    
    return render(request, "payments/payments.html", {
        "plans": plans,
        "subscriptions": subscriptions,
        "transactions": transactions,
    })


@login_required
def subscribe(request, plan_id):
    """
    Subscribe the logged-in user to a plan and create a transaction record.
    """
    plan = get_object_or_404(SubscriptionPlan, id=plan_id)
    end_date = timezone.now() + timedelta(days=plan.duration_days)
    
    # Create user subscription
    subscription = UserSubscription.objects.create(
        user=request.user,
        plan=plan,
        end_date=end_date,
        active=True
    )
    
    # Create a mock transaction (link PaymentMethod later if available)
    Transaction.objects.create(
        user=request.user,
        amount=plan.price,
        currency="USD",
        method=None,
        status="success"
    )
    
    return redirect("payments:home")
