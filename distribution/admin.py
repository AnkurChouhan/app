from django.contrib import admin
from .models import Track

@admin.register(Track)
class TrackAdmin(admin.ModelAdmin):
    list_display = ('title', 'artist', 'genre', 'release_date', 'is_approved')
    list_filter = ('genre', 'is_approved')
    search_fields = ('title', 'artist__username')
