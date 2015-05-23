define(['views/baseVideoView'], function (BaseVideoView) {
  'use strict';

  var TimeLineView = BaseVideoView.extend({

    //el: '#content',

    template: JST['client/templates/timeline.jst'],

    events: {
      'click .video-pause': 'playVideo',
      'click .video-play': 'stopVideo',
      'click .wrapper-timeline': 'goToVideoPoint',
      'click .hot-spot': 'goToHotSpotRegister',
      'click .subpoint': 'goToSubPoint',
      'mouseover .subpoint-text': 'toggleHotSpotAlesso',
      'mouseout .subpoint-text': 'toggleHotSpotAlesso',
      'mouseover .timeline': 'setNotHide',
      'mouseout .timeline': 'setHide'
    },

    barTimeLineLength: 0,
    hoverTimeLine: false,
    firsTimeUpdateBar: true,

    initialize: function () {

      this.on('renderDone', this.afterRender);

      this.listenTo(window.Events, 'BackGroundVideo::canplay', this.initBarInPosition);

      //////console.log(('Se pinta la vista');

      BaseVideoView.prototype.initialize.apply(this);

      this.checkVideoPreviusState();

    },

    render: function () {
      window.app.currentViewName = 'Timeline';
      window.Events.trigger('NotBackButton::Initialize');

      this.$el.html(this.template({
        t1: window.app.LocaleCollection.get(1).get('timeline_ecualizador')[0].string,
        t2: window.app.LocaleCollection.get(1).get('timeline_ecualizador')[1].string,
        t3: window.app.LocaleCollection.get(1).get("timeline_ecualizador")[4].string,
        t4: window.app.LocaleCollection.get(1).get("timeline_ecualizador")[5].string,
        name: window.app.currentViewName,
        locale: window.app.locale,
        hotSpots: window.app.HotSpotsCollection.toJSON(),
        buttonState: this.getVideoState(),
        sizmekCode:this.trackingSizmek(620795)
      }));

      setTimeout(function () {
        var is_Mac = navigator.platform.toUpperCase().indexOf('MAC')>=0;
        if(is_Mac){
          $('html').addClass('mac');
        }
        var isSafari = /constructor/i.test(window.HTMLElement);
        if(isSafari){
          $('html').addClass('safari');
        }
      }, 500);

      this.trigger('renderDone');

      return this;
    },

    afterRender: function () {

      //////console.log(('Se ha lanzado el afterRender');

      var scope = this;

      this.initializeSwitch();

      if (localStorage.getItem('timeLine::firstTimeShowed') === 'true') { //Solo se muestra la presentacion la primera vez

        this.initStateAnimation();
        setTimeout(function () {
          scope.timeLinePresentation();
        }, 500);

      } else if (window.app.lastViewName !== 'Ecualizador') {
        //////console.log(('Normal presentation');
        this.addAnimatedClass('.timeline', 'animated fadeInUp', false);
        $('.title-ecualizador').removeClass('animated fadeOutDown').addClass('animated fadeInUp');
      } else {
        //////console.log(('Come from Ecualizador');
        this.comeFromEcualizador();
      }

      this.initBarInPosition();

    },

    initBarInPosition:function(){

      if(window.app.lastVideoViewName !== 'Ecualizador' ){

        TimeLineView.__super__.initBarInPosition.apply(this, arguments);

      }
    },

    /**
     * Overwrite onClose
     */
    onClose: function () {

      localStorage.setItem('mainVideo::currentPercent',this.currentTime );

      TimeLineView.__super__.onClose.apply(this, arguments);

      /*  //console.log('Timeline::se elimina timeline view'+this.cid);*/
      window.Events.trigger('NotBackButton::Close');

    },

    /**
     * Lanza el estado del video.
     * @param eventName
     */
    triggerVideoEvent: function (eventName) {

      //se salva variable de estado de posicion de video.
      localStorage.setItem('videoState', eventName);

      TimeLineView.__super__.triggerVideoEvent.apply(this, arguments);

    },

    /**
     * Cambia la posicion del timeline al porciento especificado.
     * @param percent
     */
    changeBarToPoint: function (percent) {

      this.watchOverHotSpot(percent);
      BaseVideoView.prototype.changeBarToPoint.apply(this, arguments);

    },
    /**
     * Redirige al hotspot clickeado.
     * @param event
     */
    goToHotSpotRegister: function (event) {

      ////console.log('GO TO HOTSPOT');

      if (localStorage.getItem('timeLine::firstTimeShowed') === 'false') {

        var hotSpot = window.app.HotSpotsCollection.get($(event.currentTarget).attr('id'));
        console.log(hotSpot);
        if (hotSpot.get('type') != 'drop-up') {
          this.hideControls(function(){
            window.app.navigate('/participate/' + hotSpot.get('name'), {trigger: true});
          });
        }

      } else {
        ////console.log('DO NOTHING: No ha terminado la presentacion.');
      }

    },
    /**
     * Esconde la barra y ejecuta callback cuando termina.
     * @param callback @type:function
     */
    fadeOutTimeLine: function (callback) {
      var scope = this;
      $(this.timeLineWrapper).addClass('animated fadeOutDownBig');
      $(this.timeLineWrapper).one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function () {
        $(scope.timeLineWrapper).removeClass('animated fadeOutDownBig');
        callback();
      });
    },
    /**
     * Pregunta si existe algun hotspot por donde está pasando la barra.
     * Si es asi lo destaca.
     * @param currentPercent
     */
    watchOverHotSpot: function (currentPercent) {
      var scope = this;
      var gap = 2;
      var gap2 = 7;

      if (localStorage.getItem('timeLine::firstTimeShowed') === 'false') { //Si es la primera vez q se muestra no hace esta funcion.

        window.app.HotSpotsCollection.each(function (hotSpot) {

          var imgWrapper = scope.$el.find('#' + hotSpot.id).find('.wrapper-hot-spot-img');

          //watch golden border in hotspots.
          if(currentPercent >= hotSpot.get('position')+ gap ){
            if( ! imgWrapper.hasClass('golden'))
              imgWrapper.addClass('golden');

          }else{
            imgWrapper.removeClass('golden');
          }

          //watch golden border in vertical line.
          if(hotSpot.get('id')==='hs1' && currentPercent >= hotSpot.get('position')){
            if(!scope.$el.find('.vertical-line').hasClass('golden'))
              scope.$el.find('.vertical-line').addClass('golden');

            if(!scope.$el.find('.subpoint.active-sub-point img').hasClass('golden')){
              scope.$el.find('.subpoint.active-sub-point img').addClass('golden')
            }

          }else if(hotSpot.get('id')==='hs1'){
            scope.$el.find('.vertical-line').removeClass('golden');
            scope.$el.find('.subpoint.active-sub-point img').removeClass('golden');
          }

          if (currentPercent >= hotSpot.get('position') + gap && currentPercent < hotSpot.get('position') + gap2) {

            scope.highLightHotSpot(hotSpot);
            /**
             * La barra está oculta.
             */
            if(!scope.isActive){
              scope.showControls();
            }


            ////console.log('Entro en el gap + activiveHotspot'+scope.activeHotSpot);

          } else {
            scope.removeHighLightHotSpot(hotSpot);

          }
          ////console.log('activiveHotspot'+scope.activeHotSpot);
        });
      }
    },

    /**
     * Obliga el Hover del HotSpot.
     * @param hotSpot (HotSpot Model)
     */
    highLightHotSpot: function (hotSpot) {

      ////console.log('highLightHotSpot:: active hotspot is: '+this.activeHotSpot);
      var wrapperImgHotSpot = this.$el.find('#' + hotSpot.id).find('.wrapper-hot-spot-img');

      if (!wrapperImgHotSpot.hasClass('hover')) {

        wrapperImgHotSpot.addClass('hover');
        /**
         * Showing Alesso Drop Up in HightLight
         */
        var allessoDropUp = window.app.HotSpotsCollection.findWhere({type:'drop-up'});

        if(hotSpot.id == allessoDropUp.get('id') && ! this.showedAlesso ){
          this.showedAlesso = true;
          this.$el.find('.vertical-line').addClass('golden');
          this.$el.find('#'+allessoDropUp.get('id')).addClass('hover').delay(3000).queue(function(){
            $(this).removeClass("hover").dequeue();
          });

        }

      }
    },
    /**
     * Elimina el señalamiento del hotSpot.
     * @param hotSpot
     */
    removeHighLightHotSpot: function (hotSpot) {
      ////console.log('removeHighLightHotSpot:: active hotspot is: '+this.activeHotSpot);
      $('#' + hotSpot.id).find('.wrapper-hot-spot-img').removeClass('hover');
    },
    /**
     * True si algun hotspot esta activo.
     */
    checkActiveHotspot:function(){
      if(this.$el.find('.wrapper-hot-spot-img').hasClass('hover')){
        this.activeHotSpot =  true;
      }else{
        this.activeHotSpot = false;
      }
    },

    /**
     * Handler del Switch OnChange.
     * @param event
     * @param state
     */
    switchOnChange: function (event, state) {
      if (!state) {
        this.goToEcualizador();
      }
    },
    /**
     * Go to Ecualizador.
     */
    goToEcualizador: function () {
      var scope = this;
      this.addAnimatedClass('.hot-spot', 'animated fadeOut', function () {
        scope.$el.find('.hot-spot').hide();
        window.app.navigate('/ecualizador', {trigger: true});
      });

    },

    /**
     * Animación del Time Line la primera vez que se muestra.
     */
    timeLinePresentation: function () {
      var scope = this;
      //Show Control Video Button
      $('.title-ecualizador').removeClass('animated fadeOutDown').addClass('animated fadeInUp');
      this.showControlVideo(function () {
        //Display Progressive Bar. And HotSpots
        scope.showProgressiveTimeLineWrapper(function () {
          scope.$el.find('.hot-spot-text').show();
          scope.addAnimatedClass('.hot-spot-text', 'animated fadeInDown', function () {
            scope.$el.find('.switch-control').css('visibility', 'visible');
            scope.$el.find('[name="switch-control"]').focus();
            scope.addAnimatedClass('.switch-control', 'animated fadeInLeft', function () {
              localStorage.setItem('timeLine::firstTimeShowed', false);
              window.Events.trigger('timeline::endPresentation');
            });
          });
        });
      });
      /**
       * Espera el termino de la animación y esconde la barra.
       * @type {number}
       */
      var timer = setTimeout(function () {
        if (!scope.hoverTimeLine) { // Si no están parados sobre la barra, la esconde.
          scope.hideControls(false);
        }
        clearInterval(timer);
      }, 6000); //tiempo de la animacion demora 5554 aprox.
    },
    /**
     * Estado inicial para la animación.
     */
    initStateAnimation: function () {
      var switchControl = this.$el.find('.switch-control');
      var controlVideo = this.$el.find('.control-video');
      var hotSpots = this.$el.find('.hot-spot');
      var hotSpotTexts = this.$el.find('.hot-spot-text');

      switchControl.css('visibility', 'hidden');
      controlVideo.hide();
      hotSpotTexts.hide();
      hotSpots.hide();
      this.timeLineWrapperWidthControl(0);
    },
    /**
     * Muestra la entrada del Control de Video.
     * @param _callback
     */
    showControlVideo: function (_callback) {
      var controlVideo = this.$el.find('.control-video');
      controlVideo.show();
      this.addAnimatedClass('.control-video', 'animated fadeInLeft', _callback);
    },
    /**
     * Muestra de forma progresiva la barra Wrapper de Time Line.
     * @param _callback - done function.
     */
    showProgressiveTimeLineWrapper: function (_callback) {
      var scope = this;
      var velocity = 70;
      window.app.timeLineTimer = setInterval(function () {
        scope.increaseLength(_callback);
      }, 1000 / velocity);
    },
    /**
     * Incrementa la barra. Lanza callback cuando llega al 100%.
     * @param _callback
     */
    increaseLength: function (_callback) {

      var distancePerPoint = 1;

      this.barTimeLineLength += distancePerPoint;

      if (this.barTimeLineLength >= 100) {

        this.timeLineWrapperWidthControl(100);
        this.barTimeLineLength = 0;
        clearInterval(window.app.timeLineTimer);
        if (_callback) {
          _callback();
        }

      } else {
        this.timeLineWrapperWidthControl(this.barTimeLineLength);
      }
    },
    /**
     * Controla el % del TimeLine Wrapper.
     * @param size
     */
    timeLineWrapperWidthControl: function (size) {
      var timeLine = this.$el.find('.wrapper-timeline');
      timeLine.width(size + '%');
      //add Show hotsPots Here.
      var currentHotSpot = window.app.HotSpotsCollection.findWhere({position: size});
      if (currentHotSpot) {

        $('#' + currentHotSpot.get('id')).show();
        this.addAnimatedClass('#' + currentHotSpot.get('id'), 'animated slideInLeft animation-fast-presentation zindexMax', false);
      }

    },
    /**
     * Animacion cuando se viene de Ecualizador.
     */
    comeFromEcualizador: function () {
      this.$el.find('.hot-spot').show();
      this.addAnimatedClass('.hot-spot', 'animated fadeIn', false);
    },

    /**
     * Handler animation Menú Alesso (HotSpot)
     */
    toggleHotSpotAlesso: function (event) {

      var $_li = this.$el.find(event.currentTarget.parentElement.parentElement);

      if ($_li.hasClass('active-sub-point')) {
        $_li.removeClass('active-sub-point');
      } else {
        $_li.addClass('active-sub-point');
      }

    },

    /**
     * Settea la variable para q no sea ocultada la barra durante la presentacion.
     */
    setNotHide: function () {
      this.hoverTimeLine = true;
    },
    /**
     * Settea la variable para q Sea ocultada la barra durante la presentacion.
     */
    setHide: function () {
      this.hoverTimeLine = false;
    },

    /**
     * El video finaliza.
     */
    onEnded: function (event) {
      this.playVideo(window.app.currentViewName);
      this.showedAlesso = false;
      this.$el.find('.vertical-line').removeClass('golden');
    },
    /**
     * Cada vez q se actualiza el tiempo del video.
     * @param percent
     */
    onChangeTime:function(percent){
      this.currentTime = percent;
      this.checkActiveHotspot();
    },


    /**
     *  Esconde los controles del video.
     */
    hideControls: function (_callback) {
      if(localStorage.getItem('timeLine::firstTimeShowed') !== 'true'){
        TimeLineView.__super__.hideControls.apply(this, arguments);
      }
    },
    /**
     * Go to A Subpoint (Alesso Menu)
     * @param event
     */
    goToSubPoint: function (event) {

      var pointUrl = $(event.currentTarget).attr('data-value');

      this.hideControls(function(){
        window.app.navigate(pointUrl, {trigger: true});
      });

    }






  });

  return TimeLineView;
});
