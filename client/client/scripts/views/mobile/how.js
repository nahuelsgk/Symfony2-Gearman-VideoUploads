define(['views/baseView'], function (BaseView) {
  'use strict';

  var ThanksView = BaseView.extend({

    template: JST['client/templates/mobile/how.jst'],

    events: {},

    initialize:function(tag){
      this.tag = (typeof(tag) === 'string') ? tag : 'default';
    },


    render: function () {
      window.app.currentViewName = 'How';

      this.$el.html(this.template({
        tag:this.tag,
        back: window.app.LocaleCollection.get(1).get("menu")[0].stringMobile,
        content: window.app.LocaleCollection.get(1).get("how")[0].stringMobile
      }));

      setTimeout(function () {
        $('html, body').animate({scrollTop: $("#wrapper").offset().top}, 500);
      }, 500);

      return this;
    }

  });

  return ThanksView;
});
