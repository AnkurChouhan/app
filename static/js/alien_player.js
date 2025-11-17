/* static/js/alien_player.js
   Alien Player: converted from bbfly... -> Alien...
   Requires jQuery 1.12.4 (provided in template)
*/

(function($){
  // config: API endpoints
  var API_SONGS = '/api/songs/';
  var API_VIDEOS = '/api/videos/';
  var API_ALBUMS = '/api/albums/';
  var API_ARTISTS = '/api/artists/';

  var audio = document.getElementById('alien-audio');

  // state
  var AlienState = {
    songs: [],        // array of song objects from API
    videos: [],       // array of video objects from API
    currentSongIndex: -1,
    muted: false,
    shuffle: false,
    repeat: false
  };

  /* --------------------------
     UTILITIES
  ---------------------------*/
  function formatTime(seconds) {
    seconds = Math.floor(seconds || 0);
    var m = Math.floor(seconds / 60);
    var s = seconds % 60;
    return m + ':' + (s < 10 ? '0' + s : s);
  }

  function safeText(s) { return s == null ? '' : s; }

  /* --------------------------
     RENDERING / POPULATION
  ---------------------------*/
  function populateSongList(songs) {
    var $container = $('.audio-playlist.inner');
    $container.empty();
    var template = document.getElementById('song-template').content;
    songs.forEach(function(song, idx){
      var $node = $(template.cloneNode(true));
      var $wrap = $node.find('.the-song');
      $wrap.attr('data-index', idx);
      $wrap.find('.cover').css('background-image', 'url(' + (song.album_cover || '/static/images/placeholder-album.jpg') + ')');
      $wrap.find('.title').text(song.title || 'Untitled');
      $wrap.find('.author').text((song.artist_name || 'Unknown Artist') + ' — ' + (song.album_name || ''));
      $wrap.find('.duration').text(formatTime(song.duration));
      $container.append($wrap);

      $wrap.on('click', function(e){
        var i = parseInt($(this).attr('data-index'), 10);
        AlienPlaySong(i);
      });
    });
  }

  function populateVideoList(videos) {
    var $container = $('.video-playlist.inner');
    $container.empty();
    var template = document.getElementById('video-template').content;
    videos.forEach(function(video, idx){
      var $node = $(template.cloneNode(true));
      var $wrap = $node.find('.the-video');
      $wrap.attr('data-index', idx);
      $wrap.find('.cover').css('background-image', 'url(' + (video.thumbnail || '/static/images/placeholder-video.jpg') + ')');
      $wrap.find('.title').text(video.title || 'Untitled');
      $wrap.find('.author').text(video.author_name || 'Unknown');
      $wrap.find('.duration').text(formatTime(video.duration));
      $container.append($wrap);

      $wrap.on('click', function(e){
        var i = parseInt($(this).attr('data-index'), 10);
        AlienPlayVideo(i);
      });
    });
  }

  /* --------------------------
     API FETCHERS
  ---------------------------*/
  function AlienFetchSongs() {
    return $.ajax({
      url: API_SONGS,
      method: 'GET',
      dataType: 'json'
    }).done(function(data){
      AlienState.songs = data.results || data || [];
      populateSongList(AlienState.songs);
    });
  }

  function AlienFetchVideos() {
    return $.ajax({
      url: API_VIDEOS,
      method: 'GET',
      dataType: 'json'
    }).done(function(data){
      AlienState.videos = data.results || data || [];
      populateVideoList(AlienState.videos);
    });
  }

  /* --------------------------
     PLAYER CONTROLS (AUDIO)
  ---------------------------*/
  function AlienPlaySong(index) {
    if (!AlienState.songs || AlienState.songs.length === 0) return;
    if (index < 0 || index >= AlienState.songs.length) return;
    var song = AlienState.songs[index];
    AlienState.currentSongIndex = index;

    // update UI
    $('#mini-album-cover').css('background-image', 'url(' + (song.album_cover || '/static/images/placeholder-album.jpg') +')');
    $('.mini-title').text(song.title || 'No title');
    $('.mini-author').text(song.artist_name || 'Unknown');

    // set audio src & play
    audio.src = song.audio_file || song.stream_url || '';
    audio.load();
    audio.play();

    $('.mini-player-song').addClass('playing');
    $('.player-audio-min .play').addClass('active');

    // highlight currently playing in playlist
    $('.the-song').removeClass('playing current');
    $('.the-song[data-index="'+index+'"]').addClass('playing current');

    // update big player display too
    $('#alien-big-player .title').text(song.title || '');
    $('#alien-big-player .author').text(song.artist_name || '');
    $('#alien-big-player .album-cover-blur img').attr('src', song.album_cover || '/static/images/placeholder-album.jpg');
  }

  function AlienPlayNext() {
    var next;
    if (AlienState.shuffle) {
      next = Math.floor(Math.random()*AlienState.songs.length);
    } else {
      next = AlienState.currentSongIndex + 1;
      if (next >= AlienState.songs.length) {
        next = AlienState.repeat ? 0 : AlienState.songs.length - 1;
      }
    }
    AlienPlaySong(next);
  }

  function AlienPlayPrev() {
    var prev = AlienState.currentSongIndex - 1;
    if (prev < 0) prev = AlienState.repeat ? AlienState.songs.length - 1 : 0;
    AlienPlaySong(prev);
  }

  /* --------------------------
     PLAYER CONTROLS (VIDEO)
  ---------------------------*/
  function AlienPlayVideo(idx) {
    if (!AlienState.videos || AlienState.videos.length === 0) return;
    var video = AlienState.videos[idx];
    // open a modal or the mini video -> here we use the floating mini video widget
    $('#alien-mini-video').show();
    var v = document.getElementById('mini-video');
    v.src = video.video_file || video.url || '';
    v.play();
  }

  /* --------------------------
     Volume slider and mute/animate
  ---------------------------*/
  function AlienVolumePlayer() {
    // jQuery UI slider expects an element .volume
    if ($.fn.slider) {
      $(".volume").slider({
        min: 0, max: 100, value: 50, range: "min", animate: false,
        slide: function(event, ui) {
          setVolume((ui.value) / 100);
        }
      });
    }

    function setVolume(myVolume) {
      $('#alien-audio')[0].volume = myVolume;
      if (myVolume === 0) {
        $('.sound').addClass('muted');
      } else {
        $('.sound').removeClass('muted');
      }
    }
  }

  /* --------------------------
     Simulation: New comment + likes + load more
  ---------------------------*/
  function AlienSimulationNewComment() {
    $(document).on('click', '.video-player-leave-comment button', function(e){
      var text = $('.video-player-leave-comment input').val();
      if (text && text.trim() !== '') {
        var userProfileAvatar = '132sz6'; // placeholder
        var userProfileCountry = 'Unknown';
        var userProfileName = 'You';
        var markup = '<div class="comment-container published"><a href="profile.html"><div class="comment"><div class="gravatar" avatar="'+userProfileAvatar+'sz5" country="'+userProfileCountry+'"><img alt="UserAvatar" src="/static/images/community/'+userProfileAvatar+'sz2.jpg" class="avatar photo" width="100%" height="100%"></div><section><p>' + $('<div/>').text(text).html() + '</p></section><footer><cite class="author">'+userProfileName+'</cite><span class="date">Now</span></footer></div></a></div>';
        $('.video-player-comment-list').prepend(markup);
        $('.video-player-leave-comment input').val('');
      }
    });

    $(document).on('click', '.social-functions.like', function(){
      var $this = $(this);
      var n = parseInt($this.text()) || 0;
      if ($this.hasClass('active')) {
        $this.removeClass('active').text(n - 1);
      } else {
        $this.addClass('active').text(n + 1);
      }
    });

    // load more example (appends pre-canned HTML like your original)
    $(document).on('click', '.video-player-comment-container .load-more-button-container button.load-more', function(e){
      e.preventDefault();
      // Append a mock comment block for demo. Replace with API call as needed.
      var html = '<div class="published"><div class="comment"><div class="gravatar" avatar="129sz5" country="London"><img alt="UserAvatar" src="/static/images/community/129sz2.jpg" class="avatar photo" width="100%" height="100%"></div><section><p>One of my favorite songs — demo comment.</p></section><footer><cite class="author">John Hazey</cite><span class="date">1 month ago</span></footer></div></div>';
      $('.video-player-comment-list').append(html);
      $(this).prop('disabled', true);
    });
  }

  /* --------------------------
     Big/Mini Player interactions (renamed)
  ---------------------------*/
  function AlienCreateMusicPlayer() {
    // basic bindings that mirror your original code:
    // play/pause (mini)
    $('.player-audio-min.general .play').off('click').on('click', function(e){
      e.preventDefault();
      $('.mini-player-song').addClass('playing');
      $('.play').addClass('active');
      if (AlienState.muted) {
        $('audio').animate({volume:1}, 600, function(){
          audio.play();
          AlienState.muted = false;
        });
      } else {
        audio.play();
      }
    });

    $('.player-audio-min.general .pause').off('click').on('click', function(e){
      e.preventDefault();
      $('.mini-player-song').removeClass('playing');
      $('.play').removeClass('active');
      if (!AlienState.muted) {
        $('audio').animate({volume:0}, 600, function(){
          audio.pause();
          AlienState.muted = true;
        });
      } else {
        audio.pause();
      }
    });

    // Big player play/pause
    $('.player-command .playPause, button.play').off('click').on('click', function(e){
      e && e.preventDefault();
      if (!AlienState.muted) {
        $('.play').removeClass('active');
        $('audio').animate({volume:0}, 600, function(){
          audio.pause();
          AlienState.muted = true;
        });
      } else {
        $('.play').addClass('active');
        audio.play();
        $('audio').animate({volume:1},600, function(){
          AlienState.muted = false;
        });
      }
    });

    // next/prev
    $('.player-command .next').off('click').on('click', function(){
      AlienPlayNext();
    });
    $('.player-command .prev').off('click').on('click', function(){
      AlienPlayPrev();
    });

    // .the-song click handled in populateSongList
  }

  function AlienMiniPlayerAudio() {
    // Expand player when clicking the mini info to open big player
    $('.player-audio-min .player-song-info, .player-audio-min .mini-player .player-song-info').on('click', function(e){
      var checkClick = $(e.target).attr('checkClick');
      if (checkClick == 'checkClick') return;
      // open big player
      $('#alien-big-player').show();
      $('.player-audio-min.general').addClass('big big-active');
      setTimeout(function(){ $('.big.big-active .scrubber-options').addClass('open'); }, 600);
    });

    // minimize big player
    $(document).on('click', '.player-audio-min .headers[header-type="music-player"] .minimize', function(){
      $('#alien-big-player').removeClass('big big-active').hide();
    });
  }

  function AlienBigPlayerToggleButton() {
    // toggles for list, share, add-to, options adapted from your original code
    $('.player-command .list .icon').on('click', function(){
      $('.player-audio-min, .album-cover-blur, .container-album-cover, .up-next-option, .player-audio-min.big .scrubber-command.scrubber-options').toggleClass('active');
      $(this).toggleClass('active');
    });

    // heart toggle
    $('.player-command .heart').on('click', function(){ $(this).toggleClass('active'); });

    // add-to example feedback
    $('.add-to-button').on('click', function(){
      var $btn = $(this);
      if ($btn.hasClass('active')) {
        $btn.removeClass('active remove add');
      } else {
        $btn.addClass('add');
        setTimeout(function(){ $btn.addClass('active'); }, 700);
      }
    });

    // download flow simulation: open fake progress bar
    $('.music-player-option button.download').on('click', function(){
      $('.download-popup-container').addClass('open');
      // simulate download progress...
      var pct = 0;
      var intr = setInterval(function(){
        pct += Math.floor(Math.random()*10)+5;
        if (pct >= 100) { pct = 100; clearInterval(intr); setTimeout(function(){ $('.download-popup-container').removeClass('open'); }, 800); }
        $('.download-progress').css('width', pct + '%');
      }, 800);
    });
  }

  /* --------------------------
     Controller - sets everything up
  ---------------------------*/
  function AlienCreateControllerPlayer() {
    AlienCreateMusicPlayer();
    AlienMiniPlayerAudio();
    AlienBigPlayerToggleButton();

    // next/prev for audio controller (ensure playlist moves)
    $('.player-command .next').on('click', function(e){
      setTimeout(function(){
        AlienPlayNext();
      }, 100);
    });
    $('.player-command .prev').on('click', function(e){
      setTimeout(function(){
        AlienPlayPrev();
      }, 100);
    });

    // video next/prev similar (your original code had navigation inside playlists)
    $('.player-video-min .next').on('click', function(){ /* ... */ });
    $('.player-video-min .previous').on('click', function(){ /* ... */ });

    AlienSimulationNewComment();
    AlienVolumePlayer();
  }

  /* --------------------------
     INIT (on page load)
  ---------------------------*/
  $(document).ready(function(){
    // fetch playlists
    $.when(AlienFetchSongs(), AlienFetchVideos()).always(function(){
      // initialize controllers after lists loaded
      AlienCreateControllerPlayer();
      // autoplay first song if you want:
      // if (AlienState.songs.length) AlienPlaySong(0);
    });

    // audio element event updates
    $(audio).on('timeupdate', function(){
      var cur = audio.currentTime;
      var dur = audio.duration || 0;
      var pct = dur ? (cur / dur) * 100 : 0;
      $('.bar-fill').css('width', pct + '%');
      // display time somewhere if present
    });

    $(audio).on('ended', function(){
      // default behavior: next track
      if (AlienState.repeat) {
        audio.currentTime = 0; audio.play();
      } else {
        AlienPlayNext();
      }
    });

    // wire basic keyboard space toggling (optional)
    $(document).on('keydown', function(e){
      if (e.keyCode === 32) { e.preventDefault(); if (audio.paused) audio.play(); else audio.pause(); }
    });

    // initial UI wiring for like/heart
    $(document).on('click', '.the-song .delete-track', function(){
      var $playing = $('.the-song.playing');
      $playing.addClass('delete');
      $playing.animate({'width':'0','height':'0'}, 300, 'swing', function(){ $playing.remove(); });
    });

    // Follow / shuffle / repeat toggles (basic)
    $(document).on('click', '.shuffle', function(){ AlienState.shuffle = !AlienState.shuffle; $(this).toggleClass('active'); });
    $(document).on('click', '.repeat', function(){ AlienState.repeat = !AlienState.repeat; $(this).toggleClass('active'); });
  });

  // expose song play function to console if needed
  window.AlienPlaySong = AlienPlaySong;
  window.AlienPlayNext = AlienPlayNext;
  window.AlienPlayPrev = AlienPlayPrev;

})(jQuery);
