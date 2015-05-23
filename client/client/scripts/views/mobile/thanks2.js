define(function (require) {
  'use strict';

  var BaseView = require('views/baseView');
  var SocialButtons = require('views/modules/socials');

  var ThanksView = BaseView.extend({

    template: JST['client/templates/mobile/thanks2.jst'],

    events: {},

    initialize:function(tag){
      this.tag = (typeof(tag) === 'string') ? tag : 'default';
    },


    render: function () {
      window.app.currentViewName = 'Thanks2';

      var scope = this;

      if(this.tag !== 'download'){
        this.paintView(this.tag,false);
      }else{
        //scope.paintView(scope.tag,'fasdasdads');
        window.app.user.getAudioCode(function(response){
          scope.paintView(scope.tag,response.code);
        });
      }
    },
    /**
     * Original render rewritter.
     *
     * @param tag - tag actual.
     * @param code - Codigo de descarga
     * @returns {ThanksView}
     */
    paintView:function(tag,code){

      var title;

      if(tag === 'download'){
        title = window.app.LocaleCollection.get(1).get("thanks")[11].stringMobile;
      }else{
        title = window.app.LocaleCollection.get(1).get("thanks")[0].string;
      }


      this.$el.html(this.template({
        tag:this.tag,
        title: title,
        p1: window.app.LocaleCollection.get(1).get("thanks")[4].string,
        b1: window.app.LocaleCollection.get(1).get("thanks")[2].string,
        b2: window.app.LocaleCollection.get(1).get("thanks")[3].string,
        thisIsYourDownloadCode: window.app.LocaleCollection.get(1).get("thanks")[8].string,
        enjoyTheSong: window.app.LocaleCollection.get(1).get("thanks")[9].string,
        downloadSong: window.app.LocaleCollection.get(1).get("thanks")[10].string,
        userCode: code,
        isDownloadAudio: this.tag === 'download'
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
        msg: window.app.LocaleCollection.get(1).get("social")[1].string,
        img: 'thanks-for-confirming-ean.jpg'
      });

      this.socials = new SocialButtons(socialModel.toJSON());

      this.socials.paintView(elementContainer);
    }

  });

  return ThanksView;
});
