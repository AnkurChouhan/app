from django.db import models
from django.conf import settings

class SubscriptionPlan(models.Model):
    name = models.CharField(max_length=100)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    duration_days = models.PositiveIntegerField()  # e.g., 30 for monthly

    def __str__(self):
        return f"{self.name} - {self.price}$ for {self.duration_days} days"


class UserSubscription(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    plan = models.ForeignKey(SubscriptionPlan, on_delete=models.CASCADE)
    start_date = models.DateTimeField(auto_now_add=True)
    end_date = models.DateTimeField()
    active = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.user} - {self.plan}"


class PaymentMethod(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    method_type = models.CharField(max_length=50, choices=(
        ("card", "Credit/Debit Card"),
        ("paypal", "PayPal"),
    ))
    details = models.CharField(max_length=255)  # mock (e.g., last 4 digits)

    def __str__(self):
        return f"{self.user} - {self.method_type}"


class Transaction(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    currency = models.CharField(max_length=10, default="USD")
    method = models.ForeignKey(PaymentMethod, on_delete=models.SET_NULL, null=True, blank=True)
    status = models.CharField(max_length=20, choices=(
        ("success", "Success"),
        ("failed", "Failed"),
        ("pending", "Pending"),
    ), default="pending")
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user} - {self.amount} {self.currency} - {self.status}"
