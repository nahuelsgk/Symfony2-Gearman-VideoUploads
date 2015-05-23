define(function (require) {
  'use strict';

  var EancodesCollection = Backbone.Collection.extend({

    initialize: function () {
    },

    url: 'data/eancodes.json',

    parse: function (response) {
      //console.log('Parse collection eancodes');
      return response.eancodes;

    }

  });

  return new EancodesCollection();
});

