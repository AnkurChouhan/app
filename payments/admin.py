from django.contrib import admin
from .models import SubscriptionPlan, UserSubscription, PaymentMethod, Transaction

@admin.register(SubscriptionPlan)
class SubscriptionPlanAdmin(admin.ModelAdmin):
    list_display = ('name', 'price', 'duration_days')
    search_fields = ('name',)

@admin.register(UserSubscription)
class UserSubscriptionAdmin(admin.ModelAdmin):
    list_display = ('user', 'plan', 'start_date', 'end_date', 'active')
    list_filter = ('active',)
    search_fields = ('user__username', 'plan__name')

@admin.register(PaymentMethod)
class PaymentMethodAdmin(admin.ModelAdmin):
    list_display = ('user', 'method_type', 'details')
    search_fields = ('user__username', 'details')

@admin.register(Transaction)
class TransactionAdmin(admin.ModelAdmin):
    list_display = ('user', 'amount', 'currency', 'method', 'status', 'timestamp')
    list_filter = ('status',)
    search_fields = ('user__username',)
