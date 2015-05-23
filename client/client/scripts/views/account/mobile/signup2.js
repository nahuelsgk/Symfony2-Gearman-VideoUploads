define(function (require) {
  'use strict';

  var RegisterFormBaseView = require('views/account/registerFormBaseView');
  var StoresCollection = require('collections/stores');
  var Signup2View = RegisterFormBaseView.extend({

    template: JST['client/templates/account/mobile/signup2.jst'],

    eancode: '',
    isValidCode: false,

    events: {
      //'change .onWatch': 'askForStores',
      /*'submit #login': 'formLoginSubmit',
       'submit #registro': 'formRegistroSubmit',*/
      'submit #login': 'checkEancodeBeforeLoginSubmit',
      'submit #registro': 'checkEancodeBeforeRegisterSubmit',
      'click #btnLogin': 'onRegistroHandler',
      'click #btnRegistro': 'onRegistroHandler',
      'click .readed2': 'readedTerms',
      'click .registered2': 'registeredTerms',
      'click #legaltext2 a': 'onClickLegal', /*'mouseenter .question-svg': 'onEnterQuestion',
       'mouseleave .question-svg': 'onExitQuestion'*/
      'click .question2': 'onEnterQuestion',
      'change select': 'onSelectChange',
      'click .question1': 'onEnterQuestion1'
    },

    initialize: function (tag) {

      this.tag = (typeof(tag) === 'string') ? tag : 'default';
      window.app.tag = this.tag;

      this.collection = StoresCollection;
    },

    render: function () {
      window.app.currentViewName = 'Signup2';

      var scope = this;

      var textEan1,textEan2;

      if(this.tag === 'download'){
        textEan1 = window.app.LocaleCollection.get(1).get("participate")[4].tags[scope.tag].title;
        textEan2 = window.app.LocaleCollection.get(1).get("participate")[4].tags[scope.tag].string;
      }else{
        textEan1 = window.app.LocaleCollection.get(1).get("formulario")[21].stringMobile;
        textEan2 = window.app.LocaleCollection.get(1).get("formulario")[22].stringMobile;
      }

      this.$el.html(this.template({
        isDownload : this.tag === 'download',
        name: 'Signup2',
        locale: window.app.locale,
        text: window.app.LocaleCollection.get(1).get("formulario")[14].stringMobile,
        selectText: window.app.LocaleCollection.get(1).get("formulario")[15].stringMobile,
        selectValue1: window.app.LocaleCollection.get(1).get("formulario")[16].stringMobile,
        selectValue2: window.app.LocaleCollection.get(1).get("formulario")[17].stringMobile,
        selectValue3: window.app.LocaleCollection.get(1).get("formulario")[18].stringMobile,
        selectValue4: window.app.LocaleCollection.get(1).get("formulario")[19].stringMobile,
        text2: window.app.LocaleCollection.get(1).get("formulario")[20].stringMobile,
        textEan1: textEan1,
        textEan2: textEan2,
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
        input11: window.app.LocaleCollection.get(1).get("formulario")[13].string,
        input12: window.app.LocaleCollection.get(1).get("formulario")[23].stringMobile
      }));

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
        var isSafari = /constructor/i.test(window.HTMLElement);
        if (isSafari) {
          $('.container-form').addClass("safari");
        }
        $('html, body').animate({scrollTop: $("#wrapper").offset().top}, 500);
        $('#btnLogin').prop("disabled", false);
        $('#btnRegistro').prop("disabled", false);
      }, 500);

      return this;
    },
    /**
     * comprueba el codigo ean introducido antes de enviar el formulario
     * @param e
     */
    checkEancodeBeforeLoginSubmit: function (e) {

      if(this.tag !== "download"){

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
      }else{
        this.formLoginSubmit(e);
      }
    },

    checkEancodeBeforeRegisterSubmit: function (e) {

      if(this.tag !== "download") {

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
        } else {
          this.formRegistroSubmit(e);
        }
      }else{
        this.formRegistroSubmit(e);
      }
    },

    _errorFormLoginSubmitCallback: function (error) {
      if (error.code == 0) {
        this.showErrorMEssage(window.app.LocaleCollection.get(1).get("error_server")[0].string);
        $('.registered2').removeClass('check').addClass('unCheck');
        if (window.app.mobile === true) {
          $('#loginWrapper').css('display', 'none');
          $('#registroWrapper').css('display', 'block');
        } else {
          $('#loginWrapper').removeClass('animated fadeInRight fadeOutLeft').addClass('animated fadeOutLeft');
          $('#registroWrapper').removeClass('animated fadeInRight fadeOutLeft').addClass('animated fadeInRight');
        }
      } else if (error.code == 1) {
        this.showErrorMEssage(window.app.LocaleCollection.get(1).get("error_server")[3].string);
      } else {
        this.showErrorMEssage(error.message);
        $('.registered2').removeClass('check').addClass('unCheck');
        if (window.app.mobile === true) {
          $('#loginWrapper').css('display', 'none');
          $('#registroWrapper').css('display', 'block');
        } else {
          $('#loginWrapper').removeClass('animated fadeInRight fadeOutLeft').addClass('animated fadeOutLeft');
          $('#registroWrapper').removeClass('animated fadeInRight fadeOutLeft').addClass('animated fadeInRight');
        }
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
      if ($('.registered2').hasClass('unCheck')) {
        $('input').removeClass("required");
        $('.registered2').removeClass('unCheck').addClass('check');
        if (window.app.mobile === true) {
          $('#loginWrapper').css('display', 'block');
          $('#registroWrapper').css('display', 'none');
        } else {
          $('#loginWrapper').removeClass('animated fadeInRight fadeOutLeft').addClass('animated fadeInRight');
          $('#registroWrapper').removeClass('animated fadeInRight fadeOutLeft').addClass('animated fadeOutLeft');
        }
      } else if ($('.registered2').hasClass('check')) {
        $('input').removeClass("required");
        $('.registered2').removeClass('check').addClass('unCheck');
        if (window.app.mobile === true) {
          $('#loginWrapper').css('display', 'none');
          $('#registroWrapper').css('display', 'block');
        } else {
          $('#loginWrapper').removeClass('animated fadeInRight fadeOutLeft').addClass('animated fadeOutLeft');
          $('#registroWrapper').removeClass('animated fadeInRight fadeOutLeft').addClass('animated fadeInRight');
        }
      }
    },

    /*onEnterQuestion: function (event) {
     $('.eancode-svg').show();
     },*/
    onEnterQuestion: function (e) {
      this.trackEvent({
        'event': 'virtualPageview',
        'page': 'HOW-TO-PARTICIPATE'
      });
      e.preventDefault();
      e.stopPropagation();
      $.fancybox.open({
        type: 'ajax',
        href: 'data/modal/mobile/' + window.app.locale + '.how.html',
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
    onExitQuestion: function (event) {

      $('.eancode-svg').hide();
    },

    onClickLegal: function (e) {
      this.trackEvent({
        'event': 'virtualPageview',
        'page': 'LEGAL-TERMS'
      });
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
    },

    onEnterQuestion1: function (event) {
      $('.birth-svg').show();
      setTimeout(function () {
        $('.birth-svg').hide();
      }, 2000);
    }

  });

  return Signup2View;

});
