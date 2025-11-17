from django.shortcuts import render
from django.contrib.auth.decorators import login_required


def home_view(request):
    return render(request, 'home.html')


@login_required
def dashboard_view(request):
    return render(request, 'distribution/dashboard.html')


@login_required
def player_page(request):
    return render(request, 'player/player.html')
