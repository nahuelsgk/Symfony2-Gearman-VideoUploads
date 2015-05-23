define(['views/baseView'], function (BaseView) {
  'use strict';

  var IndexView = BaseView.extend({

    //el: '#content',

    template: JST['client/templates/index.jst'],

    events: {},

    default_waiting_time: 20 * 1000,

    /**
     * Demora el tiempo de lectura y va a la pagina seleccionada.
     */
    initDelay: function () {

      var scope = this;
      setTimeout(function () {
        scope.changeSlide();
      }, this.default_waiting_time/2);
      this.timer = setTimeout(function () {
          scope.fadeOutContent();
        }, //set the delay time.
        this.default_waiting_time);
    },
    /**
     * Make a fadeOut and Go to Timeline.
     */
    fadeOutContent: function () {
      var scope = this;
      this.$el.find('.intro').removeClass('animated fadeInUp');
      this.addAnimatedClass('.intro', 'animated fadeOutDown', function () {
        scope.$el.find('.intro').hide();
        clearInterval(scope.timer);
        return window.app.navigate('/timeline', {trigger: true})
      });
    },

    changeSlide: function () {
      this.$el.find('.slide-show').addClass('animated fadeOutLeft');
      this.$el.find('.slide-hide').addClass('animated fadeInRight');
    },

    onClose: function () {
      if (this.timer) {
        clearInterval(this.timer);
      }
    },

    render: function () {

      var scope = this;

      window.app.currentViewName = 'Home';
      window.app.lastViewName = window.app.currentViewName;

      this.$el.html(this.template({
        name: window.app.currentViewName,
        hash: window.app.LocaleCollection.get(1).get("home")[0].hash,
        texto: window.app.LocaleCollection.get(1).get("home")[0].string,
        texto2: window.app.LocaleCollection.get(1).get("home")[13].string
      }));

      this.initDelay();

      this.afterRenderWait = setInterval(function () {
        clearInterval(scope.afterRenderWait);
        scope.afterRender();

      }, 300);

      return this;
    },

    afterRender: function () {
      $('#backgroundVideo').removeClass('blur');
      $('#mascara').hide();
    }

  });

  return IndexView;
});
