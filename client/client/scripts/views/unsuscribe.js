define(function (require) {
  'use strict';

  var BaseView = require('views/baseView');

  var UnsuscribeView = BaseView.extend({
    template: JST['client/templates/unsuscribe.jst'],

    events: {
      'click #unsuscribe': 'unsuscribeHandler',
      'click #gotoweb': 'goToWebHandler',
    },

    initialize: function (token) {
      //console.log(token);
      this.token = (typeof(token) === 'string') ? token : 'Mary';
    },

    unsuscribeHandler: function (event) {
      var score = this;
      $.ajax({
        url: this.url + '/unsuscribe/' + this.token,
        type: 'post',
        success: function (userJson) {
          //scope.set(userJson);
          if (_callback) {
            _callback()
          }
        },
        error: function (res) {
          //console.log('Error Confirmando Video Upload: ' + res);
        }
      });
    }
  });

  return UnsuscribeView;

});
