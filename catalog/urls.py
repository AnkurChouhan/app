from django.urls import path, include
from rest_framework import routers
from .views import (
    ArtistViewSet,
    AlbumViewSet,
    SongViewSet,
    VideoViewSet
)

router = routers.DefaultRouter()
router.register(r'artists', ArtistViewSet)
router.register(r'albums', AlbumViewSet)
router.register(r'songs', SongViewSet)
router.register(r'videos', VideoViewSet)

urlpatterns = [
    path('api/', include(router.urls)),
]
