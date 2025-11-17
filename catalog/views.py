from django.shortcuts import render
from rest_framework import viewsets
from .models import Artist, Album, Song, Video
from .serializers import ArtistSerializer, AlbumSerializer, SongSerializer, VideoSerializer


# ===== API VIEWSETS =====

class ArtistViewSet(viewsets.ModelViewSet):
    queryset = Artist.objects.all()
    serializer_class = ArtistSerializer


class AlbumViewSet(viewsets.ModelViewSet):
    queryset = Album.objects.all()
    serializer_class = AlbumSerializer


class SongViewSet(viewsets.ModelViewSet):
    queryset = Song.objects.all()
    serializer_class = SongSerializer


class VideoViewSet(viewsets.ModelViewSet):
    queryset = Video.objects.all()
    serializer_class = VideoSerializer


# ===== PLAYER PAGE =====

def player_page(request):
    return render(request, "catalog/player.html")
