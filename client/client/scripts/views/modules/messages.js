
define(['views/baseView'], function (BaseView) {
  'use strict';

  var messages = require('models/messages');

  var Messages = BaseView.extend({

    el: '.messages',

    template: JST['client/templates/modules/messages.jst'],

    events: {},

    initialize: function() {
      // Re-render template when data changes
      this.listenTo(messages, 'change', this.render);
      this.render();
    },

    render: function() {
      this.$el.html(this.template(messages.toJSON()));
      return this;
    }

  });

  return Messages;

});

