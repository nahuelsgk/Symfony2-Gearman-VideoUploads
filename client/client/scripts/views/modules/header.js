define(['views/baseView'], function (BaseView) {
  'use strict';

  var HeaderView = BaseView.extend({

    template: JST['client/templates/modules/header.jst'],

    events: {
      'click #es': 'onChengeLocale',
      'click #en': 'onChengeLocale',
      'click #pt': 'onChengeLocale',
      'click .botcerrar img': 'onNavBotonCerrarHandler',
      'mouseenter #ch-menu': 'onMenuOpenHandler',
      'mouseleave #ch-menu': 'onMenuCloseHandler',
      'click .logo': 'onMenuClickHandler',
      'click .facebook': 'trackSocialPages',
      'click .youtube': 'trackSocialPages',
      'click .instagram': 'trackSocialPages',
      'click .212-menu-nyc': 'trackSocialPages',
      'click .212-menu-sexy': 'trackSocialPages',
      'click .212-menu-vip': 'trackSocialPages',
      'click .212-menu-vip-rose': 'trackSocialPages',
      'click .212-menu-vip-club-edition': 'trackSocialPages',
      'click .212-menu-socialhub': 'trackSocialPages'
    },

    isOpen: true,
    ch_menu: null,
    ch_menu_content: null,
    ch_menu_languages: null,

    initialize: function () {

      HeaderView.__super__.initialize.apply(this, arguments);

      this.listenTo(window.Events, 'NotBackButton::Initialize', this.hideBackButton);
      this.listenTo(window.Events, 'NotBackButton::Close', this.showBackButton);
      //this.render();

    },

    render: function () {
      console.log("Se crea el header FROM: " + window.app.currentViewName);
      if (!localStorage.getItem('locale')) {
        localStorage.setItem('locale', 'es');
      }
      this.$el.html(this.template({
        'locale': localStorage.getItem('locale'),
        'btnHeader': this.getBtnHeaderUrl()
      }));

      var scope = this;
      setTimeout(function () {
        scope.ch_menu = $("#ch-menu");
        scope.ch_menu_content = scope.ch_menu.children('.content');
        scope.ch_menu_languages = scope.ch_menu_content.find('.lang');
        scope.ch_menu_languages.children('a').on('click', function (event) {
          event.preventDefault();
          event.stopPropagation();
          scope.ch_menu_languages.addClass("active");

          return false;
        });

        window.app.menuTimer = setTimeout(function () {
          scope.toggleMenu();
        }, 2500);

      }, 500);

      if (window.app.currentViewName === 'Timeline' || window.app.currentViewName === 'Home') {
        this.hideBackButton();
      }

      $('body').bind('click', function (event) {
        if (scope.isOpen && $(event.target).closest(scope.ch_menu).length == 0) {
          scope.toggleMenu();
        }
      });

      return this;
    },

    /**
     * Obtiene la configuracion del btn del header.
     * @returns {{action: string, imgType: string}}
     */
    getBtnHeaderUrl:function(){


      if(['Timeline','Ecualizador','Home'].indexOf(window.app.currentViewName) !== -1 ){
        //No tienen btn
        this.btnHeader = undefined;
      }else if([ 'Video','Participate','Gallery','Project'].indexOf(window.app.currentViewName) !== -1){
        //Btn Back and go to timeline
        this.btnHeader = {
            action:'timeline',
            imgType:'back'
          };
      }else if(window.app.tag === 'vip' || window.app.tag === 'download'){
      //Btn X and go to timeline
        this.btnHeader = {
            action:'timeline',
            imgType:'x'
          };
      }else{
        //Btn X and go to participate root
        this.btnHeader = { //default btn back and go to timneline
          action:'participate/'+window.app.tag,
          imgType:'x'
        };
      }


      return this.btnHeader;
    },

    /**
     * Esconde el button de regresar a timeline
     */
    showBackButton: function () {
      this.$el.find('.botcerrar').removeClass('hidden');
      /* this.addAnimatedClass(this.$el.find('.botcerrar'),'animated fadeInRight',false);*/

    },
    /**
     * Muestra el button de regresar a timeline.
     */
    hideBackButton: function () {
      if (!this.$el.find('.botcerrar').hasClass('hidden')) {
        /* this.addAnimatedClass(this.$el.find('.botcerrar'),'animated fadeOutRight',false);*/
        this.$el.find('.botcerrar').addClass('hidden');
      }
    },

    onMenuOpenHandler: function (event) {
      clearTimeout(window.app.menuTimer);
    },
    onMenuCloseHandler: function (event) {
      if (this.isOpen) {
        var scope = this;
        clearTimeout(window.app.menuTimer);
        window.app.menuTimer = setTimeout(function () {
          scope.toggleMenu();
        }, 4000);
      }
    },
    onMenuClickHandler: function (event) {
      event.preventDefault();
      event.stopPropagation();

      this.toggleMenu();
    },
    toggleMenu: function () {
      if (this.isOpen) {
        clearTimeout(window.app.menuTimer);
        this.ch_menu.removeClass("open");
        this.ch_menu_content.slideUp('fast');
        this.isOpen = false;
      } else {
        this.ch_menu.addClass("open");
        this.ch_menu_content.slideDown('fast');
        this.isOpen = true;
      }

      this.ch_menu_languages.removeClass("active");
    },

    /**
     * Sistema de cambio de idioma
     * Guarda en localstorage "es" o "en" segun el ID del boton
     * Borra el LocalCollection y vuelve a ejecutar la carga
     * Refresca la misma página
     * @param e
     */
    onChengeLocale: function (e) {
      e.preventDefault();

      localStorage.setItem('locale', e.target.id);
      window.app.LocaleCollection = null;
      window.app.loadLocale(function () {

        window.Events.trigger('header::CHANGE_LANG');

        var url = Backbone.history.getFragment($(this).attr('href'));
        if (Backbone.history.fragment == url) {
          Backbone.history.fragment = null;
          Backbone.history.navigate(url, true);
        }
      });
    },

    onNavBotonCerrarHandler: function (event) {
      event.preventDefault();
      var route = this.btnHeader.action;
      return window.app.navigate(route, {trigger: true});
    },

    onClickLegal: function (e) {
      e.preventDefault();
      $.fancybox.open({
        type: 'ajax',
        href: 'data/modal/es.legal.html',
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
          $('.fancybox-close').attr('href', '#');
        }
      });
    },

    onClickContact: function (e) {
      e.preventDefault();
      e.stopPropagation();
      $.fancybox.open({
        type: 'ajax',
        href: 'http://www.carolinaherrera.com/212/' + window.app.locale + '/contacto',
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
          $('.fancybox-close').attr('href', '#');
        }
      });
    },

    onClickSuscribe: function (e) {
      e.preventDefault();
      e.stopPropagation();
      $.fancybox.open({
        type: 'ajax',
        href: 'http://www.carolinaherrera.com/212/' + window.app.locale + '/newsletter/subscribe',
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
          $('.fancybox-close').attr('href', '#');
        }
      });
    },
    /**
     * Tracking Social Pages Flow.
     * @param event
     */
    trackSocialPages: function (event) {
      var socialPage = $(event.currentTarget).attr('class');

      this.trackEvent(({
        'event': 'social',
        'socialNetwork': socialPage,
        'socialAction': '212 official page'
      }))
    }

  });

  return HeaderView;

});
