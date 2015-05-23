define(['views/baseView'], function (BaseView) {
  'use strict';

  var BaseVideoView = BaseView.extend({

    //el: '#content',

    template: JST['client/templates/base_video.jst'],

    events: {
      'click .video-play': 'playVideo',
      'click .wrapper-timeline': 'goToVideoPoint'
    },

    fullBarWrapper: '.inner-timeline',
    timeLineWrapper: '.timeline',
    lineWrapper: '.line',

    initialize: function () {
      this.listenTo(window.Events, 'watcher::inactive', this.hideControls);
      this.listenTo(window.Events, 'watcher::active', this.showControls);
      this.listenTo(window.Events, 'video::updateCurrentTime', this.changeBarToPoint);
      this.listenTo(window.Events, 'video::onEnded', this.onEnded);

    },
    /**
     *  Esconde los controles del video.
     */
    hideControls: function (_callback) {
     // //console.log('SE EJECUTA HIDE');
      var timeLine = this.$el.find(this.timeLineWrapper);

      if (!timeLine.hasClass('inactive') && !this.activeHotSpot) {
        ////console.log('SE EJECUTA HIDE');
        ////console.log('active hotspiot : '+this.activeHotSpot);
        this.isActive = false;
        $('.title-ecualizador').removeClass('animated fadeInUp').addClass('animated fadeOutDown');
        $('#mascara').hide();
        if (timeLine && !timeLine.hasClass('inactive')) {
          this.addAnimatedClass(this.timeLineWrapper, 'animated fadeOutDown', function () {
            timeLine.addClass('inactive');
            if (_callback) {
              _callback();
            }
          });
        }
      }
    },

    /**
    * Esconde EL time line con hidden no con Display:none
    */
    hideControlsWithVisibility: function (_callback) {

      var timeLine = this.$el.find(this.timeLineWrapper);

      if (!timeLine.hasClass('inactiveHidden') && !this.activeHotSpot) {

        this.isActive = false;
        $('.title-ecualizador').removeClass('animated fadeInUp').addClass('animated fadeOutDown');
        $('#mascara').hide();
        if (timeLine && !timeLine.hasClass('inactiveHidden ')) {
          this.addAnimatedClass(this.timeLineWrapper, 'animated fadeOutDown', function () {
            timeLine.addClass('inactiveHidden');
            if (_callback) {
              _callback();
            }
          });
        }
      }
    },
    /**
     * Muestra los controles del video.
     */
    showControls: function () {
      ////console.log('SE EJECUTA SHOW');
      var timeLine = this.$el.find(this.timeLineWrapper);

      if (timeLine.hasClass('inactive')) {

        this.isActive = true;
        $('.title-ecualizador').removeClass('animated fadeOutDown').addClass('animated fadeInUp');
        $('#mascara').show();

        if (timeLine && timeLine.hasClass('inactive')) {
          timeLine.removeClass('inactive');
          this.addAnimatedClass(this.timeLineWrapper, 'animated fadeIn', false);
        }

      }
    },
    /**
     * Muestra los controles del video.
     */
    showControlsHidden: function () {

      var timeLine = this.$el.find(this.timeLineWrapper);

      if (timeLine.hasClass('inactiveHidden')) {

        this.isActive = true;
        $('.title-ecualizador').removeClass('animated fadeOutDown').addClass('animated fadeInUp');
        $('#mascara').show();

        if (timeLine && timeLine.hasClass('inactiveHidden')) {
          timeLine.removeClass('inactiveHidden');
          this.addAnimatedClass(this.timeLineWrapper, 'animated fadeIn', false);
        }

      }
    },


    onClose: function () {
      ////console.log('se cierra vista video'); //todo: por aqui no pasa al cerrar la vista
      clearInterval(window.app.timer);
      this.stopListening();
      window.app.lastVideoViewName=window.app.currentViewName;
     // //console.log('Last view : '+window.app.lastVideoViewName);
      //localStorage.setItem('videoState', 'play');
    },

    /**
     * Stop video
     * @param el
     */
    stopVideo: function (el) {

      if (el) {
        this.changeButtonClass(el, 'pause');
      }
      this.triggerVideoEvent('pause');

    },

    /**
     * Play Video
     * @param el
     */
    playVideo: function (el) {
      /**
       * Si se lanza desde la accion del boton.
       */
      if (el) {
        this.changeButtonClass(el, 'play');
      }
      this.triggerVideoEvent('play');

    },

    changeButtonClass: function (el, state) {
      var btn = $(el.currentTarget);
      var baseClass = 'pull-right control-video';
      btn.removeClass().addClass(baseClass + ' video-' + state);
      btn.find('img').attr('src', 'images/bot_timeline_' + state + '.png');
    },

    /**
     * Lanza el estado del video.
     * @param eventName
     */
    triggerVideoEvent: function (eventName) {

      //fire the event
      window.Events.trigger('video::' + eventName, window.app.currentViewName);

    },

    /**
     * Comprueba si el video anteriormente se habia parado para pararlo o viceversa.
     */
    checkVideoPreviusState: function () {

      /* if(localStorage.getItem('videoState')==='pause'){
       this.stopVideo(false);
       }else{
       this.playVideo(false);
       }*/

    },
    /**
     * Obtiene la posicion actual del video.
     * @returns {*}
     */
    getVideoState: function () {

      var defaultState = 'play';

      ////console.log(localStorage.getItem("videoState") ? localStorage.getItem("videoState") : defaultState);

      return localStorage.getItem("videoState") ? localStorage.getItem("videoState") : defaultState;
    },

    /**
     * Mueve el video al punto clickeado.
     * @param event
     */
    goToVideoPoint: function (event) {

      var originalTarget = $(event.originalEvent.target);

      var classByPassedList = ['subpoint-text','vertical-line','subpoint','hot-spot-img'];

      var hasInvalidClass = false;

      _.each(classByPassedList,function(invalidClass){
        if(originalTarget.hasClass(invalidClass)){
          hasInvalidClass = true;
        }
      });

      if (! hasInvalidClass ) { //Mientras no se clickee sobre un HotSpot.

        var xPosition = event.offsetX ? event.offsetX : event.originalEvent.layerX;

        var timeLine = $(event.currentTarget);
        var videoPosition = xPosition / timeLine.width() * 100;
        this.changeBarToPoint(videoPosition);
        ////console.log("Change to position: "+videoPosition);
        //fire the event
        window.Events.trigger('video::goToPosition', videoPosition.toFixed(2));
      }

    },
    /**
     * Inicializa la barra en la posicion donde se habia quedado.
     */
    initBarInPosition:function(){

      ////console.log('INIT BAR IN POSITION: '+localStorage.getItem('mainVideo::currentPercent'));
      var currentPosition =  localStorage.getItem('mainVideo::currentPercent');
      if(currentPosition){
        currentPosition =  Number(currentPosition);
        window.Events.trigger('video::goToPosition', currentPosition.toFixed(2));
        this.changeBarToPoint(currentPosition);
      }
    },

    /**
     * Cambia la posicion del timeline al porciento especificado.
     * @param percent
     */
    changeBarToPoint: function (percent) {

      $(this.fullBarWrapper).width(percent.toFixed(2).toString() + "%");
      this.onChangeTime(percent);

    },
    /**
     * Se implemta en la clase que herada
     */
    onChangeTime: function (percent) {},

    /**
     * Inicializa el Switch Control.
     */
    initializeSwitch: function () {

      this.$el.find("[name='switch-control']").bootstrapSwitch();
      this.$el.find("[name='switch-control']").one('switchChange.bootstrapSwitch', _.bind(this.switchOnChange, this));
      this.$el.find("[name='switch-control']").focus();

    },
    /**
     * Logica del cambio implementada en cada vista.
     */
    switchOnChange: function () {},

    /**
     * El video finaliza.
     */
    onEnded: function (event) {}


  });

  return BaseVideoView;
});
