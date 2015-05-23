define(function (require) {
  'use strict';

  var RegisterFormBaseView = require('views/account/registerFormBaseView');
  var StoresCollection = require('collections/stores');
  var SignupView = RegisterFormBaseView.extend({

    //el: '#content',

    template: JST['client/templates/account/mobile/signup.jst'],

    events: {
      'change .onWatch': 'askForStores',
      'submit #login': 'formLoginSubmit',
      'submit #registro': 'formRegistroSubmit',
      'click #btnLogin': 'onRegistroHandler',
      'click #btnRegistro': 'onRegistroHandler',
      'click .readed': 'readedTerms',
      'click .registered': 'registeredTerms',
      'click #legaltext a': 'onClickLegal',
      'change select': 'onSelectChange',
      'click .question1': 'onEnterQuestion1',
      'click .box-select': 'selectMomento'
    },

    initialize: function () {
      this.collection = StoresCollection;
      window.app.tag = 'signup';
    },

    render: function () {
      window.app.currentViewName = 'Signup';

      /**
       * controla que el tag sea valido (formTags.json) o salta al timeline
       */

      var scope = this;

      this.$el.html(this.template({
        name: 'Signup',
        locale: window.app.locale,
        block1Title: window.app.LocaleCollection.get(1).get("home")[1].stringMobile,
        text: window.app.LocaleCollection.get(1).get("formulario")[14].stringMobile,
        selectText: window.app.LocaleCollection.get(1).get("formulario")[15].stringMobile,
        selectValue1: window.app.LocaleCollection.get(1).get("formulario")[16].stringMobile,
        selectValue2: window.app.LocaleCollection.get(1).get("formulario")[17].stringMobile,
        selectValue3: window.app.LocaleCollection.get(1).get("formulario")[18].stringMobile,
        selectValue4: window.app.LocaleCollection.get(1).get("formulario")[19].stringMobile,
        text2: window.app.LocaleCollection.get(1).get("formulario")[20].stringMobile,
        text3: window.app.LocaleCollection.get(1).get("formulario")[25].stringMobile,
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

    _errorFormLoginSubmitCallback: function (error) {
      if (error.code == 0) {
        this.showErrorMEssage(window.app.LocaleCollection.get(1).get("error_server")[0].string);
        $('.registered').removeClass('check').addClass('unCheck');
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
        $('.registered').removeClass('check').addClass('unCheck');
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
        width: '100%',
        height: '80%',
        padding: 0,
        beforeShow: function () {
          $('.fancybox-inner').addClass('terms');
          $('.fancybox-inner').css('visibility', 'hidden');
        },
        afterShow: function () {
          $('.fancybox-inner').jScrollPane();
          $('.jspPane').css('padding', '30px');
          $('.fancybox-inner').css('visibility', 'visible');
          $('.fancybox-close').removeAttr('href');
        }
      });
    },

    onEnterQuestion1: function (event) {
      $('.birth-svg').show();
      setTimeout(function () {
        $('.birth-svg').hide();
      }, 2000);
    },

    selectMomento: function (event) {
      event.preventDefault();
      $('.box-select').removeClass('select-active');
      $(event.currentTarget).addClass('select-active');
      $(".select-tag").val($(event.currentTarget).attr("data-id"));
    }

  });

  return SignupView;

});
