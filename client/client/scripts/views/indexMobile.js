define(['views/baseView'], function (BaseView) {
    'use strict';

    var MobileIndexView = BaseView.extend({

        //el: '#content',

        template: JST['client/templates/indexMobile.jst'],

        idClicked: '',

        events: {
            'click .video-buttons': 'videoLoad'
        },

        render: function () {
            window.app.currentViewName = 'MobileHome';

          var scope = this;

            var modelAudioCheck = new Backbone.Model();
            modelAudioCheck.url = _SERVER_PATH + '/audio-check';

            modelAudioCheck.fetch({
              success:function(response) {
                scope.paintView(response.get('result'));
              },
              error:function(){
                scope.paintView(undefined);
              }
            });



        },
      /**
       * REnder Original que se ha sobreescrito.
       */
        paintView:function(thereIsCodeAvailables){

          var existSomeCode = thereIsCodeAvailables ? thereIsCodeAvailables : false;

          this.$el.html(this.template({
            name: window.app.currentViewName,
            block1Title: window.app.LocaleCollection.get(1).get("home")[1].stringMobile,
            block1Texto: window.app.LocaleCollection.get(1).get("home")[2].stringMobile,
            block1Button: window.app.LocaleCollection.get(1).get("home")[3].stringMobile,
            block2Title: window.app.LocaleCollection.get(1).get("home")[4].stringMobile,
            block3Title: window.app.LocaleCollection.get(1).get("home")[5].stringMobile,
            block4Title: window.app.LocaleCollection.get(1).get("home")[6].stringMobile,
            block5Title: window.app.LocaleCollection.get(1).get("home")[7].stringMobile,
            block6Title: window.app.LocaleCollection.get(1).get("home")[8].stringMobile,
            block7Title: window.app.LocaleCollection.get(1).get("home")[9].stringMobile,
            block7Texto: window.app.LocaleCollection.get(1).get("home")[10].stringMobile,
            block7Button1: window.app.LocaleCollection.get(1).get("home")[11].stringMobile,
            block7Button2: window.app.LocaleCollection.get(1).get("home")[12].stringMobile,
            menuURL: window.app.LocaleCollection.get(1).get("menu")[6].stringMobile,
            downloadNowText: window.app.LocaleCollection.get(1).get("footer")[8].string,
            ifItWasentForYou: window.app.LocaleCollection.get(1).get("footer")[1].string,
            existSomeCode: existSomeCode
          }));

          return this;
        },

        videoLoad: function (event) {
            var scope = this;
            scope.idClicked = $(event.currentTarget).attr('id');
            $('#popup-' + scope.idClicked).css('display', 'block');
            $('.navbar-default').css('display', 'none');
            $('#video-' + scope.idClicked).get(0).play();
            var video = $('#video-' + scope.idClicked).get(0);
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
            this.watchPointsPercents(video);
        },
        /**
         * Lanza los eventos de tracking de los videos cuando va pasando por los puntos.
         */
        watchPointsPercents: function (video) {
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

    return MobileIndexView;
});
