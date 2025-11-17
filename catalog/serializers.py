from rest_framework import serializers
from .models import Artist, Album, Song, Video
from django.conf import settings

class ArtistSerializer(serializers.ModelSerializer):
    class Meta:
        model = Artist
        fields = ['id', 'name', 'bio', 'avatar', 'cover', 'slug']

class SongSerializer(serializers.ModelSerializer):
    audio_url = serializers.SerializerMethodField()
    album_title = serializers.CharField(source='album.title', read_only=True)
    artist = serializers.CharField(source='album.artist.name', read_only=True)

    class Meta:
        model = Song
        fields = ['id', 'title', 'audio_file', 'audio_url', 'duration', 'track_number', 'album', 'album_title', 'artist', 'likes', 'created_at']

    def get_audio_url(self, obj):
        request = self.context.get('request')
        if obj.audio_file:
            return request.build_absolute_uri(obj.audio_file.url) if request else obj.audio_file.url
        return None

class AlbumSerializer(serializers.ModelSerializer):
    songs = SongSerializer(many=True, read_only=True)
    artist = ArtistSerializer(read_only=True)
    cover_url = serializers.SerializerMethodField()

    class Meta:
        model = Album
        fields = ['id', 'title', 'artist', 'cover', 'cover_url', 'release_date', 'slug', 'songs']

    def get_cover_url(self, obj):
        request = self.context.get('request')
        if obj.cover:
            return request.build_absolute_uri(obj.cover.url) if request else obj.cover.url
        return None

class VideoSerializer(serializers.ModelSerializer):
    video_url = serializers.SerializerMethodField()
    thumbnail_url = serializers.SerializerMethodField()
    album_title = serializers.CharField(source='album.title', read_only=True, default=None)

    class Meta:
        model = Video
        fields = ['id', 'title', 'video_file', 'video_url', 'external_url', 'thumbnail', 'thumbnail_url', 'album', 'album_title', 'created_at']

    def get_video_url(self, obj):
        request = self.context.get('request')
        if obj.video_file:
            return request.build_absolute_uri(obj.video_file.url) if request else obj.video_file.url
        return obj.external_url

    def get_thumbnail_url(self, obj):
        request = self.context.get('request')
        if obj.thumbnail:
            return request.build_absolute_uri(obj.thumbnail.url) if request else obj.thumbnail.url
        return None
