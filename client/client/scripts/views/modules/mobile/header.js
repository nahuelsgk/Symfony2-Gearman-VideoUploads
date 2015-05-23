define(['views/baseView'], function (BaseView) {
  'use strict';

  var MobileHeaderView = BaseView.extend({

    template: JST['client/templates/modules/mobile/header.jst'],

    events: {
      'click #es': 'onChengeLocale',
      'click #en': 'onChengeLocale',
      'click #pt': 'onChengeLocale',
      'click .e-facebook': 'enlaceFacebook',
      'click .e-youtube': 'enlaceYoutube',
      'click .e-instagram': 'enlaceInstagram',
      'click .howTo': 'howTo',
      'click .video-menu': 'videoLoad2'
    },

    initialize: function (name) {
      this.contentViewName = name;
      this.msg = window.app.LocaleCollection.get(1).get("social")[0].string;
      this.render();
    },

    render: function () {
      this.$el.html(this.template({
        locale: window.app.locale,
        back: window.app.LocaleCollection.get(1).get("menu")[0].stringMobile,
        menu1: window.app.LocaleCollection.get(1).get("menu")[1].stringMobile,
        menu2: window.app.LocaleCollection.get(1).get("menu")[2].stringMobile,
        menu3: window.app.LocaleCollection.get(1).get("menu")[3].stringMobile,
        menu4: window.app.LocaleCollection.get(1).get("menu")[4].stringMobile,
        menu5: window.app.LocaleCollection.get(1).get("menu")[5].stringMobile,
        menuURL: window.app.LocaleCollection.get(1).get("menu")[6].stringMobile,
        contentViewName:this.contentViewName,
          isHome: this.contentViewName === 'MobileHome'
      }));

      setTimeout(function () {
        $('.button-rounded').removeClass("active");
        if(window.app.locale=="en"){
          $('#en').addClass("active");
        }else if(window.app.locale=="pt"){
          $('#pt').addClass("active");
        }else{
          $('#es').addClass("active");
        }
      }, 500);

      return this;
    },

    onChengeLocale: function (e) {
      e.preventDefault();
      localStorage.setItem('locale', e.target.id);
      window.app.LocaleCollection = null;
      window.app.loadLocale(function () {

        var url = Backbone.history.getFragment($(this).attr('href'));
        if (Backbone.history.fragment == url) {
          Backbone.history.fragment = null;
          Backbone.history.navigate(url, true);
        }
      });
    },
    enlaceFacebook:function(){
      this.trackEvent({
        'event': 'social',
        'socialNetwork': 'facebook',
        'socialAction': '212 official page'
      });
    },
    enlaceYoutube:function(){
      this.trackEvent({
        'event': 'social',
        'socialNetwork': 'youtube',
        'socialAction': '212 official page'
      });
    },
    enlaceInstagram:function(){
      this.trackEvent({
        'event': 'social',
        'socialNetwork': 'instagram',
        'socialAction': '212 official page'
      });
    },
    howTo:function(){
      this.trackEvent({
        'event': 'virtualPageview',
        'page': 'HOW-TO-PARTICIPATE'
      });
    },
    videoLoad2: function (event) {
      event.preventDefault();
      event.stopPropagation();
      var scope = this;
      $('#popup-watch-menu').css('display','block');
      $('#video-watch-menu').get(0).play();
      var video = $('#video-watch-menu').get(0);
      var source = video.getElementsByTagName('source');
      var res = source[0].src.split("/data/");
      var videoUrl = res[1].replace(".mp4", "");
      scope.trackEvent({
        'event': 'gaEvent',
        'eventCategory': 'videos',
        'eventAction': 'vipclubedition-' + videoUrl,
        'eventLabel': 'start',
        "eventNoninteraction": true
      });
      this.watchPointsPercents2(video);
    },
    /**
     * Lanza los eventos de tracking de los videos cuando va pasando por los puntos.
     */
    watchPointsPercents2: function (video) {
      var scope = this;

      var source = video.getElementsByTagName('source');
      var res = source[0].src.split("/data/");
      var videoUrl = res[1].replace(".mp4", "");

      var _25percent = false;
      var _50percent = false;
      var _75percent = false;

      $(video).on('timeupdate', function (event) {

        var percent = video.currentTime / video.duration * 100;

        if (_25percent === false && percent > 25 && percent < 26) {
          ////console.log("TRACKING EVENT 25% VIDEO: "+scope.videoUrl);
          //console.log(videoUrl);
          scope.trackEvent({
            'event': 'gaEvent',
            'eventCategory': 'videos',
            'eventAction': 'vipclubedition-' + videoUrl,
            'eventLabel': '25%',
            "eventNoninteraction": true
          });
          _25percent = true;
        } else if (_50percent === false && percent > 50 && percent < 51) {
          ////console.log("TRACKING EVENT 50% VIDEO: "+scope.videoUrl);
          scope.trackEvent({
            'event': 'gaEvent',
            'eventCategory': 'videos',
            'eventAction': 'vipclubedition-' + videoUrl,
            'eventLabel': '50%',
            "eventNoninteraction": true
          });
          _50percent = true;
        } else if (_75percent === false && percent > 75 && percent < 76) {

          ////console.log("TRACKING EVENT 75% VIDEO: "+scope.videoUrl);
          scope.trackEvent({
            'event': 'gaEvent',
            'eventCategory': 'videos',
            'eventAction': 'vipclubedition-' + videoUrl,
            'eventLabel': '75%',
            "eventNoninteraction": true
          });
          _75percent = true;
        }
      });
    }
  });

  return MobileHeaderView;

});
