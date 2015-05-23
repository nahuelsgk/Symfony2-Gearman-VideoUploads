define(['views/baseVideoView'], function (BaseVideoView, tag) {
  'use strict';

  var VideoView = BaseVideoView.extend({

    //el: '#content',
    tag: '',
    videoUrl: '',

    template: JST['client/templates/video.jst'],

    timeOutBtnIsDone:true,
    btnTime:0,

    events: {
      'click .video-pause': 'playVideo',
      'click .video-play': 'stopVideo',
      'click .wrapper-timeline': 'goToVideoPoint',
      'click #back': 'onBackHandler',
      'click #participate': 'onParticiapteHandler'
    },

    initialize: function (tag, hasParticipateBtn) {
      this.tag = (typeof(tag) === 'string') ? tag : 'default';
      this.hasParticipateBtn = (typeof(hasParticipateBtn) === 'boolean') ? tag : true;

      BaseVideoView.prototype.initialize.apply(this);

      //reset para cuando vuelva a timeline.
      localStorage.setItem('videoState', 'play');

    },

    render: function () {

      var scope = this;

      window.app.currentViewName = 'Video';

      window.app.FormTagCollection.each(function (_tag) {

        // //console.log(_tag.get('tag'), scope.tag);

        if (_tag.get('tag') == scope.tag) {

          window.app.backgroundType = 'video';
          scope.videoUrl = _tag.get('video');
        }
      });
      if (this.videoUrl != '') {
        window.app.backgroundVideo.setVideoUrl(this.videoUrl, ['mp4', 'webm', 'ogv']);
      }

      this.$el.html(this.template({
        nam: window.app.currentViewName,
        tag: this.tag,
        participate: this.hasParticipateBtn,
        bot1: window.app.LocaleCollection.get(1).get('video')[0].string,
        bot2: window.app.LocaleCollection.get(1).get('video')[1].string,
        t3: window.app.LocaleCollection.get(1).get("timeline_ecualizador")[4].string,
        t4: window.app.LocaleCollection.get(1).get("timeline_ecualizador")[5].string
      }));

      /**
       * Wait for Dom Ready.
       * @type {number}
       */
      this.waitingAfterRender = setInterval(function () {
        clearInterval(scope.waitingAfterRender);
        $('#mascara').show();

      }, 800);

      setTimeout(function () {
        scope.hideControls();
      }, 2000);

      return this;
    },
    /**
     * Retorna el Estado actual
     */
    checkStatePoint:function(){

      var timelineInactive = this.$el.find(this.timeLineWrapper).hasClass('inactiveHidden');
      var btnInactive = this.$el.find('#participate').hasClass('inactive');

      if(timelineInactive && btnInactive && this.timeOutBtnIsDone){ //Estado oculto todas las cosas.

        return 1;

      }else if( ! timelineInactive && !btnInactive && this.timeOutBtnIsDone){ // Estado mostrando todas las cosas.

        return 2;

      }else if(timelineInactive && !btnInactive && !this.timeOutBtnIsDone ){ //El btn está mostrado y no el timeline.

        return 3;
      }



    },
    /**
     * Independiza el tiempo del btn y el timeline.
     */
    hideControls: function () {
      var scope = this;

      switch (this.checkStatePoint()){

        case 1: {  // All is hidden
          //do nothing
          ////console.log("All is hidden: DO NOTHING");
          break;
        }
        case 2: { // All is showing
          ////console.log("All IS SHOWED: HIDE BAT , WAITNG BTN.");
          this.timeOutBtnIsDone = false;
          this.btnPartciparTimeOut = setTimeout(function () {
            ////console.log("SE LANZA INACTIVIDAD DEL BTN");
            var btn = scope.$el.find('#participate');
            if (!btn.hasClass('inactive')) {
                scope.addAnimatedClass(btn, 'animated fadeOutDown', function () {
                btn.addClass('inactive');
                btn.css('visibility','hidden');
                scope.timeOutBtnIsDone =  true;
                ////console.log("SE EJECUTA LA ESPERA Y SE OCULTA EL BTN.");
              });
            }
          }, scope.btnTime);
          //Esconde timeline.
          VideoView.__super__.hideControlsWithVisibility.apply(this, arguments);
          break;
        }
        case 3: { //timeline hidden btn showed.
          ////console.log("timeline is already hidden and btn esta esperando para esconderse: DO NOTHING");
          break;
        }
      }

    },
    /**
     * Overwrite original show controlsN
     * Independiza el btn del timeline.
     */
    showControls: function () {

      switch (this.checkStatePoint()){

        case 1: {  // All is hidden
          ////console.log("All is hidden: SHOW ALL");
          var btn = this.$el.find('#participate');
          btn.removeClass('inactive');
          btn.css('visibility','visible');
          this.addAnimatedClass(btn, 'animated fadeIn', false);
          VideoView.__super__.showControlsHidden.apply(this, arguments);
          ////console.log("SE HA MOSTRADO EL BTN Y EL TIMELINE..");
          break;
        }
        case 2: { // All is showing
          ////console.log("All IS SHOWED: Do nothing.");
          break;
        }
        case 3: { //timeline hidden btn showed.
          ////console.log("timeline is already hidden and btn esta esperando para esconderse:RESET SHOW ");
          clearTimeout(this.btnPartciparTimeOut);
          this.timeOutBtnIsDone = true;
          VideoView.__super__.showControlsHidden.apply(this, arguments);
          break;
        }
      }

    },

    onClose: function () {
      VideoView.__super__.onClose.apply(this, arguments);
      $('#mascara').hide();
    },

    onBackHandler: function (event) {
      return window.app.navigate('participate/' + this.tag, {trigger: true});
    },
    onParticiapteHandler: function (event) {
      return window.app.navigate('participate/' + this.tag + '/signup', {trigger: true});
    },

    /**
     * El video finaliza.
     */
    onEnded: function (event) {
      ////console.log(this.tag);

      if (this.tag == 'behindScenes' || this.tag == 'collaboration' || this.tag == 'makingOff' || this.tag == 'liveShow') {
        /*this.playVideo(window.app.currentViewName); //loop*/
        return window.app.navigate('timeline', {trigger: true});
      } else {
        return window.app.navigate('participate/' + this.tag + '/signup', {trigger: true});
      }
    }

  });

  return VideoView;
});
