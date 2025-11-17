/* alien_audio.js
   Audio player code converted from your bbfly* handlers to Alien* names.
   This file expects jQuery and alien_shared.js to be loaded.
*/

(function($, Shared){
  'use strict';

  // Internal audio element & state
  var audio = document.createElement('audio');
  audio.preload = 'metadata';
  var muted = false;
  var playlist = []; // array of song objects
  var currentIndex = -1;

  function getSongIndexById(id) {
    for (var i=0;i<playlist.length;i++){
      if (playlist[i].id == id) return i;
    }
    return -1;
  }

  // Replace bbflyCreateMusicPlayer() -> AlienCreateMusicPlayer()
  function AlienCreateMusicPlayer() {
    // inject audio element into the DOM (if you'd prefer an existing <audio>, adapt)
    if (!$('audio#alien-audio').length) {
      $(audio).attr('id','alien-audio').appendTo('body');
    } else {
      audio = $('audio#alien-audio')[0];
    }

    // Hook: clicking a song in the playlist
    $('.playlist-song .the-song').off('click').on('click', function(e){
      var checkClick = $(e.target).attr('checkClick');
      if (checkClick == 'checkClick') return;
      var src = $(this).data('src');
      var id = $(this).data('id');
      var idx = getSongIndexById(id);
      if (idx === -1 && src){
        // If song is not in playlist, add it
        playlist.push({id:id, title:$(this).find('.song-title').text(), audio_url:src});
        idx = playlist.length -1;
      }
      playIndex(idx);
      // update UI classes (preserve your classes)
      $('.playlist-song .the-song').removeClass('playing current');
      $(this).addClass('playing current');
    });

    // small like button behaviour - keep original
    $('.social-functions.like').off('click').on('click', function() {
      var likeNumber = $(this).text(),
          like = parseInt(likeNumber) || 0;
      if ( $(this).hasClass('active') ) {
        $(this).removeClass('active');
        $(this).text(like - 1);
      } else {
        $(this).addClass('active');
        $(this).text(like + 1);
      }
    });

    // Play/Pause big controls
    $('.player-command .playPause, button.play').off('click').on('click', function(e){
      e.preventDefault();
      if (!muted) {
        $('.play').removeClass('active');
        $('audio').animate({volume: 0}, 600, function () {
          // pause through API
          audio.pause();
          muted = true;
        });
      } else {
        $('.play').addClass('active');
        audio.play();
        $('audio').animate({volume: 1}, 600, function () {
          muted = false;
        });
      }
    });

    // Mini player play/pause
    $('.player-audio-min.general .play').off('click').on('click', function(e){
      e.preventDefault();
      $('.mini-player-song').addClass('playing');
      $('.play').addClass('active');
      if (muted) {
        $('audio').animate({volume: 1}, 600, function () {
          audio.play();
          muted = false;
        });
      } else {
        audio.play();
      }
    });
    $('.player-audio-min.general .pause').off('click').on('click', function(e){
      e.preventDefault();
      $('.mini-player-song').removeClass('playing');
      $('.play').removeClass('active');
      if (!muted) {
        $('audio').animate({volume: 0}, 600, function () {
          audio.pause();
          muted = true;
        });
      } else {
        audio.pause();
      }
    });

    // Prev / Next arrows (audio)
    $('.player-command .next').off('click').on('click', function(e){
      e.preventDefault();
      AlienNextTrack();
    });
    $('.player-command .prev').off('click').on('click', function(e){
      e.preventDefault();
      AlienPrevTrack();
    });

    // Volume slider using jQuery UI slider
    AlienVolumePlayer();

    // Load initial playlist from API
    Shared.fetchSongs().done(function(data){
      // data is array of songs
      playlist = data;
      $('.playlist-song .inner').empty();
      for (var i=0;i<playlist.length;i++){
        var s = playlist[i];
        var $songEl = Shared.buildSongElement(s);
        $songEl.appendTo('.playlist-song .inner');
      }
      // rebind click handlers
      AlienCreateMusicPlayer(); // re-init handlers after adding songs (harmless)
    });

    // audio ended -> next
    $(audio).off('ended').on('ended', function(){
      AlienNextTrack();
    });
  }

  function playIndex(idx) {
    if (idx < 0 || idx >= playlist.length) return;
    currentIndex = idx;
    var song = playlist[idx];
    if (!song || !song.audio_url) return;
    audio.src = song.audio_url;
    audio.play();
    $('.player-audio-min .title-author h2').text(song.title || '');
    $('.player-audio-min .album-cover img').attr('src', (song.album && song.album.cover) ? song.album.cover : '');
    // update UI state classes
    $('.the-song').removeClass('playing current');
    $('.the-song[data-id="' + song.id + '"]').addClass('playing current');
  }

  function AlienNextTrack() {
    if (playlist.length === 0) return;
    var next = (currentIndex + 1) % playlist.length;
    playIndex(next);
  }
  function AlienPrevTrack() {
    if (playlist.length === 0) return;
    var prev = (currentIndex - 1 + playlist.length) % playlist.length;
    playIndex(prev);
  }

  // Volume controls copied/adapted from your bbflyVolumePlayer
  function AlienVolumePlayer() {
    var Volumeaudio = audio;
    var volumeDrag = false;

    // make sure the DOM has .volume and .volumeBar elements
    $('.volume').off('touchStart mousedown').on('touchStart mousedown', function (e) {
      volumeDrag = true;
      Volumeaudio.muted = false;
      $('.sound').removeClass('muted');
    });
    $(document).off('touchEnd mouseup').on('touchEnd mouseup', function (e) {
      if (volumeDrag) {
        volumeDrag = false;
        updateVolume(e.pageX);
        $('.volume-content').removeClass('active');
      }
    });
    $(document).off('mousemove').on('mousemove', function (e) {
      if (volumeDrag) {
        updateVolume(e.pageX);
      }
    });

    function updateVolume(a) {
      var volume = $('.volume');
      var position = a - volume.offset().left;
      var percentage = 100 * position / volume.width();
      if (percentage > 100) percentage = 100;
      if (percentage < 0) percentage = 0;
      Volumeaudio.volume = percentage / 100;
      $('.volumeBar').css('width', percentage + '%');
      if (Volumeaudio.volume == 0) {
        $('.sound').removeClass('sound2').addClass('muted');
      } else if (Volumeaudio.volume > 0.5) {
        $('.sound').removeClass('muted').addClass('sound2');
      } else {
        $('.sound').removeClass('muted').removeClass('sound2');
      }
    }
  }

  // The big player toggle actions (converted from bbflyBigPlayerToggleButton)
  function AlienBigPlayerToggleButton() {
    // delete track
    $('.the-song .delete-track').on('click', function() {
      $('.the-song.playing').addClass('delete');
      $('.the-song.playing').animate( {'width':'0','height':'0'}, 300, 'swing');
      setTimeout(function(){ $('.the-song.playing.delete').remove() }, 1000);
    });

    $('.player-command .list .icon').on('click', function() {
      $('.player-audio-min, .album-cover-blur, .container-album-cover, .up-next-option, .player-audio-min.big .scrubber-command.scrubber-options').toggleClass('active');
      $(this).toggleClass('active');
    });

    $('.player-command .heart').on('click', function() { $(this).toggleClass('active'); });
  }

  // Public functions exported
  window.AlienCreateMusicPlayer = AlienCreateMusicPlayer;
  window.AlienMiniPlayerAudio = function(){ /* kept for compatibility with your calls */ };
  window.AlienBigPlayerToggleButton = AlienBigPlayerToggleButton;
  window.AlienNextTrack = AlienNextTrack;
  window.AlienPrevTrack = AlienPrevTrack;

  // Auto-init on document ready (you can call explicitly too)
  $(function(){
    AlienCreateMusicPlayer();
    AlienBigPlayerToggleButton();
  });

})(jQuery, AlienShared);
