define(['views/baseView'], function (BaseView) {
  'use strict';

  var BackgroundVideoView = BaseView.extend({

    template: JST['client/templates/modules/background_video.jst'],


    /* Path of the video file without the extension! */
    videoUrl: 'data/CH_video',

    videoWrapper: '#bgVideo',
    default_sample_time: 200, // 1/2 seg.
    isPaused: false,
    isVisible: true,

    initialize: function () {
      window.app.currentViewName = 'Background_Video';

      //binding events.
      this.listenTo(window.Events, 'video::pause', this.pauseVideo);
      this.listenTo(window.Events, 'video::play', this.playVideo);
      this.listenTo(window.Events, 'video::goToPosition', this.goToPosition);

      //Timing de actualizacion de la barra.
      var scope = this;
      this.timer = setInterval(function () {
          return scope.updateCurrentTime();
        }, //set the delay time.
        this.default_sample_time);

    },

    show: function () {
      var scope = this;
      /**
       * espera medio segundo antes de visualizar el video para evitar efecto raro en carga
       */
      this.waiting = setTimeout(function () {
        ////console.log("TESTING");
        if (scope.stateMachineAction('play')) {
          scope.playVideo('BackgroundVideoView');
        }
        scope.$el.show();
        scope.isVisible = true;
        /**
         * Esconde la mascara negra
         * a menos de que sea el video del timeline o del ecualizador
         */
        ////console.log(window.app.currentViewName);
        if (window.app.currentViewName != 'Timeline' && window.app.currentViewName != 'Ecualizador') {
          ////console.log('mascara off');
          $("#mascara").hide();
        } else {
          ////console.log('mascara on');
          $("#mascara").show();
        }

        // Dispara evento cuando finaliza el video.
        document.getElementById("bgVideo").onended = function () {
          ////console.log('video::onended');
          window.Events.trigger('video::onEnded');

          scope.trackEvent({
            'event':  'gaEvent',
            'eventCategory': 'videos',
            'eventAction': 'vipclubedition-'+scope.videoUrl,
            'eventLabel': '100%',
            "eventNoninteraction": true
          });

          //console.log("TRACKING END: "+ scope.videoUrl);
        };

        clearInterval(scope.waiting);

      }, 500);
    },

    stateMachineAction: function (eventType) {

      if ((window.app.currentViewName === "Timeline") || (window.app.currentViewName === "Ecualizador")) {

        if (!localStorage.getItem('videoState')) {
          return true;
        } else {
          return localStorage.getItem('videoState') === eventType;
        }

      } else {
        return true;
      }
    },

    /**
     * Muestra la mascara negra
     */
    hide: function () {
      ////console.log('mascara on');
      $("#mascara").show();
      this.pauseVideo('BackgroundVideoView');
      this.$el.hide();
      this.isVisible = false;
    },

    onClose: function () {
      //unbinding events.
      clearInterval(this.timer);
      this.stopListening();
    },

    render: function () {
      var scope = this;

      ////console.log(this.videoUrl);

      this.setVideoUrl(this.videoUrl, ['mp4', 'webm', 'ogv'], true);

      if (window.app.backgroundType != 'video') {
        this.hide();
      }

      return this;
    },

    /**
     * Posiciona el video en la posicion seleccionada.
     * @param percent (%)
     */
    goToPosition: function (percent) {
      ////console.log("video go to position : "+ percent);
      if ($(this.videoWrapper).get(0)) {
        var time = percent * $(this.videoWrapper).get(0).duration / 100;
        $(this.videoWrapper).get(0).currentTime = time;
      }
    },

    /**
     * Dispara evento con la actualización del Current Time del Video.
     */
    updateCurrentTime: function () {
      /*//console.log("Get current time");*/
      if ($(this.videoWrapper).get(0)) {
        var percent = $(this.videoWrapper).get(0).currentTime / $(this.videoWrapper).get(0).duration * 100;
        window.Events.trigger('video::updateCurrentTime', percent);
      }
    },

    /**
     * PLay the Video Background
     */
    playVideo: function (fromView) {

      ////console.log('Playing video from: ' + fromView);

      this.isPaused = false;
      ////console.log("Se elimina blur");
      $("#backgroundVideo").removeClass('blur');
      $(this.videoWrapper).get(0).play();

    },

    /**
     * Stop de Video Background
     */
    pauseVideo: function (fromView) {

      ////console.log('Stoping Video from: ' + fromView);

      this.isPaused = true;

      if ($(this.videoWrapper).get(0)) {
        if (!$("#backgroundVideo").hasClass('blur')) {
          $("#backgroundVideo").addClass('blur');
        }
        $(this.videoWrapper).get(0).pause();
      }

    },

    /**
     * Set the videoUrl for background.
     * and render the view
     * @param {string} videoUrl - Path of the video file without the extension!
     * @param {array} extensions - List of the extensions used
     * @param {boolean} force - (Optional) Force render the view, for videoUrl with the same path. Defaul: false
     */
    setVideoUrl: function (videoUrl, extensions, force) {
      if (this.videoUrl != videoUrl || force) {
        ////console.log('Se pinta background video');

        this.videoUrl = videoUrl;

        /**
         foreach for dinamic num of extensions
         ex:
         mp4Url: this.videoUrl + '.mp4',
         webmUrl: this.videoUrl + '.webm',
         ogvUrl: this.videoUrl + '.ogv'
         */
        var data = {'videoUrl': this.videoUrl};
        _.each(extensions, function (ext) {
          data[ext + 'Url'] = data.videoUrl + '.' + ext;
        });

        this.$el.html(this.template(data));

        this._25percent = false;
        this._50percent = false;
        this._75percent = false;

        this.watchVideoLoad();
        this.watchPointsPercents();


      }
    },
    /**
     * Lanza los eventos de tracking de los videos cuando va pasando por los puntos.
     */
    watchPointsPercents:function(){
      var video = this.$el.find(this.videoWrapper).get(0);
      var scope = this;

      $(video).on('timeupdate',function(event){

          if ($(scope.videoWrapper).get(0)) {
            var percent = $(scope.videoWrapper).get(0).currentTime / $(scope.videoWrapper).get(0).duration * 100;

            if(!scope._25percent && percent > 25 && percent < 26 ){
              ////console.log("TRACKING EVENT 25% VIDEO: "+scope.videoUrl);
              scope._25percent = true;
              scope.trackEvent({
                'event':  'gaEvent',
                'eventCategory': 'videos',
                'eventAction': 'vipclubedition-'+scope.videoUrl,
                'eventLabel': '25%',
                "eventNoninteraction": true
              });

            }else if(!scope._50percent && percent > 50 && percent < 51 ){
              ////console.log("TRACKING EVENT 50% VIDEO: "+scope.videoUrl);
              scope._50percent = true;
              scope.trackEvent({
                'event':  'gaEvent',
                'eventCategory': 'videos',
                'eventAction': 'vipclubedition-'+scope.videoUrl,
                'eventLabel': '50%',
                "eventNoninteraction": true
              });

            }else if(!scope._75percent && percent > 75 && percent < 76 ){

              ////console.log("TRACKING EVENT 75% VIDEO: "+scope.videoUrl);
              scope._75percent = true;
              scope.trackEvent({
                'event':  'gaEvent',
                'eventCategory': 'videos',
                'eventAction': 'vipclubedition-'+scope.videoUrl,
                'eventLabel': '75%',
                "eventNoninteraction": true
              });

          }
        }
      });
    },

    /**
     * Lanza un evento cuando ya está el video listo para ser reproducido.
     */
    watchVideoLoad:function(){

      var video = this.$el.find(this.videoWrapper).get(0);
      var scope = this;

      $(video).one('canplay',function(){

        scope.trackEvent({
          'event':  'gaEvent',
          'eventCategory': 'videos',
          'eventAction': 'vipclubedition-'+scope.videoUrl,
          'eventLabel': 'start',
          "eventNoninteraction": true
        });

        //console.log("TRACKING VIDEO PLAY: "+ scope.videoUrl);
        window.Events.trigger('BackGroundVideo::canplay');
      });

    }
  });

  return BackgroundVideoView;

});
