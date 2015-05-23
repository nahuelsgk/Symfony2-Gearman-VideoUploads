define(function (require) {
  'use strict';

  var BaseView = require('views/baseView');
  var SocialButtons = require('views/modules/socials');

  var VideoConfirmationView = BaseView.extend({

    template: JST['client/templates/videoConfirmation.jst'],

    events: {},

    initialize:function(token){
      this.token = (typeof(token) === 'string') ? token : 'Mary';
    },


    render: function () {
      var scope = this;
      window.app.currentViewName = 'VideoConfirmation';

      window.app.user.getUserByToken(this.token,function(){

        scope.$el.html(scope.template({
          name:scope.getUserName(),
          title: window.app.LocaleCollection.get(1).get('video_confirmation')[0].string,
          p1: window.app.LocaleCollection.get(1).get('video_confirmation')[1].string,
          b1: window.app.LocaleCollection.get(1).get('video_confirmation')[2].string
        }));

        scope.afterRenderWait = setInterval(function(){
          clearInterval(scope.afterRenderWait);
          scope.afterRender();

        },500);


        scope.socials = new SocialButtons({
          /*img:'image_to_share.jpg',*/
          url:'bit.ly/1HeqxQ3',
          msg: window.app.LocaleCollection.get(1).get('social')[0].string
        });

        scope.socials.paintView(scope.$el.find('.social'));

        return scope;
      });
    },

    afterRender:function(){
      $('#backgroundVideo').removeClass('blur');
    },

    /**
     * Traduce el token a datos del usuario.
     */
    getUserName:function(){
       return window.app.user.get('name');
    }

  });

  return VideoConfirmationView;
});
