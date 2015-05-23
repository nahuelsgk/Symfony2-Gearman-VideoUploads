define(function (require) {
  'use strict';

  var VideoConfigurationBase = require('views/video_config/videoConfigurationBase');
  var SocialButtons = require('views/modules/socials');
  var BitlyModel = require('models/bitlyModel');

  var VideoConfigurationResult = VideoConfigurationBase.extend({

    countPetitions: 0,

    events: {
      'click .img-tumbler': 'selectEffect',
      'click .step': 'goToStep',
      'click .play-btn': 'playVideo'

    },

    initialize: function (tag, comeFromEmail) {

      this.comeFromEmail = comeFromEmail;

      VideoConfigurationResult.__super__.initialize.apply(this, arguments);

      /**
       * Se manda a generar el video desde la creacion de la pantalla.
       */
      if (!this.comeFromEmail) {

        window.app.user.logAction('VideoResult::invokeVideoRender', window.app.currentViewName);

        window.app.user.invokeVideoRender(window.app.configVideoOptions.toJSON(), function () {
          window.app.user.logAction('VideoResult::invokeVideoRender:: OK', window.app.currentViewName);
        }, function () {
          window.app.user.logAction('VideoResult::invokeVideoRender:: KO', window.app.currentViewName);
        });
      }

    },

    onClose: function () {
      VideoConfigurationResult.__super__.onClose.apply(this, arguments);
      if (this.socials) {
        this.socials.close();
      }
      clearInterval(this.waiting);

    },

    template: JST['client/templates/video_config/videoConfigurationResult.jst'],
    templateMobile: JST['client/templates/mobile/video_config/videoConfigurationResultMobile.jst'],

    render: function () {

      var scope = this;

      var templateOptions = {
        title: window.app.LocaleCollection.get(1).get("video_config")[6].string,
        t1: window.app.LocaleCollection.get(1).get("video_config")[7].string,
        sendByEmail: window.app.LocaleCollection.get(1).get("video_config")[8].string,
        imgPreview: window.app.configVideoOptions.get('filterImgPreview'),
        sizmekCode: scope.trackingSizmek(23525)   //todo: buscar el codigo correcto.

      };

      var html = window.app.mobile ? this.templateMobile(templateOptions) : this.template(templateOptions);

      this.$el.html(html);

      var waitingTime, maxPetitionsBeforeBtn;

      if (this.comeFromEmail) {
        waitingTime = 2000;
        maxPetitionsBeforeBtn = 10;
      } else {
        waitingTime = 5000;
        maxPetitionsBeforeBtn = 3;
      }

      this.waiting = setInterval(function () {

        scope.countPetitions++;
        if (scope.countPetitions == maxPetitionsBeforeBtn) {
          scope.isTakingToLongTime();
        }

        window.app.user.logAction('VideoResult::getVideoRender', window.app.currentViewName);
        window.app.user.getVideoRender(function (response) {
          if (response.status === 'ok') {
            clearInterval(scope.waiting);
            scope.videoRenderIsReady(response);
          } else {
            // Not Video yet .. Do nothing
          }
        }, function (response) {
          // Not Video yet .. Do nothing
        });

      }, waitingTime);

      return this;
    },

    /**
     * Muestra los btns de Social
     * @param urlToShare
     */
    showSocialBtns: function (urlToShare) {

      var socialModel = new Backbone.Model({
        url: urlToShare,
        msg: window.app.LocaleCollection.get(1).get("social")[2].string,
        img: 'thanks-for-confirming-ean.jpg',
        small: true
      });

      this.socials = new SocialButtons(socialModel.toJSON());
      this.socials.paintView(this.$el.find('.socials'));
    },

    /**
     * Muestra Url to Share en el DOM.
     * @param urlToShare
     */
    showUrlToShare: function (urlToShare) {

      var html = '<p class="wrapper-share-url">' + urlToShare + '</p>';
      this.$el.find('.share-url').html(html);

    },

    /**
     * Elimina el btn enviar por email si existe en el DOM.
     */
    removeBtnSendByEmail: function () {
      this.$el.find('.btnSendByEmail').hide();
    },

    /**
     * Muestra el btn Send By Emal.
     */
    showBtnSendByEmail: function () {
      this.$el.find('.btnSendByEmail').show();
      this.addAnimatedClass('.btnSendByEmail', 'animated fadeInUp', false);
    },

    /**
     * Esta listo el render del video.
     */
    videoRenderIsReady: function (response) {

      var scope = this;

      var urlToShare = window.location.origin + window.location.pathname + '#participate/' + this.tag + '/public-video/' + window.app.user.get('confirm_token');

      window.app.user.logAction('VideoResult::videoRenderIsReady', window.app.currentViewName);

      var bitly = new BitlyModel({longUrl: encodeURIComponent(urlToShare)});

      bitly.fetch({
        success: function () {
          var bitLyToShare = bitly.get('url');
          scope.showUrlToShare(bitLyToShare);
          scope.showSocialBtns(bitLyToShare);
          scope.removeBtnSendByEmail();
          scope.showRenderVideo(response);
        }
      });

    },

    /**
     * Ha demorado mucho la respuesta de generacion del render del video.
     */
    isTakingToLongTime: function () {
      this.showBtnSendByEmail();
    }

  });

  return VideoConfigurationResult;
});
