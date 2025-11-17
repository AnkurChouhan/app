from django import forms
from .models import Track

class TrackUploadForm(forms.ModelForm):
    class Meta:
        model = Track
        fields = ['title', 'audio_file', 'cover_art', 'genre', 'release_date']
