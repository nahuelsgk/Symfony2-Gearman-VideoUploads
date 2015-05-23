define(function (require) {
  'use strict';

  var FormTagsCollection = Backbone.Collection.extend({

    url: 'data/formTags.json',

    initialize: function () {},

    parse: function (response) {
      //console.log('Parse collection formTags');
      return response;
    }

  });

  return new FormTagsCollection();
});

