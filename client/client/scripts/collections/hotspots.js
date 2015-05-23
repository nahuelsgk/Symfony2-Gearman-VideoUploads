/**
 * Created by DEV on 31/03/2015.
 */
define(function(require) {
  'use strict';

  var HotSpotCollection = Backbone.Collection.extend({

    initialize: function() {
    },

    url:'data/hotspots.json',

    parse:function(response){
      //console.log('Parse collection hotspot');
      return response;

    }


  });

  return new HotSpotCollection();

});

