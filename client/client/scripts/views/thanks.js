define(function (require) {
  'use strict';

  var BaseView = require('views/baseView');
  var SocialButtons = require('views/modules/socials');

  var ThanksView = BaseView.extend({

    template: JST['client/templates/thanks.jst'],

    events: {
      'click .go-to-video': 'goToVideo',
      'click .generaP-preview': 'invokeGeneratePreview'
    },

    initialize: function (tag) {
      this.tag = (typeof(tag) === 'string') ? tag : 'default';
    },

    onClose: function () {
      ThanksView.__super__.onClose.apply(this, arguments);
      this.socials.close();
      window.app.user.set("SESSION", {upload_visited: true});

    },

    goToVideo: function () {
      /**
       * Make the confirmation for send a mail to the user.
       */
      //window.app.user.makeConfirmation(false);
      window.app.navigate('participate/' + this.tag + '/video', {trigger: true});
    },

    render: function () {

      var scope = this;

      window.app.currentViewName = 'Thanks';
      var b3;

      /**
       * VIP Case
       */
      if (window.app.tag === "vip") {
        b3 = window.app.LocaleCollection.get(1).get("video")[0].string;
      } else {
        b3 = window.app.LocaleCollection.get(1).get("thanks")[2].string;
      }

      /**
       * Download Case
       */
      if(this.tag==='download'){

        window.app.user.getAudioCode(function(response){
          console.log('Se retorna el codigo del audio');
          scope.$el.html(scope.template({
            tag: scope.tag,
            title: window.app.LocaleCollection.get(1).get("thanks")[7].string,
            p1: window.app.LocaleCollection.get(1).get("thanks")[8].string,
            p2: window.app.LocaleCollection.get(1).get("thanks")[9].string,
            code: response.code,
            b1: window.app.LocaleCollection.get(1).get("thanks")[10].string,
            sizmekCode: scope.trackingSizmek(621214)
          }));

          scope.afterRenderWait = setInterval(function () {
            clearInterval(scope.afterRenderWait);
            scope.afterRender();

          }, 500);

          scope.createSocial(scope.$el.find('.social'));

          return this;

        });

      }else{
        /**
         * Viene de una pantalla de UploadVideo.
         * Se envía confirmacion por email de video subido.
         */
        window.app.user.makeConfirmation(false);

        this.$el.html(this.template({
          tag: this.tag,
          eanCode: this.isEanCode(),
          title: window.app.LocaleCollection.get(1).get("thanks")[0].string,
          p1_old: this.getSubtitle(),
          p1: window.app.LocaleCollection.get(1).get("thanks")[1].stringTemp,
          b1: window.app.LocaleCollection.get(1).get("thanks")[2].string,
          b2: window.app.LocaleCollection.get(1).get("thanks")[3].string,
          b4: window.app.LocaleCollection.get(1).get("thanks")[12].string,
          p2: window.app.LocaleCollection.get(1).get("thanks")[4].string,
          b3: b3,
          sizmekCode: this.isEanCode() ? this.trackingSizmek(621334): this.trackingSizmek(622648)
        }));

        this.afterRenderWait = setInterval(function () {
          clearInterval(scope.afterRenderWait);
          scope.afterRender();

        }, 500);

        this.createSocial(this.$el.find('.social'));

        return this;
      }
    },

    afterRender: function () {
      $('#backgroundVideo').removeClass('blur');
    },
    /**
     * Pinta o no el mensaje de revisa tu inbox. (Esto solo sale si esta pantalla se muestra la primera vez.)
     * @returns {string}
     */
    getSubtitle: function () {
      return (window.app.user.get("SESSION") && window.app.user.get("SESSION").upload_visited) ? '' : window.app.LocaleCollection.get(1).get("thanks")[1].string;
    },

    /**
     * Distingue la pantalla de gracias de EanCode.
     * @returns {boolean}
     */
    isEanCode: function () {
      return this.tag === "vip";
    },

    /**
     * Crea los Socials que tocan en cada pantalla.
     */
    createSocial: function (elementContainer) {

      var socialModel;

      if (this.isEanCode()) { //Ean Code

        socialModel = new Backbone.Model({
          url: 'bit.ly/1HeqxQ3',
          msg: window.app.LocaleCollection.get(1).get("social")[1].string,
          img: 'thanks-for-confirming-ean.jpg'
        });

      } else { // Participants

        socialModel = new Backbone.Model({
          url: 'bit.ly/1HeqxQ3',
          msg: window.app.LocaleCollection.get(1).get("social")[0].string
        });
      }

      this.socials = new SocialButtons(socialModel.toJSON());

      this.socials.paintView(elementContainer);
    },
    /**
     * Manda a generar un preview
     */
    invokeGeneratePreview:function(){

      window.app.user.logAction('ClickInBtn::Customize::invokeGeneratePreview',window.app.currentViewName);

      window.app.user.generatePreviewForVideo(
        function(response){
          window.app.user.logAction('ClickInBtn::Customize:: OK',window.app.currentViewName);
        },
        function(){
          window.app.user.logAction('ClickInBtn::Customize:: KO',window.app.currentViewName);
        }
      );
    }

  });

  return ThanksView;
});
