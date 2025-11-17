from django.db import models
from accounts.models import User

class Track(models.Model):
    artist = models.ForeignKey(User, on_delete=models.CASCADE)
    title = models.CharField(max_length=255)
    audio_file = models.FileField(upload_to="tracks/")
    cover_art = models.ImageField(upload_to="covers/")
    genre = models.CharField(max_length=100)
    release_date = models.DateField()
    is_approved = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.title} by {self.artist.username}"
