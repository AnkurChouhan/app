from django.contrib import admin
from .models import Artist, Album, Song, Video

@admin.register(Artist)
class ArtistAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug')
    prepopulated_fields = {'slug': ('name',)}
    search_fields = ('name',)

@admin.register(Album)
class AlbumAdmin(admin.ModelAdmin):
    list_display = ('title', 'artist', 'release_date', 'slug')
    prepopulated_fields = {'slug': ('title',)}
    list_filter = ('artist',)
    search_fields = ('title', 'artist__name')

@admin.register(Song)
class SongAdmin(admin.ModelAdmin):
    list_display = ('title', 'album', 'track_number', 'duration', 'created_at')
    list_filter = ('album__artist',)
    search_fields = ('title', 'album__title')

@admin.register(Video)
class VideoAdmin(admin.ModelAdmin):
    list_display = ('title', 'album', 'external_url')
    search_fields = ('title',)
