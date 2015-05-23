define(function (require) {
  'use strict';

  var Default = Backbone.View.extend({

    id: 'wrapper-inner',

    template: JST['client/templates/layouts/default.jst'],

    events: {},

    initialize: function (options) {
      // Check to see if any options were passed in
      if (options) {
        this.options = options;
      }
    },

    controlVideo: function () {
      ////console.log('Se lanza el evento:');
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

      return this;
    },

    /**
     * Return 0 if the background isn't video.
     * @returns {jQuery.length|*|jQuery}
     */
    isVideoBackground: function () {
      return $('#bgVideo').length;
    }

  });

  return Default;

});

