define(function (require) {
  'use strict';

  var Mobile = Backbone.View.extend({

    id: 'wrapper-inner',

    template: JST['client/templates/layouts/mobile.jst'],

    events: {},

    initialize: function (options) {
      // Check to see if any options were passed in
      if (options) {
        this.options = options;
      }
    },

    render: function () {
      this.$el.html(this.template);

      // If subviews are passed in, then assign/render them
      if (this.options && this.options.subviews) {
        this.assign(_.extend(this.options.subviews, this.subviews));
      } else {
        // Assign/Render subviews
        this.assign(this.subviews);
      }

      $('html').addClass('mobile');

      return this;
    }

  });

  return Mobile;

});

