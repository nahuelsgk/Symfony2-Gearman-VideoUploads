define(function (require) {
  'use strict';

  var StoresCollection = Backbone.Collection.extend({

    initialize: function () {
    },

    //_url: 'data/stores.json',

    url: function(){
      return _SERVER_PATH+'/stores'+ this.parameters ;
    },

    parse: function (response) {
      //console.log('Parse collection stores');
      return response.stores;

    },
    /**
     * Setea los parametros con q se llamará al api.
     * @param parameters [ex. '/ES/08013/250' - pais/zipcode/radio ]
     */
    setStoresParameters:function(parameters){
      this.parameters =  parameters;
    },
    /**
     * Retorna true si tiene tiendas
     * @returns {Number}
     */
    hasStores:function(){
      return this.length;
    }


  });

  return new StoresCollection();
});

