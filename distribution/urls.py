from django.urls import path
from . import views

urlpatterns = [
    path('', views.dashboard_view, name='dashboard'),  # http://127.0.0.1:8000/dashboard/
]
