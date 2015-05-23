define(function (require) {
  'use strict';

  var VideoConfigurationBase = require('views/video_config/videoConfigurationBase');

  var VideoConfigurationPublic = VideoConfigurationBase.extend({

    events:{
      'click .img-tumbler':'selectEffect',
      'click .step':'goToStep',
      'click .play-btn':'playVideo'

    },

    initialize:function (tag,token){


      VideoConfigurationPublic.__super__.initialize.apply(this, arguments);
      this.token = token;

    },

    template: JST['client/templates/video_config/videoConfigurationPublic.jst'],
    templateMobile: JST['client/templates/mobile/video_config/videoConfigurationPublicMobile.jst'],

    render: function () {

      var scope = this;

      window.app.user.getUserByToken(this.token,function(){

        window.app.user.set('confirm_token',scope.token);

        var templateOptions = {
          userName: window.app.user.get('name'),
          title: window.app.LocaleCollection.get(1).get("video_config")[9].string,
          t1:window.app.LocaleCollection.get(1).get("video_config")[10].string,
          t2:window.app.LocaleCollection.get(1).get("video_config")[11].string,
          b1:window.app.LocaleCollection.get(1).get("video_config")[12].string
         // sizmekCode:this.trackingSizmek(23525)   //todo: buscar el codigo correcto.
        };

        var html = window.app.mobile ? scope.templateMobile(templateOptions) : scope.template(templateOptions);

        scope.$el.html(html);

        scope.waiting = setInterval(function(){

          window.app.user.getVideoRender(
            function(response){
              if(response.status === 'ok'){
                clearInterval(scope.waiting);
                scope.showRenderVideo(response);
              }else{
                //do nothing
              }
            },
            function(response){
              console.log('Error obteniendo el video rendereado.');
              //do nothing
            }
          );

        },1000);

        return scope;

      });


    }







  });

  return VideoConfigurationPublic;
});
