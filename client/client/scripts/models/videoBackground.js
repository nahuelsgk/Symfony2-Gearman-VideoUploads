define(function(require) {
  'use strict';

  var VideoBackground = Backbone.Model.extend({

    initialize: function() {
    },

    defaults: {
      mp4Url: '',
      webmUrl: '',
      ogvUrl: ''
    }

  });

  return new VideoBackground();

});

