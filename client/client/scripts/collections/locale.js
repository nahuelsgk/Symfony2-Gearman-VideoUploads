define(function (locale) {
  'use strict';

  var LocaleCollection = Backbone.Collection.extend({

    url: function () {
      return 'data/locales/' + window.app.locale + '.json';
    },

    initialize: function () {
    },

    parse: function (response) {
      return response;
    }

  });

  return new LocaleCollection();
});
