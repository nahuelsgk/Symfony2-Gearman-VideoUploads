define(function () {
  'use strict';

  var User = Backbone.Model.extend({

    url: _SERVER_PATH+'/user',

    idAttribute: "id",

    initialize: function () {
    },
    /**
     * Get User by Token
     * @param token
     * @param _callback
     */
    getUserByToken:function(token,_callback){

      var scope = this;

      $.ajax({
        url: this.url+'/'+token,
        type: 'get',
        success: function(userJson) {
          //console.log("Se han pedido los datos del usuario.");
          scope.set(userJson);
          if(_callback)_callback()
        },
        error: function(res) {
          console.log("Error obteniendo los datos del usuario: "+res);
          //todo: El codigo no existe , o no existe el usuario , redirigir a 404.
        }
      });
    },

    /**
     * Get User by Token
     * @param token
     * @param _callback
     */
    getUserByVideoToken:function(token,_callback,_callbackError){

      var scope = this;

      $.ajax({
        url: this.url+'/video/'+token,
        type: 'get',
        success: function(userJson) {
          scope.set(userJson);
          if(_callback)_callback(userJson)
        },
        error: function(res) {
          if(_callbackError)_callbackError(res);
          console.log("Error obteniendo los datos del usuario: "+res);
        }
      });
    },
    /**
     * Make the video confirmation.
     * @param _callback
     */
    makeConfirmation:function(_callback){

      var scope = this;

      $.ajax({
        url: this.url+'/confirm-video/'+scope.get("confirm_token"),
        type: 'post',
        success: function(userJson) {
          //scope.set(userJson);
          if(_callback)_callback()
        },
        error: function(res) {
          console.log("Error Confirmando Video Upload: "+res);
        }
      });
    },

    /**
     * Obtiene el codigo de Descarga de Audio del usuario.
     * @param _callback
     */
    getAudioCode:function(_callback,_callbackError){

      var scope = this;

      $.ajax({
        url: this.url+'/'+this.get("id")+'/audio',
        type: 'get',
        success: function(response) {
          //console.log("Se han pedido los datos del usuario.");
          scope.set('audioCode',response.code);
          if(_callback)_callback(response)
        },
        error: function(res) {
          //console.log("Error obteniendo el codigo de descarga del usuario: "+res);
          if(_callbackError)_callbackError(res);
        }
      });

    },

    /**
     * Obtiene el codigo de Descarga de Audio del usuario.
     * @param _callback
     * @param _callbackError
     */
    generatePreviewForVideo:function(_callback,_callbackError){

      var scope = this;

      if(this.get('confirm_token')){
        $.ajax({
          url: this.url+'/video/preview/'+scope.get('confirm_token'),
          type: 'post',
          success: function(response) {
            console.log('Mandado a generar el preview correctamente');
            if(_callback)_callback(response)
          },
          error: function(res) {
            console.log('Error mandando a generar el preview del video');
            if(_callbackError)_callbackError(res);
          }
        });
      }else{
        console.log('ERROR: Este usuario no tiene un token de video.');
      }
    },
    /**
     * Obtiene el preview de las imagenes de video.
     * @param _callback
     * @param _callbackError
     */
    getPreviewForVideo:function(_callback,_callbackError){

      var scope = this;

      if(this.get('confirm_token')){
        $.ajax({
          url: this.url+'/video/preview/'+scope.get('confirm_token'),
          type: 'get',
          success: function(response) {
            if(response.status === 'ok'){
              console.log('Estan listas las imagenes.');
              if(_callback)_callback(response.images)
            }else{
              console.log('No están listas las imagenes aun.');
              if(_callbackError)_callbackError(response);
            }
          },
          error: function(response) {
            console.log('Getting preview');
            if(_callbackError)_callbackError(response);
          }
        });
      }else{
        console.log('ERROR: Este usuario no tiene un token de video.');
      }
    },

    /**
     * Invoka el render del video.
     * @param _callback
     * @param _callbackError
     * @param videoConfig [video configuration object. ]
     */
    invokeVideoRender:function(videoConfig,_callback,_callbackError){

      var scope = this;

      if(this.get('confirm_token')){
        $.ajax({
          url: this.url+'/video/render/'+scope.get('confirm_token'),
          type: 'post',
          data:videoConfig,
          success: function(response) {
            console.log('Se manda a generar el render del video OK ');
            if(_callback)_callback(response)
          },
          error: function(response) {
            console.log('Error mandando a generar render video. KO ');
            if(_callbackError)_callbackError(response);
          }
        });
      }else{
        console.log('ERROR: Este usuario no tiene un token de video.');
      }
    },

    /**
     * Obtiene el video procesado.
     * @param _callback
     * @param _callbackError
     */
    getVideoRender:function(_callback,_callbackError){

      var scope = this;

      if(this.get('confirm_token')){
        $.ajax({
          url: this.url+'/video/render/'+scope.get('confirm_token'),
          type: 'get',
          success: function(response) {
            console.log('GETTING VIDEO render');
            if(_callback)_callback(response)
          },
          error: function(response) {
            console.log('Error GETTING VIDEO render. KO ');
            if(_callbackError)_callbackError(response);
          }
        });
      }else{
        console.log('ERROR: Este usuario no tiene un token de video.');
        if(_callbackError)_callbackError();
      }
    },



    /**
     * Check to see if current user is authenticated
     */
    isAuthenticated: function (callback) {

      return this.get('loggedIn');
      //return true;

    },
    /**
     * Log The acctions of user [Debug]
     * @param action
     * @param currentView
     * @param _callback
     * @param _callbackError
     */
    logAction:function(action,currentView,_callback,_callbackError){

      var dataModel = new Backbone.Model(
        {
          action:action,
          currentView:currentView,
          navData:navigator.userAgent,
          userData:{
            id:this.get('id'),
            name:this.get('name'),
            confirm_token:this.get('confirm_token')
          }
        }
      );

      $.ajax({
        url: _SERVER_PATH+'/log-action',
        type: 'post',
        data:dataModel.toJSON(),
        success: function(response) {
          if(_callback)_callback(response)
        },
        error: function(response) {
          if(_callbackError)_callbackError(response);
        }
      });

    }

  });

  return new User();

});

