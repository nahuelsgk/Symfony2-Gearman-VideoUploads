define(function (require) {
  'use strict';

  var RegisterFormBaseView = require('views/account/registerFormBaseView');

  var FormRegisterEanCodeView = RegisterFormBaseView.extend({

    template: JST['client/templates/account/form2.jst'],

    eancode: '',
    isValidCode: false,

    events: {
      /*'change .onWatch': 'askForStores',*/
      'submit #login': 'checkEancodeBeforeLoginSubmit',
      'submit #registro': 'checkEancodeBeforeRegisterSubmit',
      'click #back1': 'onBackHandler',
      'click #back2': 'onBackHandler',
      'click #btnLogin': 'onRegistroHandler',
      'click #btnRegistro': 'onRegistroHandler',
      'click .readed': 'readedTerms',
      'click .registered': 'registeredTerms',
      'click #legaltext a': 'onClickLegal',
      'mouseenter .question1': 'onEnterQuestion1',
      'mouseleave .question1': 'onExitQuestion1',
      'mouseenter .question2': 'onEnterQuestion2',
      'mouseleave .question2': 'onExitQuestion2',
      'click .question2': 'onClickInfo',
      'change select': 'onSelectChange'
    },

    render: function () {

      this.$el.html(this.template({
        name: 'Formulario',
        locale: window.app.locale,
        bot1: window.app.LocaleCollection.get(1).get("formulario")[0].string,
        bot2: window.app.LocaleCollection.get(1).get("formulario")[1].string,
        bot3: window.app.LocaleCollection.get(1).get("formulario")[2].string,
        input1: window.app.LocaleCollection.get(1).get("formulario")[3].string,
        input2: window.app.LocaleCollection.get(1).get("formulario")[4].string,
        input3: window.app.LocaleCollection.get(1).get("formulario")[5].string,
        input4: window.app.LocaleCollection.get(1).get("formulario")[6].string,
        input5: window.app.LocaleCollection.get(1).get("formulario")[7].string,
        input6: window.app.LocaleCollection.get(1).get("formulario")[8].string,
        input7: window.app.LocaleCollection.get(1).get("formulario")[9].string,
        input8: window.app.LocaleCollection.get(1).get("formulario")[10].string,
        input9: window.app.LocaleCollection.get(1).get("formulario")[11].string,
        input10: window.app.LocaleCollection.get(1).get("formulario")[12].string,
        input11: window.app.LocaleCollection.get(1).get("formulario")[13].string
      }));

      return this;
    },
    /**
     * comprueba el codigo ean introducido antes de enviar el formulario
     * @param e
     */
    checkEancodeBeforeLoginSubmit: function (e) {
      var scope = this;
      scope.isValidCode = false;
      scope.eancode = $('input[name="eancode1"]').val();

      window.app.EancodesCollection.each(function (_eancode) {
        var isValidCode = false;
        if (_eancode.get('code') == scope.eancode) {
          scope.isValidCode = true;
        }
      });
      //console.log('isValidCode: ' + scope.eancode + " : " + scope.isValidCode);
      if (scope.isValidCode == false) {
        $('input[name="eancode1"]').val("");
        scope.showErrorMEssage(window.app.LocaleCollection.get(1).get("error_server")[2].string);
        e.preventDefault();
        e.stopPropagation();
      } else {
        this.formLoginSubmit(e);
      }
    },

    checkEancodeBeforeRegisterSubmit: function (e) {
      var scope = this;
      scope.isValidCode = false;
      scope.eancode = $('input[name="eancode2"]').val();

      window.app.EancodesCollection.each(function (_eancode) {
        var isValidCode = false;
        if (_eancode.get('code') == scope.eancode) {
          scope.isValidCode = true;
        }
      });
      //console.log('isValidCode: ' + scope.eancode + " : " + scope.isValidCode);
      if (scope.isValidCode == false) {
        $('input[name="eancode2"]').val("");
        scope.showErrorMEssage(window.app.LocaleCollection.get(1).get("error_server")[2].string);
        e.preventDefault();
        e.stopPropagation();

        // revisa igualmente la fecha de nacimiento
        if (this.validateFecha($('input[name="birth"]').val()) == false) {
          //console.log(2);
          $('input[name="birth"]').val("");
        }
        //valida el check
        if ($('.readed').hasClass('unCheck')) {
          //console.log(4);
          $('.readed').addClass("required");
          $('input').addClass("required");
        }

      } else {
        this.formRegistroSubmit(e);
      }
    },

    _errorFormLoginSubmitCallback: function (error) {

      //console.log(error);
      if (error.code == 0) {
        this.showErrorMEssage(window.app.LocaleCollection.get(1).get("error_server")[0].string);
        $('.registered').removeClass('check').addClass('unCheck');
        $('#loginWrapper').removeClass('animated fadeInRight fadeOutRight').addClass('animated fadeOutRight');
        $('#registroWrapper').removeClass('animated fadeInRight fadeOutRight').addClass('animated fadeInRight');
      } else if (error.code == 1) {
        this.showErrorMEssage(window.app.LocaleCollection.get(1).get("error_server")[3].string);
      } else {
        this.showErrorMEssage(error.message);
        $('.registered').removeClass('check').addClass('unCheck');
        $('#loginWrapper').removeClass('animated fadeInRight fadeOutRight').addClass('animated fadeOutRight');
        $('#registroWrapper').removeClass('animated fadeInRight fadeOutRight').addClass('animated fadeInRight');
      }
      $('#btnLogin').prop("disabled", false);
    },

    _errorFormRegistroSubmitCallback: function (error) {
      if (error.code == 3) {
        this.showErrorMEssage(window.app.LocaleCollection.get(1).get("error_server")[1].string);
      }
      $('#btnRegistro').prop("disabled", false);
    },

    /**
     * Registered user controls.
     * @param event
     */
    registeredTerms: function (event) {
      $('input').removeClass("required");
      $('select').removeClass("required");
      $('.readed').removeClass("required");
      this.showErrorMEssage("");
      if ($('.registered').hasClass('unCheck')) {
        $('.registered').removeClass('unCheck').addClass('check');
        $('#loginWrapper').removeClass('animated fadeInRight fadeOutRight').addClass('animated fadeInRight');
        $('#registroWrapper').removeClass('animated fadeInRight fadeOutRight').addClass('animated fadeOutRight');

      } else if ($('.registered').hasClass('check')) {
        $('.registered').removeClass('check').addClass('unCheck');
        $('#loginWrapper').removeClass('animated fadeInRight fadeOutRight').addClass('animated fadeOutRight');
        $('#registroWrapper').removeClass('animated fadeInRight fadeOutRight').addClass('animated fadeInRight');
      }
    },

    onEnterQuestion1: function (event) {
      $('.birth-svg').show();
    },
    onExitQuestion1: function (event) {
      $('.birth-svg').hide();
    },

    onEnterQuestion2: function (event) {
    $('.eancode-svg').show();
  },
  onExitQuestion2: function (event) {
    $('.eancode-svg').hide();
  },

    onClickInfo: function (e) {

      this.trackEvent({
        'event': 'virtualPageview',
        'page': 'HOW-TO-PARTICIPATE'
      });

      e.preventDefault();
      e.stopPropagation();
      $.fancybox.open({
        type: 'ajax',
        href: 'data/modal/' + window.app.locale + '.info.html',
        scrolling: 'no',
        autoSize: false,
        width: 630,
        height: 620,
        padding: 0,
        beforeShow: function () {
          $('.fancybox-inner').addClass('terms');
          $('.fancybox-inner').css('visibility', 'hidden');
        },
        afterShow: function () {
          $('.fancybox-inner').jScrollPane();
          $('.jspPane').css('padding', '30px');
          $('.fancybox-inner').css('visibility', 'visible');
          $('.fancybox-close').attr('href', window.location.hash);
          //,
          $('.btn-participate').click(function () {
            $('.fancybox-close').trigger('click');
          });
          //'click .btn-participate': 'onClickParticipate'
        }
      });
    },

    onClickLegal: function (e) {
      e.preventDefault();
      e.stopPropagation();
      $.fancybox.open({
        type: 'ajax',
        href: 'data/modal/' + window.app.locale + '.legal.html',
        scrolling: 'no',
        autoSize: false,
        width: 630,
        height: 620,
        padding: 0,
        beforeShow: function () {
          $('.fancybox-inner').addClass('terms');
          $('.fancybox-inner').css('visibility', 'hidden');
        },
        afterShow: function () {
          $('.fancybox-inner').jScrollPane();
          $('.jspPane').css('padding', '30px');
          $('.fancybox-inner').css('visibility', 'visible');
          $('.fancybox-close').attr('href', window.location.hash);
        }
      });
    },

    onSelectChange: function () {
      $('select').removeClass("required");
    }

  });

  return FormRegisterEanCodeView;

});
