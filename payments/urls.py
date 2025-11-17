from django.urls import path
from . import views

app_name = "payments"  # important for namespacing

urlpatterns = [
    path('', views.payments_home, name='home'),          # payments:home
    path('subscribe/<int:plan_id>/', views.subscribe, name='subscribe'),  # payments:subscribe
]
