define(function (require) {
  'use strict';

  var BaseView = require('views/baseView');
  var StoresCollection = require('collections/stores');

  var RegisterFormBaseView = BaseView.extend({

    events: {
      'submit #login': 'formLoginSubmit',
      'submit #registro': 'formRegistroSubmit',
      'click #back1': 'onBackHandler',
      'click #back2': 'onBackHandler',
      'click #btnLogin': 'onRegistroHandler',
      'click #btnRegistro': 'onRegistroHandler',
      'click .readed': 'readedTerms',
      'click .registered': 'registeredTerms',
      'change input.autocomplete': 'askForStores'
    },

    className: 'formularioWrapper-inside',

    //'blur #zipcode': 'getStoresCollection',

    initialize: function (tag) {
      this.tag = (typeof(tag) === 'string') ? tag : 'default';
      this.collection = StoresCollection;
      // _.bindAll(this, "askForStores");
    },

    paintView: function (contentElement) {
      $(contentElement).html(this.render().$el);

      var scope = this;

      /**
       * genera el plugin de jquery. Ha de esperar un tiempo por no estar el DOM disponible. todo: afterRender
       */
      setTimeout(function () {

        $('form').validator().on('submit', function (e) {
          if (e.isDefaultPrevented()) {
            if ($('select[name="country"] option:selected').text() == window.app.LocaleCollection.get(1).get("formulario")[8].string || $('select[name="country"] option:selected').text() == "") {
              $('select[name="country"]').addClass("required");
            }

            scope.showErrorMEssage(window.app.LocaleCollection.get(1).get("formulario")[24].string);
          } else {
            // everything looks good!
          }
        });

        /*$("#birth").datepicker({
         dateFormat: 'yy-mm-dd',
         changeYear: true,
         changeMonth: true,
         yearRange: '-88:-18',
         navigationAsDateFormat: true
         });*/

        $('#btnLogin').prop("disabled", false);
        $('#btnRegistro').prop("disabled", false);
      }, 500);
    },

    onBackHandler: function (event) {
      var scope = this;
      this.transitionOut(function () {
        return window.app.navigate('participate/' + window.app.tag, {trigger: true});
      });
    },

    onRegistroHandler: function (event) {
      /**
       * tiendas deshabilitado inicialmente
       */
        //this.getStoresCollection();
      $('input').addClass("required");
      if ($('select[name="country"] option:selected').text() == window.app.LocaleCollection.get(1).get("formulario")[8].string || $('select[name="country"] option:selected').text() == "") {
        $('select[name="country"]').addClass("required");
      }
    },
    /**
     * Loggin de usario ya registrado.
     * @param e
     */
    formLoginSubmit: function (e) {

      if (e.isDefaultPrevented()) {
        //el formulario no está validado por bootstrap

        if (this.validateEmail($('input[name="email1"]').val()) == false) {
          $('input[name="email1"]').val("");
        }
        $('input').addClass("required");
        if (window.app.mobile === true) {
          if ($('select[name="tag1"] option:selected').val() == "") {
            $('select[name="tag1"]').addClass("required requiredSelect");
            $('.container-box-select').addClass("requiredContainerSelect");
          }
        }
      } else {
        e.preventDefault();
        $('input').removeClass("required");
        if (window.app.mobile === true) {
          $('select').removeClass("required requiredSelect");
          $('.container-box-select').removeClass("requiredContainerSelect");
        }
        $('#btnLogin').prop("disabled", true);
        var scope = this;
        if (window.app.mobile === true && window.app.tag != "vip" && window.app.tag != "download") {
          window.app.tag = $("#tag1 option:selected").val();
        }
        window.app.user.set('id', 0); //forzar el PUT
        window.app.user.set('email', $('input[name="email1"]').val());
        window.app.user.set('eancode', $('input[name="eancode1"]').val());
        window.app.user.save([], {
          success: function (data) {
            window.app.user.set('loggedIn', true);

            //todo: falta implementar participaciones

            /**
             * controla si se ha registrado desde la página de 1000 descargas. En tal caso no hay upload de video
             */
            if (window.app.tag === 'download') { // participant go to upload.

              return window.app.mobile ? window.app.navigate('m/download/thanks', {trigger: true}) : window.app.navigate('participate/download/thanks', {trigger: true});

            } else if (window.app.tag === 'vip') { // If is "vip" go to thanks.

              if (window.app.mobile === true) {
                return window.app.navigate('m/vip/thanks', {trigger: true});
              } else {
                return window.app.navigate('participate/vip/thanks', {trigger: true});
              }

            } else {

              if (window.app.mobile === true) {
                return window.app.navigate('m/signup/' + window.app.tag + '/upload', {trigger: true});
              } else {
                return window.app.navigate('participate/' + window.app.tag + '/upload', {trigger: true});
              }

            }
          },
          error: function (user, errorResponse) {

            var error = JSON.parse(errorResponse.responseText);

            scope._errorFormLoginSubmitCallback(error);
          }
        });
      }
    },
    /**
     * Funcion de error de registro. (Definido en vistas Child )
     * @private
     */
    _errorFormLoginSubmitCallback: function (error) {
    },

    /**
     * Funcion de error de registro. (Definido en vistas Child )
     * @private
     */
    _errorFormRegistroSubmitCallback: function (error) {
    },

    /**
     * Introduce los datos del formulario en el usuario.
     */
    _updateUserWithForm: function () {

      if (window.app.mobile === true && window.app.tag != "vip" && window.app.tag != "download") {
        window.app.tag = $("#tag2 option:selected").val();
      }
      window.app.user.set('name', $('input[name="name"]').val());
      window.app.user.set('surname', $('input[name="surname"]').val());
      window.app.user.set('email', $('input[name="email2"]').val());
      window.app.user.set('birth', $('input[name="birth"]').val());
      window.app.user.set('zipcode', $('input[name="zipcode"]').val());
      window.app.user.set('gift', $('input[name="gift"]').val());
      window.app.user.set('locale', $('input[name="locale"]').val());
      window.app.user.set('country', $("#country option:selected").val().toLowerCase());
      window.app.user.set('hotSpot', window.app.tag);
      window.app.user.set('store', $('select[name="stores"]').val());
      window.app.user.set('eancode', $('input[name="eancode2"]').val());
    },

    /**
     * Registro de un neuvo usuario.
     * @param e
     */
    formRegistroSubmit: function (e) {

      var scope = this;

      if (this.validateEmail($('input[name="email2"]').val()) == false) {
        e.preventDefault();
        $('input[name="email2"]').val("");
      }
      if (this.validateFecha($('input[name="birth"]').val()) == false) {
        e.preventDefault();
        $('input[name="birth"]').val("");
      }
      if ($('select[name="country"] option:selected').text() == window.app.LocaleCollection.get(1).get("formulario")[8].string || $('select[name="country"] option:selected').text() == "") {
        e.preventDefault();
        $('select[name="country"]').addClass("required");
        if (window.app.mobile === true) {
          $('select[name="country"]').addClass("requiredSelect");
        }
      }
      if ($('.readed').hasClass('unCheck')) {
        e.preventDefault();
        $('.readed').addClass("required");
        $('input').addClass("required");
      }
      if (window.app.mobile === true) {
        if ($('select[name="tag2"] option:selected').val() == "") {
          $('select[name="tag2"]').addClass("required requiredSelect");
          $('.container-box-select').addClass("requiredContainerSelect");
        }
      }
      if (e.isDefaultPrevented()) {
        //KO
      } else {
        e.preventDefault();

        //console.log('formRegistroSubmit ok');

        if ($('.readed').hasClass('check')) {
          $('input').removeClass("required");
          if (window.app.mobile === true) {
            $('select').removeClass("required requiredSelect");
            $('.container-box-select').removeClass("requiredContainerSelect");
          }
          $('#btnRegistro').prop("disabled", true);
          window.app.user.set('id', undefined);

          this._updateUserWithForm();
          ////console.log('Se hace actualizacion de datos de usuario');
          window.app.user.save([], {
            success: function (data) {
              window.app.user.set('loggedIn', true);

              //todo: falta implementar participaciones

              ////console.log(window.app.user.toJSON());
              $('#btnRegistro').prop("disabled", false);

              scope.hideErrorMessage();

              /**
               * controla si se ha registrado desde la página de 1000 descargas. En tal caso no hay upload de video
               */
              if (window.app.tag === 'download') { // participant go to upload.

                return window.app.mobile ? window.app.navigate('m/download/thanks', {trigger: true}) : window.app.navigate('participate/download/thanks', {trigger: true});

              } else if (window.app.tag === 'vip') { // If is "vip" go to thanks.

                if (window.app.mobile === true) {
                  return window.app.navigate('m/vip/thanks', {trigger: true});
                } else {
                  return window.app.navigate('participate/vip/thanks', {trigger: true});
                }

              } else {

                if (window.app.mobile === true) {
                  return window.app.navigate('m/signup/' + window.app.tag + '/upload', {trigger: true});
                } else {
                  return window.app.navigate('participate/' + window.app.tag + '/upload', {trigger: true});
                }

              }

            },
            error: function (user, errorResponse) {

              //console.log(errorResponse);

              var error = JSON.parse(errorResponse.responseText);

              //scope.showErrorMEssage(error.message);

              scope._errorFormRegistroSubmitCallback(error);

              //$('#btnRegistro').prop("disabled", false);
            }
          });
        }
      }
    },
    /**
     * Muestra el mensaje de error retornado por el server.
     */
    showErrorMEssage: function (message) {
      console.log("Error de formulario");
      var errorWrapper = $('.error-upload');
      errorWrapper.html("");
      errorWrapper.html(message);
      errorWrapper.show();
    },
    /**
     * Limpia y esconde el mensaje de error.
     */
    hideErrorMessage: function () {
      $('.error-upload').html("");
      $('.error-upload').hide();
    },

    /**
     * Read terms controls.
     * @param event
     */
    readedTerms: function (event) {
      if ($('.readed').hasClass('unCheck')) {
        $('.readed').removeClass('unCheck').addClass('check');
      } else if ($('.readed').hasClass('check')) {
        $('.readed').removeClass('check').addClass('unCheck');
      }
    },

    /**
     * Registered user controls.
     * @param event
     */
    registeredTerms: function (event) {
      if ($('.registered').hasClass('unCheck')) {
        $('input').removeClass("required");
        $('.registered').removeClass('unCheck').addClass('check');
        if (window.app.mobile === true) {
          $('#loginWrapper').css('display', 'block');
          $('#registroWrapper').css('display', 'none');
        } else {
          $('#loginWrapper').removeClass('animated fadeInRight fadeOutLeft').addClass('animated fadeInRight');
          $('#registroWrapper').removeClass('animated fadeInRight fadeOutLeft').addClass('animated fadeOutLeft');
        }
      } else if ($('.registered').hasClass('check')) {
        $('input').removeClass("required");
        $('.registered').removeClass('check').addClass('unCheck');
        if (window.app.mobile === true) {
          $('#loginWrapper').css('display', 'none');
          $('#registroWrapper').css('display', 'block');
        } else {
          $('#loginWrapper').removeClass('animated fadeInRight fadeOutLeft').addClass('animated fadeOutLeft');
          $('#registroWrapper').removeClass('animated fadeInRight fadeOutLeft').addClass('animated fadeInRight');
        }
      }
      this.showErrorMEssage("");
    },
    /**
     * Settea los parametros para pedir las tiendas al api.
     */
    setStoreCollectionParameters: function () {

      var radio = 0; //kms

      this._updateUserWithForm();
      var parameters = '/' + window.app.user.get("country") + '/' + window.app.user.get("zipcode") + '/' + radio;

      this.collection.setStoresParameters(parameters);

    },
    /**
     * Pregunta si se puede pedir el listado de tiendas.
     * Si es así pide el listado y lo inyecta en el formulario.
     */
    askForStores: function () {

      if( this.tag !== 'download'){

        var scope = this;
        if (this._askForStoreReady()) { // Están todos los parametros listos para ser pedidas las tiendas ?

          this.setStoreCollectionParameters();

          this.collection.fetch({
            success: function () {
              scope._successStoresLoad();
            },
            error: function () {
              scope._errorStoresLoad();
            }
          });

        } else {
          this.cleanStoreList();
        }
      }
    },

    /**
     * Logica de si se puede pedir o no las tiendas.
     * @returns {boolean}
     * @private
     */
    _askForStoreReady: function () {

      this._updateUserWithForm(); //update data user

      return !!(window.app.user.get('zipcode') && window.app.user.get('zipcode') !== "" && window.app.user.get('country') && window.app.user.get('country') !== "" && window.app.user.get('country').toLowerCase() !== window.app.LocaleCollection.get(1).get("formulario")[8].string.toLowerCase());

    },
    /**
     * Callback de que se han pedido correctamente el listado de tiendas.
     * @private
     */
    _successStoresLoad: function () {

      ////console.log(JSON.stringify( this.collection.toJSON()));

      if (this.collection.hasStores()) {
        this.appendStoreList();
      } else {
        this.cleanStoreList();
      }
    },

    /**
     * Error cargando el listado de tiendas.
     * @private
     */
    _errorStoresLoad: function () {
      this.cleanStoreList();
    },
    /**
     * El limina el listado de tiendas desplegables.
     */
    cleanStoreList: function () {
      var stores = $('#stores');
      stores.hide();
      stores.html("");

      // aclaracion de regalo.
      $('.gift').hide();
    },
    /**
     * Inyecta el listado de tiendas en el DOM.
     */
    appendStoreList: function () {
      var html = "";
      var stores = $('#stores');
      stores.html("");

      html = '<option class="placeholder" value="-1" disabled selected>' + window.app.LocaleCollection.get(1).get("formulario")[9].string + '</option>';

      this.collection.each(function (store) {
        html += '<option value="' + store.get('id') + '">' + store.get('name') + '</option>';
      });

      stores.html(html);
      stores.show();

      // aclaracion de regalo.
      $('.gift').show();

    },

    /**
     *  valida email
     */
    validateEmail: function (email) {
      var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
      return re.test(email);
    },

    /**
     *  valida fecha de nacimiento
     */
    validateFecha: function (fecha) {
      var re = /^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/i;

      if (re.test(fecha)) {
        return this.validateMayorEdad(fecha);
      } else {
        return false;
      }
    },
    validateMayorEdad: function (fecha) {

      //console.log(fecha);

      var arr = fecha.split("-");
      var dia = arr[2];
      var mes = arr[1];
      var anio = arr[0];
      var edad = 18;
      var miFecha = new Date();
      miFecha.setFullYear(anio, mes - 1, dia);

      var fechaActual = new Date();
      fechaActual.setFullYear(fechaActual.getFullYear() - edad);
      if ((fechaActual - miFecha) < 0) {
        //console.log("-18");
        this.showErrorMEssage(window.app.LocaleCollection.get(1).get("error_server")[4].string);
        return false;
      }
      //console.log("+18");
      return true;
    }

  });

  return RegisterFormBaseView;

});
