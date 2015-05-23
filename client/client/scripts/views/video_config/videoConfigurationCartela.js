define(function (require) {
  'use strict';

  var VideoConfigurationBase = require('views/video_config/videoConfigurationBase');

  var VideoCartela = VideoConfigurationBase.extend({

    events: {
      'click .img-tumbler': 'selectEffect',
      'click .step': 'goToStep'
    },

    template: JST['client/templates/video_config/videoConfigurationCartela.jst'],
    templateMobile: JST['client/templates/mobile/video_config/videoConfigurationCartelaMobile.jst'],

    render: function () {

      var templateOptions = {
        title: window.app.LocaleCollection.get(1).get("video_config")[0].string,
        t1: window.app.LocaleCollection.get(1).get("video_config")[1].string,
        intro: window.app.LocaleCollection.get(1).get("video_config")[3].string,
        filters: window.app.LocaleCollection.get(1).get("video_config")[4].string,
        next: window.app.LocaleCollection.get(1).get("video_config")[5].string,
        sizmekCode: this.trackingSizmek(23525) // todo buscar codigo realen el excel
      };

      var html = window.app.mobile ? this.templateMobile(templateOptions) : this.template(templateOptions);

      this.$el.html(html);

      return this;
    },

    /**
     * Selecciona la cartela del video. [Title del video]
     * @param e
     */
    selectEffect: function (e) {
      var selectedTitle = this.chagenSelectedEffect(e);
      window.app.configVideoOptions.set('title', selectedTitle);
      window.app.user.logAction('VideoSelectTitle::selectEffect', window.app.currentViewName);
    }

  });

  return VideoCartela;
});
