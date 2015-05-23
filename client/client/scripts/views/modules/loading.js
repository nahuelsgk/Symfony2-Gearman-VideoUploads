
define(['views/baseView'], function (BaseView) {
  'use strict';

  var LoadingView = BaseView.extend({

    template: JST['client/templates/modules/loading_img.jst'],

    events: {
      /*'click #logoutLink': 'handleLogout'*/
    },

    initialize: function() {
      ////console.log('Loading render');
      this.render();
    },

    render: function() {
      this.$el.html(this.template());
      return this;
    }

  });

  return LoadingView;

});
