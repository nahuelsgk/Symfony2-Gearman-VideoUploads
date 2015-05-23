define(function (require) {
  'use strict';

  var BaseView = require('views/baseView');
  var StoresCollection = require('collections/stores');
  var FormRegisterUserView = require('views/account/form');

  var SignupView = BaseView.extend({

    el: '#content',
    tag: '',
    isValidTag: '',

    template: JST['client/templates/account/signup.jst'],

    initialize: function (tag) {

      this.tag = (typeof(tag) === 'string') ? tag : 'default';
      window.app.tag = this.tag;
    },

    onClose:function(){
      this.stopListening();
      $("#mascara").hide();
    },

    render: function () {
      window.app.currentViewName = 'Signup';
      var scope = this;
      this.isValidTag = false;
      window.app.FormTagCollection.each(function (_tag) {
        var isValidTag = false;
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
        this.$el.html(this.template({
          name: 'Signup',
          tag: this.tag,
          title: window.app.LocaleCollection.get(1).get("participate")[4].tags[this.tag].title,
          text: window.app.LocaleCollection.get(1).get("participate")[4].tags[this.tag].string,
          sizmekCode:this.trackingSizmek(621274)
        }));
        /**
         * Muestra la mascara negra
         */
          ////console.log('mascara on');
        $("#mascara").show();

        this.form = new FormRegisterUserView(this.tag);
        this.form.paintView(this.$el.find('#formularioWrapper'));

        return this;
      }
    },

    /**
     * Animacion de salida y salto a la siguiente página
     * @param callback @type:function
     */
    transitionOut: function (callback) {
      var scope = this;
      $(this.$el.signup).removeClass('fadeOut').addClass('fadeOut');
      $(this.$el.signup).one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function () {
        $(scope.$el.signup).removeClass('fadeOut');
        callback();
      });
    }

  });

  return SignupView;

});
