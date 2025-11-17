from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

class Artist(models.Model):
    name = models.CharField(max_length=255)
    bio = models.TextField(blank=True)
    avatar = models.ImageField(upload_to='artists/avatars/', blank=True, null=True)
    cover = models.ImageField(upload_to='artists/covers/', blank=True, null=True)
    slug = models.SlugField(max_length=255, unique=True)

    def __str__(self):
        return self.name

class Album(models.Model):
    artist = models.ForeignKey(Artist, related_name='albums', on_delete=models.CASCADE)
    title = models.CharField(max_length=255)
    cover = models.ImageField(upload_to='albums/covers/', blank=True, null=True)
    release_date = models.DateField(blank=True, null=True)
    slug = models.SlugField(max_length=255, unique=True)

    def __str__(self):
        return f"{self.title} — {self.artist.name}"

class Song(models.Model):
    album = models.ForeignKey(Album, related_name='songs', on_delete=models.CASCADE)
    title = models.CharField(max_length=255)
    audio_file = models.FileField(upload_to='songs/audio/')
    duration = models.PositiveIntegerField(blank=True, null=True, help_text='Duration in seconds (optional)')
    track_number = models.PositiveIntegerField(blank=True, null=True)
    explicit = models.BooleanField(default=False)
    likes = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.title} — {self.album.title}"

class Video(models.Model):
    album = models.ForeignKey(Album, related_name='videos', on_delete=models.SET_NULL, blank=True, null=True)
    title = models.CharField(max_length=255)
    video_file = models.FileField(upload_to='videos/files/', blank=True, null=True)
    external_url = models.URLField(blank=True, null=True, help_text='Use this for yt/vimeo links; file optional')
    duration = models.PositiveIntegerField(blank=True, null=True)
    thumbnail = models.ImageField(upload_to='videos/thumbs/', blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title
