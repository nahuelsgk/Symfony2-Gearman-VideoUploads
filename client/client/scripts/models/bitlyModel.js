define(function(require) {
  'use strict';

  var BitlyModel = Backbone.Model.extend({

    initialize: function(options) {
     if(options)this.options = options;
    },

    _baseUrl:'https://api-ssl.bitly.com/v3/shorten',
    _linkemannAccessToken: '98515e175d0e1f96f5299cca2ccebf05eb4bc743',

    url:function(){
      return this._baseUrl+'?access_token='+this._linkemannAccessToken+'&longUrl='+this.options.longUrl
    },

    parse:function(response){
      return response.data;
    }

  });

  return BitlyModel;

});

