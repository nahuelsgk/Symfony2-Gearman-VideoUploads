define(['views/baseVideoView'], function (BaseVideoView) {
  'use strict';

  var EcualizadorView = BaseVideoView.extend({

    //el: '#content',

    template: JST['client/templates/ecualizador.jst'],

    events: {
      'click .video-pause': 'playVideo',
      'click .video-play': 'stopVideo',
      'click .wrapper-timeline': 'goToVideoPoint',
      'click canvas': 'showParticipantInPosition',
      'mousemove canvas': 'showParticipantOnRollover'

    },

    barsClassNumber: 5,
    barsActive: true,
    lastCurrentTime: 0,
    barsFrequency: 100, // 10Hz
    showParticipantFrequency: 3000, //2s

    posX: 0,
    espera: null,

    initialize: function () {

      //this.initShowParticipantsFrequency();

      $(window).on("resize", _.bind(this.paintCanvasBars, this));

      this.listenTo(window.Events, 'video::updateCurrentTime', this.changeBarToPoint);
      this.listenTo(window.Events, 'video::onEnded', this.onEnded);

      this.checkVideoPreviusState();

      if (localStorage.getItem('videoState') === 'pause') {
        this.barsActive = false;
      }

    },

    onClose: function () {

      localStorage.setItem('mainVideo::currentPercent', this.currentTime);

      EcualizadorView.__super__.onClose.apply(this, arguments);

      $(window).off("resize", this.paintCanvasBars);

      if (this.barUpdateTimer) {
        clearInterval(this.barUpdateTimer);
      }

      if (this.participantTimer) {
        clearInterval(this.participantTimer);
      }

      window.Events.trigger('NotBackButton::Close');
    },

    /**
     * Se esconde barra y texto.
     */
    hideControls: function () {

      var scope = this;

      var timeLine = this.$el.find(this.timeLineWrapper);

      $('#mascara').hide();

      if (timeLine && !timeLine.hasClass('inactive')) {

        this.isActive = false;

        this.addAnimatedClass(this.timeLineWrapper, 'animated fadeOutDown', function () {

          timeLine.addClass('inactive');

        });

        this.addAnimatedClass(scope.$el.find('.wrapper-text'), 'animated fadeOutDown', function () {

          scope.$el.find('.wrapper-text').hide();

        });
      }

    },

    /**
     * Muestra los controles del video.
     */
    showControls: function () {

      var scope = this;

      var timeLine = this.$el.find(this.timeLineWrapper);

      $('#mascara').show();

      if (timeLine && timeLine.hasClass('inactive')) {

        this.isActive = true;

        timeLine.removeClass('inactive');

        this.addAnimatedClass(this.timeLineWrapper, 'animated fadeInUp', false);

        this.$el.find('.wrapper-text').show();

        this.addAnimatedClass(this.$el.find('.wrapper-text'), 'animated fadeInUp', false);

      }

    },

    render: function () {

      window.app.currentViewName = 'Ecualizador';
      //console.log('currentViewName: ' + window.app.currentViewName);
      window.app.lastViewName = window.app.currentViewName;

      var scope = this;

      this.$el.html(this.template({
        t1: window.app.LocaleCollection.get(1).get("timeline_ecualizador")[0].string,
        t2: window.app.LocaleCollection.get(1).get("timeline_ecualizador")[1].string,
        t3: window.app.LocaleCollection.get(1).get("timeline_ecualizador")[2].string,
        t4: window.app.LocaleCollection.get(1).get("timeline_ecualizador")[3].string,
        name: window.app.currentViewName,
        buttonState: this.getVideoState()
      }));

      this.initializeSwitch();

      var intTimer = setInterval(function () {
        clearInterval(intTimer);
        scope.initCanvasBar(".wrapper-sound-bars");
        $('canvas').addClass('animated fadeIn');
        scope.loadParticpants(function () {
          scope.appendParticipants();
        });
        window.Events.trigger('NotBackButton::Initialize');
      }, 200);

      this.initBarInPosition();

      return this;
    },

    initBarInPosition: function () {
      if (window.app.lastVideoViewName !== 'Timeline') {
        EcualizadorView.__super__.initBarInPosition.apply(this, arguments);
      }
    },

    /**
     * Inyecta los participantes en el DOM .
     * Se hace de esta manera para q no demore la carga de la barra al pintar la vista
     * y no se vea el salto que se crea de timeline -> ecualizador.
     */
    appendParticipants: function () {

      var html = '';
      var wrapperPartcicpants = this.$el.find('.wrapper-participants');

      /* this.participants.each(function (participant) {

       participant = participant.toJSON();

       if (participant.position < 85) { //Evita participantes que desborden la linea.
       html += '<li id="' + participant.id + '" class="participant" style="margin-left:' + participant.position + '%">' + '<p>' + '<span class="participant-name"><strong>' + participant.name + '</strong></span><br>' + '<span class="participant-city">' + participant.country + '</span><br>' + '<span class="participant-date">' + participant.date + '</span>' + '</p>' + '</li>';
       }

       }); */

      var participant = {
        id: 'rollover',
        name: '',
        country: '',
        date: ''
      };

      html += '<li id="' + participant.id + '" class="participant" style="position:absolute;left:0">' + '<p>' + '<span class="participant-name"><strong>' + participant.name + '</strong></span><br>' + '<span class="participant-city">' + participant.country + '</span><br>' + '<span class="participant-date">' + participant.date + '</span>' + '</p>' + '</li>';

      wrapperPartcicpants.html(html);

    },
    /**
     * Crea el objeto canvas
     * @param divName
     * @returns {CanvasRenderingContext2D|*}
     */
    createCanvas: function (divName) {

      var div = $(divName);
      var canvas = document.createElement('canvas');

      div.append(canvas);

      if (typeof G_vmlCanvasManager != 'undefined') {
        canvas = G_vmlCanvasManager.initElement(canvas);
      }

      return canvas.getContext("2d");
    },

    /**
     * Initialize the canvas bar.
     */
    initCanvasBar: function (elementContainer) {

      var ctx = this.createCanvas(elementContainer);

      var scope = this;

      this.canvasBar = new BarGraph(ctx);
      this.canvasBar.margin = 1;
      this.canvasBar.barWidth = 3;
      this.canvasBar.height = 80;
      this.canvasBar.backgroundColor = "rgba(0, 0, 255, 0.1)";
      this.canvasBar.backgroundColor = "rgba(0, 0, 255, 0.1)";
      this.canvasBar.colors = ["#a67a12", "rgba(176, 176, 175, 1)"]; // 0.5 transparencia

      this.animationInterval = 300;
      this.animationSteps = 60;

      this.barUpdateTimer = setInterval(function () {

        if (scope.barsActive) {
          scope.paintCanvasBars();
        }

      }, 200);

    },
    /**
     * Pinta el canvas actualizado .
     */
    paintCanvasBars: function () {

      var barValueArray = this.getBarsValues(this.canvasBar, false);

      this.canvasBar.update(barValueArray);

    },
    /**
     * Obtiene el width actual segun el tamaño deseado de la barra.
     * @returns {number}
     */
    getCurrentWidth: function () {
      var grid11 = 0.82; // % de la grilla 10 / grilla 12
      return $(window).width() * grid11;
    },
    /**
     * Obtiene el numero de barras para un canvas.
     * @param canvas
     * @returns {string}
     */
    getBarsNumber: function (canvas) {

      canvas.width = this.getCurrentWidth();

      return (canvas.width / (canvas.barWidth + canvas.margin)).toFixed(0);
    },
    /**
     * Devuelve el juego de valores para pintar el canvas.
     * @param canvas
     * @param empty - boolean - Si retorna un conjunto de datos randoms o solo conjunto de 0
     * @returns {Array}
     */
    getBarsValues: function (canvas, empty) {

      var barsNumbers = this.getBarsNumber(canvas);

      var baseOffSet = 4;

      var barValueArray = [];
      var barColorArray = [];

      var i;

      if (empty) {

        for (i = 0; i < barsNumbers; i++) {

          barValueArray.push(0.2);
          barColorArray.push(this.getBarColorInPosition(i, barsNumbers));
        }

      } else {

        for (i = 0; i < barsNumbers; i++) {

          barValueArray.push(baseOffSet + Math.random() * 20);
          barColorArray.push(this.getBarColorInPosition(i, barsNumbers));
        }
      }

      //update colors.
      canvas.colors = barColorArray;

      return barValueArray;
    },
    /**
     * Obtiene el color que le corresponde a la barra
     * @param barNumber
     * @param totalBarsNumbers
     * @returns {string}
     */
    getBarColorInPosition: function (barNumber, totalBarsNumbers) {

      var lineWidth = $(this.fullBarWrapper).width();

      var paddingLeft = 10; //10px

      var barraLargo = this.canvasBar.barWidth + this.canvasBar.margin;

      var barraCurrentPosition = barraLargo * barNumber + paddingLeft;

      return (barraCurrentPosition <= lineWidth) ? "#a67a12" : "rgba(176, 176, 175, 1)"; // .5 transparencia
    },

    /**
     * Elimina Las barras con una transition hacia abajo.
     * Demora 2s antes de hacer la transition.
     */
    toggleUpDownBars: function () {

      // //console.log("Se apaga la barra");

      var barsEmpties = this.getBarsValues(this.canvasBar, true);

      this.canvasBar.offBars(barsEmpties);

      $('canvas').addClass('animated fadeOut');
      /* $('canvas').hide();*/

    },

    /**
     * Inicializa el tiempo en que serán mostrados los partcipantes.
     */
    initShowParticipantsFrequency: function () {

      //Timing de actualizacion de la barra.
      var scope = this;

      this.participantTimer = setInterval(function () {
          return scope.activeParticipantsInTime();
        }, //set the delay time.
        this.showParticipantFrequency);
    },

    /**
     * Carga el listado de participantes.
     * @param _callback - Ejecuta cuando se terminan de cargar participantes.
     */
    loadParticpants: function (_callback) {

      //console.log('loadParticpants');

      this.participants = new Backbone.Collection();
      //this.participants.url = 'data/participants.json';
      var userIdFilter = window.app.user.isAuthenticated() ? window.app.user.get('id') : 0;
      this.participants.url = _SERVER_PATH + '/participations/' + userIdFilter;
      this.participants.fetch({
        success: function () {
          //todo: window.app.user.hasParticpation() ? scope.participants.push(window.app.user.get('participationList')):false;
          _callback();
        },
        error: function () {
          ////console.log('Error cargando listado de particpantes');
          _callback();
        }
      });
    },
    /**
     * Stop video overwrite
     * @param el
     */
    stopVideo: function (el) {
      this.barsActive = false;
      EcualizadorView.__super__.stopVideo.apply(this, arguments);
    },
    /**
     * Play video overwrite
     * @param el
     */
    playVideo: function (el) {
      this.barsActive = true;
      EcualizadorView.__super__.playVideo.apply(this, arguments);
    },

    /**
     * Lanza el estado del video.
     * @param eventName
     */
    triggerVideoEvent: function (eventName) {

      //se salva variable de estado de posicion de video.
      localStorage.setItem('videoState', eventName);

      EcualizadorView.__super__.triggerVideoEvent.apply(this, arguments);

    },

    /**
     * Cada vez q se actualiza el tiempo del video.
     * @param percent
     */
    onChangeTime: function (percent) {
      this.currentTime = percent;
    },

    /**
     * Muestra un partipante aleatorio.
     */
    activeParticipantsInTime: function () {
      ////console.log('Se pinta un particpante');

      var activeParticipant = this.getRandomParticpant();

      if (activeParticipant) {
        this.showParticipantDuring(activeParticipant, 3000);
      }
    },
    /**
     * * Muestra un partipante que se encuentre en la posicion pasada como parametro.
     * @param position - (%)
     */
    activeParticipantsInPosition: function (position) {

      ////console.log('Se pinta un particpante');

      var gap = 0.5;
      var activeParticipant = this.getParticipantInPosition(position, gap);

      if (activeParticipant) {
        ////console.log('existe particpante');
        this.showParticipantDuring(activeParticipant, 2000);
      }
    },
    /**
     * Retorna el participante en la posicion
     * @param position
     * @param gap
     */
    getParticipantInPosition: function (position, gap) {

      var activeParticpant = undefined;

      //todo: si hay problemas de rendimiento mejorar esto con un select. Pero esto implica desarrollar la collection.
      this.participants.each(function (participant) {
        if (participant.get('position') >= (position - gap) && participant.get('position') <= (position + gap)) {
          activeParticpant = participant;
        }
      });
      return activeParticpant;
    },
    /**
     * Muestra un participante durante un perido de tiempo
     * @param activeParticipant
     * @param time
     */
    showParticipantDuring: function (activeParticipant, time) {

      $('#' + activeParticipant.id).addClass("show");
      $('#' + activeParticipant.id).removeClass('animated fadeInDown fadeOut').addClass("showed animated fadeInDown");
      $('#' + activeParticipant.id).one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function () {
        $('#' + activeParticipant.id + " p").removeClass('showed animated fadeIn').addClass("showed animated fadeIn");
        $('#' + activeParticipant.id + " p").one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function () {

          setTimeout(function () {
            $('#' + activeParticipant.id).removeClass("animated fadeOut").addClass('animated fadeOut');
            $('#' + activeParticipant.id).one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function () {
              $('#' + activeParticipant.id).removeClass("show");
            });
          }, time);

        });
      });

    },
    /**
     * Obtiene un participante aleatorio que no haya sido mostrado.
     * @returns {*}
     */
    getRandomParticpant: function () {

      var activeParticipant;
      var randomIndex;
      var countParticipants = this.participants.length;

      do {

        randomIndex = _.random(this.participants.length - 1);
        activeParticipant = this.participants.at(randomIndex);

        --countParticipants;

      } while (activeParticipant.get('showed') && countParticipants);

      if (--countParticipants > -1) {
        this.participants.at(randomIndex).set('showed', true);
        return this.participants.at(randomIndex);
      } else {
        return undefined;
      }
    },

    /**
     * Hace un reset de la vista cuando el video ha terminado.
     * @param event
     */
    restWithEndOfVideo: function () {
      ////console.log('Se lanza end of video');
      this.cleanShowedParticipant();
      this.cleanFulledBars();
    },
    /**
     * Desmarca el listado de participantes como mostrado.
     */
    cleanShowedParticipant: function () {
      this.participants.each(function (participant) {
        participant.set('showed', false);
      });
    },

    /**
     * Muestra el participante que se encuentre en la posicion de la barra que esté em hover.
     * @param event
     */
    showParticipantInPosition: function (event) {
      ////console.log('Se muestra el particpante en la posicion');
      /* var bar = $(event.currentTarget);
       var wrapperWidth = $('.line').width();
       var positionBar = bar.position().left / wrapperWidth * 100;

       ////console.log('Se muestra el particpante en la posicion: ' + positionBar);

       this.activeParticipantsInPosition(positionBar);*/
    },
    /**
     * Handler del Switch OnChange.
     * @param event
     * @param state
     */
    switchOnChange: function (event, state) {
      if (!state) {
        this.goToTimeLine();
      }
    },
    /**
     * Go to Ecualizador.
     */
    goToTimeLine: function () {
      ////console.log('Go to timeline');
      this.stopBarMovement();
      this.toggleUpDownBars();
      this.$el.find('.wrapper-participants').css('visible', 'hidden');
      this.goToViewAfterWaiting('/timeline', 1000);

    },
    /**
     * Para el Movimiento de las barras.
     */
    stopBarMovement: function () {
      clearInterval(this.barUpdateTimer);
      clearInterval(this.participantTimer);
    },

    /**
     * El video finaliza.
     */
    onEnded: function (event) {
      this.playVideo('ecualizador');
    },

    /**
     * muestra el participando de rollover en canvas
     * @param event
     */
    showParticipantOnRollover: function (event) {

      //console.log('showParticipantOnRollover');

      this.posX = event.pageX;

      clearTimeout(this.espera);

      var scope = this;

      this.espera = setTimeout(function () {

        //console.log(event.pageX);

        if ($('#rollover').hasClass('show')) {
          $('#rollover').removeClass("animated fadeOut");
          $('#rollover').removeClass("show");
        }
        $('#rollover').removeClass("show showed animated fadeInDown");
        $('#rollover p').removeClass("showed animated fadeIn");

        var activeParticipant = scope.getRandomParticpant();
        if (activeParticipant) {

          ////console.log(activeParticipant.toJSON());

          $('#rollover span.participant-name strong').html(activeParticipant.get('name'));
          $('#rollover span.participant-city').html(activeParticipant.get('country'));
          $('#rollover span.participant-date').html(activeParticipant.get('date'));

          $('#rollover').css("left", (event.pageX - $('.controls').width() - 16) + "px");

          $('#rollover').addClass("show");
          $('#rollover').removeClass('animated fadeInDown fadeOut').addClass("showed animated fadeInDown");
          $('#rollover').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function () {
            $('#rollover p').removeClass('showed animated fadeIn').addClass("showed animated fadeIn");
          });

        }

      }, 300);

    }

  });

  return EcualizadorView;
});
