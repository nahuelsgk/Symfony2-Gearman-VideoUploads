define(function (require) {
  'use strict';

  var VideoConfigurationBase = require('views/video_config/videoConfigurationBase');

  var VideoCartela = VideoConfigurationBase.extend({

    events:{
      'click .img-tumbler':'selectEffect',
      'click .step':'goToStep'
    },

    template: JST['client/templates/mobile/video_config/videoConfigurationIntro.jst'],

    render: function () {

      this.$el.html(this.template({
        tag:this.tag,
        h1: window.app.LocaleCollection.get(1).get("video_config")[14].string,
        p:window.app.LocaleCollection.get(1).get("video_config")[15].string,
        button:window.app.LocaleCollection.get(1).get("video_config")[16].string
      }));

      return this;
    }

  });

  return VideoCartela;
});
