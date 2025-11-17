/* alien_shared.js
   Shared helpers and API fetchers used by audio & video modules.
   Uses jQuery (v1.x) like your original code.
*/

var AlienShared = (function($){
  'use strict';

  var apiBase = '/api/';

  function randomNumberFromRange(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  // Fetch helpers (return Promise)
  function fetchArtists() {
    return $.getJSON(apiBase + 'artists/');
  }
  function fetchAlbums() {
    return $.getJSON(apiBase + 'albums/');
  }
  function fetchSongs() {
    // include request context on server side via serializer
    return $.getJSON(apiBase + 'songs/');
  }
  function fetchVideos() {
    return $.getJSON(apiBase + 'videos/');
  }

  // Utility to build song DOM from API object (keeps your classes)
  function buildSongElement(song) {
    // song: {id, title, audio_url, album:{...}}
    var $el = $('<div class="the-song" data-id="' + song.id + '" data-src="' + song.audio_url + '"></div>');
    $el.append('<div class="the-song-left"><div class="song-thumb"><img src="' + (song.album && song.album.cover ? song.album.cover : '') + '" alt=""></div></div>');
    $el.append('<div class="the-song-right"><h3 class="song-title">' + song.title + '</h3><cite class="song-artist">' + (song.album && song.album.artist ? song.album.artist.name : '') + '</cite></div>');
    return $el;
  }

  function buildVideoElement(video) {
    var $el = $('<div class="the-video" data-id="' + video.id + '" data-src="' + video.video_url + '" avatar="" album-cover=""><div class="video-container"><div class="video-avatar"><img alt="avatar" src="'+ (video.poster || '') +'" class="avatar" width="100%" height="100%"></div><div class="video-info"><h2 class="title">'+ video.title +'</h2><cite class="author">'+ (video.artist?video.artist.name:'') +'</cite></div></div></div>');
    return $el;
  }

  // Public API
  return {
    randomNumberFromRange: randomNumberFromRange,
    fetchArtists: fetchArtists,
    fetchAlbums: fetchAlbums,
    fetchSongs: fetchSongs,
    fetchVideos: fetchVideos,
    buildSongElement: buildSongElement,
    buildVideoElement: buildVideoElement
  };

})(jQuery);
