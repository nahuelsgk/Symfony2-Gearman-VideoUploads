define(function (require) {
  'use strict';

  var BaseView = require('views/baseView');
  var SocialButtons = require('views/modules/socials');

  var ThanksView = BaseView.extend({

    template: JST['client/templates/mobile/thanks.jst'],

    events: {
      'click .generaP-preview': 'invokeGeneratePreview'
    },

    initialize:function(tag){
      this.tag = (typeof(tag) === 'string') ? tag : 'default';
    },


    render: function () {
      window.app.currentViewName = 'Thanks';

      this.$el.html(this.template({
        tag:this.tag,
        title: window.app.LocaleCollection.get(1).get("thanks")[0].string,
        p1: window.app.LocaleCollection.get(1).get("thanks")[1].stringTemp,
        b3: window.app.LocaleCollection.get(1).get("thanks")[6].string,
        b4: window.app.LocaleCollection.get(1).get("thanks")[12].string
      }));

      setTimeout(function () {
        $('html, body').animate({scrollTop: $("#wrapper").offset().top}, 500);
      }, 500);

      this.createSocial(this.$el.find('.social'));

      return this;
    },

    createSocial: function (elementContainer) {

      var socialModel;

      socialModel = new Backbone.Model({
        url: 'bit.ly/1HeqxQ3',
        msg: window.app.LocaleCollection.get(1).get("social")[0].string
      });

      this.socials = new SocialButtons(socialModel.toJSON());

      this.socials.paintView(elementContainer);
    },
    /**
     * Manda a generar un preview
     */
    invokeGeneratePreview:function(){
      console.log('SE MANDA A GENERAR UN PREVIEW');
      window.app.user.generatePreviewForVideo(function(response){
        console.log('SE genero bien el preview');
      });
    }

  });

  return ThanksView;
});
