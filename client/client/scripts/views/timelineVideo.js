define(['views/baseVideoView'], function (BaseVideoView) {
  'use strict';

  var VideoView = BaseVideoView.extend({

    //el: '#content',
    tag: '',

    template: JST['client/templates/timelineVideo.jst'],

    events: {},

    timerInterval: 1000,

    initialize: function (tag) {
      this.tag = (typeof(tag) === 'string') ? tag : 'default';

      BaseVideoView.prototype.initialize.apply(this);
    },

    render: function () {
      window.app.currentViewName = 'TimelineVideo';

      this.$el.html(this.template({
        name: window.app.currentViewName
      }));

      /**
       * Esconde la mascara negra
       */
      ////console.log('mascara off');
      //console.log('RENDER TIMELINE VIDEO');
     /* $("#mascara").hide();*/

      return this;
    }

  });

  return VideoView;
});
