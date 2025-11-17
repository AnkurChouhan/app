from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils import timezone

# ---------------------- CUSTOM USER ----------------------
class User(AbstractUser):
    email = models.EmailField(unique=True)
    terms_accepted = models.BooleanField(default=True)  # always required
    # Add more fields if needed (e.g., country, birthdate, etc.)
    country = models.CharField(max_length=100, blank=True, null=True)
    birth_date = models.DateField(blank=True, null=True)

    def __str__(self):
        return self.username


# ---------------------- USER SUBSCRIPTION ----------------------
class UserSubscription(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='subscriptions')
    plan_name = models.CharField(max_length=100)
    active = models.BooleanField(default=True)
    started_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return f"{self.user.username} - {self.plan_name}"

    def is_active(self):
        """Check if the subscription is currently active"""
        if self.expires_at:
            return self.active and self.expires_at > timezone.now()
        return self.active
