/* alien_video.js
   Video player module renamed from your video functions to Alien*.
   Expects jQuery and alien_shared.js
*/

(function($, Shared){
  'use strict';

  function AlienCreateVideoAndPlayerEffect() {
    // Load videos from API and populate a vertical playlist
    Shared.fetchVideos().done(function(data){
      var $container = $('.vertical-playlist-video .inner');
      $container.empty();
      for (var i=0;i<data.length;i++){
        var v = data[i];
        var $videoEl = Shared.buildVideoElement(v);
        $videoEl.appendTo($container);
      }

      // bind clicks
      $('.the-video').off('click').on('click', function(e){
        var checkClick = $(e.target).attr('checkClick');
        if (checkClick == 'checkClick') return;
        var src = $(this).data('src');
        if (!src) return;
        // open video player overlay (keep your classes/structure)
        $('.player-video-overlay video').attr('src', src);
        $('.player-video-overlay').addClass('open');
        $('.page').addClass('nope');
      });
    });

    // close overlay
    $('.player-video-overlay .close').on('click', function(){
      $('.player-video-overlay').removeClass('open');
      $('.player-video-overlay video').attr('src','');
      $('.page').removeClass('nope');
    });

    // load more / simulate comments (keeps your original handlers)
    $('.video-player-comment-container .load-more-button-container button.load-more').on('click', function(e) {
      // you can fetch more comments if you have an endpoint — for now it's simulated
      // keep original behavior: disable button after adding
      var $last = $('.video-player-comment-list .published:last-of-type');
      var demo = $('<div class="published"><div class="comment"><div class="gravatar" avatar="129sz5" country="London"><img alt="UserAvatar" src="/static/src/images/community/129sz2.jpg" class="avatar photo" width="100%" height="100%"></div><section><p>Great video!</p></section><footer><cite class="author">Demo User</cite><span class="date">Now</span></footer></div></div>');
      demo.insertAfter($last);
      $(this).prop("disabled", true);
    });
  }

  // Expose the function
  window.AlienCreateVideoAndPlayerEffect = AlienCreateVideoAndPlayerEffect;

  // Init on document ready
  $(function(){
    AlienCreateVideoAndPlayerEffect();
  });

})(jQuery, AlienShared);
