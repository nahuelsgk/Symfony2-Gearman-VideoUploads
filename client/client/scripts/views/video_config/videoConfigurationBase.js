define(function (require) {
  'use strict';

  var BaseView = require('views/baseView');

  var VideoConfigurationBase = BaseView.extend({

    defaultVideoConfig:{
      title:'212',
      filter:'italiano',
      hotSpot:'default',
      confirm_token:''
    },

    events:{
      'click .step':'goToStep'
    },

    initialize:function(tag){

      //window.app.lastViewName = undefined;

      this.tag = tag;


      if(!window.app.configVideoOptions)
        window.app.configVideoOptions = new Backbone.Model(this.defaultVideoConfig);

      window.app.configVideoOptions.set('hotSpot',this.tag);
      window.app.configVideoOptions.set('confirm_token',window.app.user.get('confirm_token'));

      /**
       * Redirige al usuario a login si no está autenticado (Esto solo debe existir en las pantallas que vienen solo del flujo de la app
       * Si la URL es externa, ej. From Email, Public , se debe dejar pasar al usuario aunque no esté loggeado.)
       *
       if (! window.app.user.isAuthenticated()){
         if(window.app.mobile){
            window.app.navigate('m/signup/'); // Si no está loggeado "upload" lo lleva a "signup"
          }else{
            window.app.navigate('participate/'+this.tag+'/upload'); // Si no está loggeado "upload" lo lleva a "signup"
          }
        }
       */

    },
     /**
       * Go to Select the filter.
       */
     goToStep:function(e){
      var step = $(e.currentTarget).attr('data-value');
       window.app.user.logAction('VideoConfig::goToStep::'+step,window.app.currentViewName);
       if(window.app.mobile){
          window.app.navigate('m/signup/'+this.tag+'/config-video/'+step,{trigger:true});
       }else{
          window.app.navigate('participate/'+this.tag+'/config-video/'+step,{trigger:true});
       }
    },

    /**
     * Cambia el objeto seleccionado por el control de efectos.
     * @param e
     * @returns {*|jQuery}
     */
    chagenSelectedEffect:function(e){
      var selectElement = $(e.currentTarget).find('img').attr('data-select');
      var img = this.$el.find('.img-preview.'+selectElement);
      this.$el.find('.img-preview').removeClass('hidden');
      this.$el.find('.img-preview').addClass('hidden');
      img.removeClass('hidden');
      return selectElement;
    },

    onClose:function(){
      window.app.lastViewName = 'ConfigView';
      VideoConfigurationBase.__super__.initialize.apply(this, arguments);
    },

    /**
     * Muestra el video en el DOM.
     * @param response
     */
    showRenderVideo:function(response){

      var videoUrl = response.url;

      window.app.user.logAction('VideoResult::showRenderVideo',window.app.currentViewName);

      var scope = this;

      if(window.app.mobile){
        var html =  '<video id="videoResult" src="'+videoUrl+'" poster="images/desktop/212-title.jpg"></video>' + '<img src="images/mobile/play.svg" alt="" class="play-btn"/>';
      }else{
        var html =  '<video id="videoResult" src="'+videoUrl+'" poster="images/desktop/cartela-212.jpg"></video>' + '<img src="images/mobile/play.svg" alt="" class="play-btn"/>';
      }

      this.$el.find('.wrapper-video-preview').html(html);

      document.getElementById("videoResult").onended = function () {
        scope.showPlayBtn();
      };

    },

    /**
     * Play the video loaded
     */
    playVideo:function(){
      var video = this.$el.find('#videoResult').get(0);
      this.$el.find(".play-btn").css('visibility','hidden');
      video.play();
    },
    /**
     * Muestra el btn de play
     */
    showPlayBtn:function(){
      this.$el.find(".play-btn").css('visibility','visible');
    }




  });

  return VideoConfigurationBase;
});
