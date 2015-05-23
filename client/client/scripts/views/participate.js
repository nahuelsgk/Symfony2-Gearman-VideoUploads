define(['views/baseView'], function (BaseView) {
  'use strict';

  var ParticipateView = BaseView.extend({

    //el: '#content',
    tag: '',
    isValidTag: '',

    template: JST['client/templates/participate.jst'],

    events: {
      'click #participate': 'onParticiapteHandler',
      'click #video': 'onViewVideoHandler'
    },

    waitingMail: 15000,

    initialize: function (tag) {
      this.tag = (typeof(tag) === 'string') ? tag : 'default';

      var scope = this;

      this.waiting = setTimeout(function () {
        clearInterval(scope.waiting);
        scope.onViewVideoHandler();
      }, scope.waitingMail);

    },

    onClose: function () {
      clearInterval(this.waiting);
    },

    render: function () {
      window.app.currentViewName = 'Participate';
      var scope = this;
      this.isValidTag = false;
      window.app.FormTagCollection.each(function (_tag) {
        if (_tag.get('tag') == scope.tag) {
          window.app.backgroundType = 'img';
          window.app.backgroundImg.setImgUrl(_tag.get('img'));
          scope.isValidTag = true;
        }
      });
      /**
       * controla que el tag sea valido (formTags.json) o salta al timeline
       */
      if (!this.isValidTag) {
        return window.app.navigate('timeline', {trigger: true});
      } else {
        scope.$el.html(scope.template({
          name: window.app.currentViewName,
          title: window.app.LocaleCollection.get(1).get("participate")[4].tags[scope.tag].title,
          bot1: window.app.LocaleCollection.get(1).get("participate")[3].string,
          bot2: window.app.LocaleCollection.get(1).get("participate")[2].string,
          text: window.app.LocaleCollection.get(1).get("participate")[4].tags[scope.tag].string,
          sizmekCode:this.trackingSizmek(620914)
        }));
        return this;
      }
    },

    onParticiapteHandler: function (event) {
      clearInterval(this.waiting);
      var scope = this;
      this.transitionOut(function () {
        return window.app.navigate('participate/' + scope.tag + '/signup', {trigger: true});
      });
    },
    onViewVideoHandler: function (event) {
      clearInterval(this.waiting);
      var scope = this;
      this.transitionOut(function () {
        return window.app.navigate('participate/' + scope.tag + '/video', {trigger: true});
      });
    },
    /**
     * Animacion de salida y salto a la siguiente página
     * @param callback @type:function
     */
    transitionOut: function (callback) {
      var scope = this;
      $(".participate").removeClass('fadeOutDown').addClass('fadeOutDown');
      $(".participate").one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function () {
        $(".participate").removeClass('fadeOutDown');
        callback();
      });
    }

  });

  return ParticipateView;
});
