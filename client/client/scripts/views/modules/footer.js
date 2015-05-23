define(['views/baseView'], function (BaseView) {
  'use strict';

  var FooterView = BaseView.extend({

    template: JST['client/templates/modules/footer.jst'],

    events: {
      'click #infolbox': 'onClickInfo',
      'click #legalbox': 'onClickLegal',
      'mouseenter #ean-box-display': 'onEnterEanCode',
      'click #ean-box-display': 'onClickEanCode',
      'mouseleave #ean-box': 'onExitEanCode',
      'click #eancode-btn': 'onClickEanCode',
      'click .sound-cloud-alesso': 'trackSocialPages'
    },

    initialize: function () {

      FooterView.__super__.initialize.apply(this, arguments);


      /* // Re-render template when user model changes window.Events.trigger('layoutChange::NOT-FOOTER-OPEN');
       this.listenTo(user, 'change', this.render);*/
      this.listenTo(window.Events, "NotBackButton::Initialize", this.render);
      this.listenTo(window.Events, 'timeline::endPresentation', this.showPopups);

      //this.render();
    },

    render: function (_callback) {

      var scope = this;

      var modelAudioCheck = new Backbone.Model();
      modelAudioCheck.url = _SERVER_PATH + '/audio-check';

      modelAudioCheck.fetch({
        success:function(response){
            var thereIsSomeCodeAvailable = response.get('result');

            scope.$el.html(scope.template({
              name: 'Footer',
              isHome: window.app.currentViewName === 'Home',
              nav1: window.app.LocaleCollection.get(1).get("footer")[0].string,
              nav2: window.app.LocaleCollection.get(1).get("footer")[1].string,
              nav3: window.app.LocaleCollection.get(1).get("footer")[2].string,
              nav4: window.app.LocaleCollection.get(1).get("footer")[3].string,
              txt1: window.app.LocaleCollection.get(1).get("footer")[4].string,
              txt2: window.app.LocaleCollection.get(1).get("footer")[5].string,
              txt3: window.app.LocaleCollection.get(1).get("footer")[6].string,
              txt4: window.app.LocaleCollection.get(1).get("footer")[7].string,
              txt5: window.app.LocaleCollection.get(1).get("footer")[8].string,
              thereIsSomeCodeAvailable: thereIsSomeCodeAvailable
            }));

            if(_callback)_callback(scope);

            return scope;
        },
        error:function(){
            scope.$el.html(scope.template({
              name: 'Footer',
              isHome: window.app.currentViewName === 'Home',
              nav1: window.app.LocaleCollection.get(1).get("footer")[0].string,
              nav2: window.app.LocaleCollection.get(1).get("footer")[1].string,
              nav3: window.app.LocaleCollection.get(1).get("footer")[2].string,
              nav4: window.app.LocaleCollection.get(1).get("footer")[3].string,
              txt1: window.app.LocaleCollection.get(1).get("footer")[4].string,
              txt2: window.app.LocaleCollection.get(1).get("footer")[5].string,
              txt3: window.app.LocaleCollection.get(1).get("footer")[6].string,
              txt4: window.app.LocaleCollection.get(1).get("footer")[7].string,
              txt5: window.app.LocaleCollection.get(1).get("footer")[8].string,
              thereIsSomeCodeAvailable: false
            }));

            if(_callback)_callback(scope);

            return scope;
        }
      });
    },

    showPopups: function (e) {
      if(window.app.showPopups){
        this.openPopupInfo();
        window.app.showPopups = false;
      }
    },

    onClickInfo: function (e) {

      this.trackEvent({
        'event': 'virtualPageview',
        'page': 'HOW-TO-PARTICIPATE'
      });

        e.preventDefault();
        e.stopPropagation();

      this.openPopupInfo();

    },

    openPopupInfo: function () {

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

    onEnterEanCode: function (e) {
      e.preventDefault();
      e.stopPropagation();

      //if (window.app.currentViewName != 'Signup' || window.app.tag != 'vip') {
      //console.log(window.app.currentViewName);
      if (window.app.currentViewName == 'Timeline' || window.app.currentViewName == 'Ecualizador') {
        $("#ean-box").css('pointer-events', 'all');
        $("#ean-box-popup").css("display", "inline-block");
        $("#ean-box-popup").removeClass('animated fadeInRight fadeOutRight').addClass('animated fadeInRight');

        $("#ean-box-popup").one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function () {
          $("#eancode-btn").css("display", "block");
          $("#eancode-btn").removeClass('animated fadeIn').addClass('animated fadeIn');
        });
      }

    },
    onExitEanCode: function (e) {
      e.preventDefault();

      $("#ean-box").css('pointer-events', 'none');
      $("#ean-box-popup").removeClass('animated fadeInRight fadeOutRight').addClass('animated fadeOutRight');
      $("#ean-box-popup").one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function () {
        $("#eancode-btn").css("display", "none");
      });

    },
    onClickEanCode: function (e) {
      e.preventDefault();

      this.onExitEanCode(e);

      return window.app.navigate('/participate/vip/signup', {trigger: true});
    },
    onClickParticipate: function (e) {
      e.preventDefault();

      return window.app.navigate('/participate/vip/signup', {trigger: true});
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
    },
    /**
     * Esconde el footer para vistas que no lo llevan.
     */
    watchOverFooter:function(){
      console.log('Se escucha el evento');
      if(['VideoCartela','VideoFilter','VideoDone','VideoPublic'].indexOf(window.app.currentViewName) === -1){
          console.log('render ');
          this.render();
      }else{
          console.log('close');
         this.close();
      }
    },
    /**
     * Muestra el footer nuevamente.
     */
    showFooter:function(){
      console.log("Se muestra el footer");
      $('footer').show();
    }



  });

  //<a class="sound-cloud-alesso" href="https://soundcloud.com/eliasenglase/alesso-if-it-wasnt-for-you-teaser-for-carolina-herrera-212vip" target="_blank" data-bypass><%= nav2 %> <img style="padding-left:5px" src="images/desktop/soundcloud.svg" width="80px" height="40px"/></a>

  return FooterView;

});
