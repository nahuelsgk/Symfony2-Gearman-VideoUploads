define(function (require) {
  'use strict';

  //Views.
  var User = require('./models/user');
  var DefaultView = require('./views/layouts/default');
  var BackgroundImgView = require('./views/modules/background_img');
  var BackgroundVideoView = require('./views/modules/background_video');
  var HeaderView = require('./views/modules/header');
  var FooterView = require('./views/modules/footer');
  var IndexView = require('./views/index');
  var TimelineView = require('./views/timeline');
  var TimelineVideoView = require('./views/timelineVideo');
  var EcualizadorView = require('./views/ecualizador');
  var ParticipateView = require('./views/participate');
  var SignupView = require('./views/account/signup');
  var SignupView2 = require('./views/account/signup2');
  var VideoView = require('./views/video');
  var UploadVideoView = require('./views/uploadVideo');
  var GalleryView = require('./views/layouts/gallery');
  var ThanksView = require('./views/thanks');
  var VideoConfirmationView = require('./views/videoConfirmation');
  var UnsuscribeView = require('./views/unsuscribe');
  var MobileView = require('./views/layouts/mobile');
  var MobileHeaderView = require('./views/modules/mobile/header');
  var MobileFooterView = require('./views/modules/mobile/footer');
  var MobileIndexView = require('./views/indexMobile');
  var MobileSignupView = require('./views/account/mobile/signup');
  var MobileSignup2View = require('./views/account/mobile/signup2');
  var MobileUploadVideoView = require('./views/mobile/uploadVideo');
  var MobileThanksView = require('./views/mobile/thanks');
  var MobileThanks2View = require('./views/mobile/thanks2');
  var MobileVideoConfirmationView = require('./views/mobile/videoConfirmation');
  var MobileHowView = require('./views/mobile/how');
  var VideoIntro = require('./views/video_config/videoConfigurationIntro');
  var VideoCartela = require('./views/video_config/videoConfigurationCartela');
  var VideoConfigurationFilter = require('./views/video_config/videoConfigurationFilter');
  var VideoConfigurationResult = require('./views/video_config/videoConfigurationResult');
  var VideoPublic = require('./views/video_config/videoConfigurationPublic');
  var Project = require('./views/project');

  //Vars
  var locale, backgroundImg, backgroundVideo, backgroundType, mainContent, header, footer, mobile;

  //Models

  //Collections
  var HotSpotsCollection = require('./collections/hotspots');
  var FormTagCollection = require('./collections/formTags');
  var LocaleCollection = require('./collections/locale');
  var EancodesCollection = require('./collections/eancodes');

  // Handle displaying and cleaning up views
  var currentView;

  localStorage.removeItem("videoState");

  var render = function (view) {

    if (currentView) {
      //Close Children Views.
      if (view.childViews) {
        _.each(view.childViews, function (view, selector) {
          this.childViews[selector].close();
        }, this);
      }
      //Close the view
      currentView.close();
    }
    currentView = view;

    $('#wrapper').html(currentView.render().$el);
  };

  var Router = Backbone.Router.extend({

    header: null,
    backgroundImg: null,
    backgroundVideo: null,
    mainContent: null,
    footer: null,
    timer: null,
    inactiveTime: 0,
    timerIntervalInactivity: 3000,
    timerIntervalInactivityMax: 3,
    timerIntervalActivity: 1000,
    currentViewName: '',
    mobile: false,
    tag: '',

    routes: {
      '': 'index',
      'timeline': 'timeline',
      'timeline/how-to-participate': 'howtoparticipate',
      'timelineVideo': 'timelineVideo',
      'ecualizador': 'ecualizador',
      'participate': 'participate',
      'participate/:tag': 'participate',
      'participate/:tag/signup': 'signup',
      'participate/:tag/video': 'video',
      'participate/:tag/upload': 'upload',
      'participate/:tag/thanks': 'thanks',
      'participate/:tag/config-video/title': 'configVideoTitle',
      'participate/:tag/config-video/filter': 'configVideoFilter',
      'participate/:tag/config-video/done': 'configVideoDone',
      'participate/:tag/config-video/done/:token': 'configVideoDoneFromMail',
      'participate/:tag/public-video/:videoToken': 'sharedPublicVideoLanding',
      'signup': 'signup',
      'behind-scenes': 'behindScenes',
      'collaboration': 'collaboration',
      'making-off': 'makingOff',
      'gallery': 'gallery',
      'live-show': 'liveShow',
      'project': 'project',
      'confirmation/:token': 'confirmationVideo',
      'unsuscribe/:token': 'unsuscribeUser',
      'm/': 'homeMobile',
      'm/signup': 'signupMobile',
      'm/vip': 'signup2Mobile',
      'm/download': 'signupDownload',
      'm/signup/:tag/upload': 'uploadMobile',
      'm/signup/:tag/thanks': 'thanksMobile',
      'm/vip/thanks': 'thanks2Mobile',
      'm/download/thanks': 'thanksMobileDownload',
      'm/confirmation/:token': 'confirmationVideoMobile',
      'm/how-to-participate': 'howMobile',
      'm/signup/:tag/config-video/intro': 'configVideoIntroMobile',
      'm/signup/:tag/config-video/title': 'configVideoTitleMobile',
      'm/signup/:tag/config-video/filter': 'configVideoFilterMobile',
      'm/signup/:tag/config-video/done': 'configVideoDoneMobile',
      'm/signup/:tag/config-video/done/:token': 'configVideoDoneFromMailMobile',
      'm/signup/:tag/public-video/:videoToken': 'sharedPublicVideoLandingMobile',
      'es': 'initES',
      'en': 'initEN',
      'pt': 'initPT'

    },

    //videoConfirmationView

    initialize: function () {

      this.watchInactivity();
      this.user = User;

      //adding analitycs tracking.
      this.bind('route', this.pageView);

      //Setting localStore Variables:
      localStorage.setItem('timeLine::firstTimeShowed', true);
      localStorage.setItem('mainVideo::currentPercent', 0);

      this.isIE11();

    },

    /**
     * inicializa en Castellano
     */
    initES: function () {
      this.locale = localStorage.setItem('locale', 'es');
      this.navigate('/', {trigger: true});
    },
    /**
     * inicializa en Inglés
     */
    initEN: function () {
      this.locale = localStorage.setItem('locale', 'en');
      this.navigate('/', {trigger: true});
    },
    /**
     * inicializa en Portugués
     */
    initPT: function () {
      this.locale = localStorage.setItem('locale', 'pt');
      this.navigate('/', {trigger: true});
    },

    /**
     * Set ie class in header if the browser is IE11
     */
    isIE11: function () {
      ////console.log("Asking for IE11");
      if (!!navigator.userAgent.match(/Trident.*rv[ :]*11\./)) {
        $('body').addClass('ie');
        ////console.log("IS IE 11");
      }
    },

    /**
     * Track the inner navigation to Analitycs.
     */
    pageView: function () {

      var url = Backbone.history.getFragment();

      if (!/^\//.test(url) && url != "") {
        url = "/212/vipclubedition/#" + url;
      }

      if (!_.isUndefined(dataLayer)) {
        //console.log("URL: "+url);
        dataLayer.push({
          'event': 'virtualPageview',
          'page': url
        });
      }
    },

    /**
     * Crea una vista de forma limpia.
     * Elimna la anterior
     * @param handler
     * @param view
     * @returns {view}
     */
    cleanCreate: function (handler, view, options) {
      if (handler) {
        handler.close();
      }
      if (!options) {
        options = {};
      }
      handler = new view(options);
      return handler;
    },
    /**
     * Home
     */
    index: function () {
      var scope = this;
      this.loadLocale(function () {
        scope.initTemplate(new IndexView(), false, false, 'Home');
      });

    },

    /**
     * Home Mobile
     */
    homeMobile: function () {
      var scope = this;
      this.loadLocale(function () {
        scope.initTemplateMobile(scope.cleanCreate(scope.mainContent, MobileIndexView), 'MobileHome');
      });

    },
    /**
     * Timeline
     */
    timeline: function () {
      var scope = this;
      this.loadLocale(function () {
        if (scope.HotSpotsCollection) {
          scope.initTemplate(new TimelineView(), true, false, 'Timeline');
          scope.backgroundVideo.setVideoUrl('data/CH_video', ['mp4', 'webm', 'ogv']);
        } else {
          scope.HotSpotsCollection = HotSpotsCollection;
          scope.HotSpotsCollection.fetch({
            success: function () {
              scope.initTemplate(new TimelineView(), true, false, 'Timeline');
              scope.backgroundVideo.setVideoUrl('data/CH_video', ['mp4', 'webm', 'ogv']);
            },
            error: function () {
              ////console.log('Error loading Hotspots.');
            }
          });
        }
      });
    },
    /**
     * Timeline
     */
    howtoparticipate: function () {
      this.showPopups = true;
      this.timeline();
    },
    /**
     * TimelineVideo
     */
    timelineVideo: function () {
      var scope = this;
      this.loadLocale(function () {
        scope.initTemplate(new TimelineVideoView(), true, true, 'TimelineVideo');
      });
    },
    /**
     * Ecualizador
     */
    ecualizador: function () {
      var scope = this;
      this.loadLocale(function () {
        scope.initTemplate(new EcualizadorView(), true, true, 'Ecualizador');
        scope.backgroundVideo.setVideoUrl('data/CH_video', ['mp4', 'webm', 'ogv']);
      });
    },
    /**
     * Participate
     * @param {string} tag - Register form TAG page. EX: dance, kiss...
     */
    participate: function (tag) {
      this.tag = tag;
      var scope = this;
      this.loadLocale(function () {
        if (scope.FormTagCollection) {
          scope.initTemplate(new ParticipateView(tag), true, true, 'Participate');
        } else {
          scope.FormTagCollection = FormTagCollection;
          scope.FormTagCollection.fetch({
            success: function (collection, response) {
              scope.initTemplate(new ParticipateView(tag), true, true, false, 'Participate');
              /* img background delegate into view controller */
            }
          });
        }
      });
    },
    /**
     * Signup
     */
    signup: function (tag) {
      this.tag = tag;
      var scope = this;
      this.loadLocale(function () {
        if (scope.FormTagCollection) {
          /**
           * aplica SignupView2 para registro con "Eancode"
           */
          if (tag == 'vip') {
            /**
             * carga el listado de eancodes válidos antes de entrar en la vista
             */
            scope.loadEancodes(function () {
              scope.initTemplate(new SignupView2(tag), true, true, 'Signup2');
            });

          } else {
            if (!scope.user.isAuthenticated()) {

              scope.initTemplate(new SignupView(tag), true, true, 'Signup');

              if (tag === "download") {
                scope.backgroundImg.setImgUrl('images/desktop/bg-descarga-audio.jpg');
              }

            } else { // Si el usuario ya está logveado que vaya directo a Upload.

              scope.navigate('participate/' + tag + '/upload', {trigger: true});
            }
          }
        } else {
          scope.FormTagCollection = FormTagCollection;
          scope.FormTagCollection.fetch({
            success: function (collection, response) {
              if (tag == 'vip') {
                /**
                 * carga el listado de eancodes válidos antes de entrar en la vista
                 */
                scope.loadEancodes(function () {
                  scope.initTemplate(new SignupView2(tag), true, true, 'Signup2');
                });
              } else {

                if (!scope.user.isAuthenticated()) {

                  scope.initTemplate(new SignupView(tag), true, true, 'Signup');
                  if (tag === "download") {
                    scope.backgroundImg.setImgUrl('images/desktop/bg-descarga-audio.jpg');
                  }

                } else { // Si el usuario ya está logveado que vaya directo a Upload.
                  /**
                   * controla si se ha registrado desde la página de 1000 descargas. En tal caso no hay upload de video
                   */
                  if (tag != 'download') {
                    return scope.navigate('participate/' + tag + '/upload', {trigger: true});
                  } else {
                    return scope.navigate('participate/download/thanks', {trigger: true});
                  }
                }
              }
            }
          });
        }
      });
    },
    /**
     * Signup Mobile
     */
    signupMobile: function () {
      var scope = this;
      this.loadLocale(function () { //new TimelineVideoView()
        scope.initTemplateMobile(new MobileSignupView(), 'MobileSignup');
      });
    },
    /**
     * Signup2 Mobile EAN Code
     */
    signup2Mobile: function () {
      this.tag = 'vip';
      var scope = this;
      this.loadLocale(function () {
        scope.loadEancodes(function () {
          scope.initTemplateMobile(new MobileSignup2View(scope.tag), 'MobileSignup2');
        });
      });
    },
    /**
     * Signup2 Mobile Download Audio Code
     */
    signupDownload: function () {
      if (!this.user.isAuthenticated()) {
        this.tag = 'download';
        var scope = this;
        this.loadLocale(function () {
          scope.loadEancodes(function () {
            scope.initTemplateMobile(new MobileSignup2View(scope.tag), 'MobileSignupDownload');
          });
        });
      } else {
        this.navigate('m/download/thanks', {trigger: true});
      }
    },
    /**
     * Video
     */
    video: function (tag) {
      this.tag = tag;
      var scope = this;
      this.loadLocale(function () {
        scope.FormTagCollection = FormTagCollection;
        scope.FormTagCollection.fetch({
          success: function (collection, response) {
            scope.initTemplate(new VideoView(tag), true, true, 'Video');
            /* img background delegate into view controller */
          }
        });
      });
    },

    /**
     * behindScenes
     */
    behindScenes: function () {
      this.tag = 'behindScenes';
      var scope = this;
      this.loadLocale(function () {
        scope.FormTagCollection = FormTagCollection;
        scope.FormTagCollection.fetch({
          success: function (collection, response) {
            scope.initTemplate(new VideoView(scope.tag, false), true, true, 'Video');
          }
        });
      });
    },
    /**
     * askingAlesso
     */
    collaboration: function () {
      this.tag = 'collaboration';
      var scope = this;
      this.loadLocale(function () {
        scope.FormTagCollection = FormTagCollection;
        scope.FormTagCollection.fetch({
          success: function (collection, response) {
            scope.initTemplate(new VideoView(scope.tag, false), true, true, 'Video');
          }
        });
      });
    },
    /**
     * makingOff
     */
    makingOff: function () {
      this.tag = 'makingOff';
      var scope = this;
      this.loadLocale(function () {
        scope.FormTagCollection = FormTagCollection;
        scope.FormTagCollection.fetch({
          success: function (collection, response) {
            scope.initTemplate(new VideoView(scope.tag, false), true, true, 'Video');
          }
        });
      });
    },
    /**
     * liveShow
     */
    liveShow: function () {
      this.tag = 'liveShow';
      var scope = this;
      this.loadLocale(function () {
        scope.FormTagCollection = FormTagCollection;
        scope.FormTagCollection.fetch({
          success: function (collection, response) {
            scope.initTemplate(new VideoView(scope.tag, false), true, true, 'Video');
          }
        });
      });
    },
    /**
     * Project
     */
    project: function () {
      this.tag = 'Project';
      var scope = this;
      this.loadLocale(function () {
        scope.initTemplate(new Project(), false, false, 'Project');
      });
    },
    /**
     * Upload Video
     */
    upload: function (tag) {
      this.tag = tag;

      if (this.user.isAuthenticated()) {
        var scope = this;
        this.loadLocale(function () {
          /**
           * controla si se ha registrado desde la página de 1000 descargas. En tal caso no hay upload de video
           */
          if (tag != 'download') {

            scope.initTemplate(new UploadVideoView(tag), false, true, 'Upload Video');
            /*this.backgroundType = 'img';
             this.backgroundImg.setImgUrl('images/dummy2_background.jpg');*/

          } else {
            return scope.navigate('participate/download/thanks', {trigger: true});
          }
        });
      } else {
        return this.navigate('participate/' + tag + '/signup', {trigger: true});
      }
    },
    /**
     * Upload Mobile
     */
    uploadMobile: function (tag) {

      this.loadMobileView(MobileUploadVideoView, 'MobileUpload', tag);

    },
    /**
     * Thanks Upload Video
     */
    thanks: function (tag) {
      this.tag = tag;
      if (this.user.isAuthenticated()) {
        var scope = this;
        this.loadLocale(function () {
          scope.initTemplate(new ThanksView(tag), false, true, 'Upload Video');
          if (tag === "download") {
            scope.backgroundImg.setImgUrl('images/desktop/bg-descarga-audio.jpg');
          } else {
            scope.backgroundImg.setImgUrl('images/desktop/thanks-for-confirming.jpg');
          }
        });
      } else {

        this.navigate('participate/' + tag + '/signup', {trigger: true});
      }

    },
    /**
     * Thanks Upload Video
     */
    configVideoTitle: function (tag) {
      this.tag = tag;
      if (this.user.isAuthenticated()) {
        var scope = this;
        this.loadLocale(function () {
          scope.initTemplate(new VideoCartela(tag), false, true, 'VideoCartela');
          scope.backgroundImg.setImgUrl('images/desktop/bg-reward.jpg');
        });
      } else {

        this.navigate('participate/' + tag + '/signup', {trigger: true});
      }

    },

    /**
     * Config Video title (Mobile)
     */
    configVideoIntroMobile: function (tag) {

      this.loadMobileView(VideoIntro, 'VideoIntro', tag);

    },
    /**
     * Config Video title (Mobile)
     */
    configVideoTitleMobile: function (tag) {

      this.loadMobileView(VideoCartela, 'VideoCartela', tag);

    },

    /**
     * Config Video Filter (Mobile)
     */
    configVideoFilterMobile: function (tag) {

      this.loadMobileView(VideoConfigurationFilter, 'VideoFilter', tag);

    },

    /**
     * Config Video Filter (Mobile)
     */
    configVideoDoneMobile: function (tag) {

      this.loadMobileView(VideoConfigurationResult, 'VideoDone', tag);

    },

    /**
     * Config Video Filter (Mobile)
     */
    sharedPublicVideoLandingMobile: function (tag, token) {

      this.tag = tag;

      var scope = this;
      this.loadLocale(function () {
        if (scope.FormTagCollection) {
          scope.initTemplateMobile(new VideoPublic(tag, token), 'VideoPublic');
        } else {
          scope.FormTagCollection = FormTagCollection;
          scope.FormTagCollection.fetch({
            success: function (collection, response) {
              scope.initTemplateMobile(new VideoPublic(tag, token), 'VideoPublic');
            }
          });
        }
      });

    },
    /**
     * Thanks Upload Video
     */
    configVideoFilter: function (tag) {
      this.tag = tag;
      if (this.user.isAuthenticated()) {
        var scope = this;
        this.loadLocale(function () {
          scope.initTemplate(new VideoConfigurationFilter(tag), false, true, 'VideoFilter');
          scope.backgroundImg.setImgUrl('images/desktop/bg-reward.jpg');
        });
      } else {

        this.navigate('participate/' + tag + '/signup', {trigger: true});
      }

    },
    /**
     * Thanks Upload Video
     */
    configVideoDone: function (tag) {
      this.tag = tag;
      if (this.user.isAuthenticated()) {
        var scope = this;
        this.loadLocale(function () {
          scope.initTemplate(new VideoConfigurationResult(tag), false, true, 'VideoDone');
          scope.backgroundImg.setImgUrl('images/desktop/bg-reward.jpg');
        });
      } else {

        this.navigate('participate/' + tag + '/signup', {trigger: true});
      }

    },
    /**
     * Rendered video from Email
     */
    configVideoDoneFromMail: function (tag, token) {
      if (this.mobile !== true) {
        this.tag = tag;
        window.app.user.set('confirm_token', token);
        var scope = this;
        this.loadLocale(function () {
          scope.initTemplate(new VideoConfigurationResult(tag, true), false, true, 'VideoDoneFromEmail', true);
          scope.backgroundImg.setImgUrl('images/desktop/bg-reward.jpg');
        });
      } else {
        this.navigate('m/signup/' + tag + '/config-video/done/' + token, {trigger: true});
      }
    },

    /**
     * Thanks Upload Video
     */
    configVideoDoneFromMailMobile: function (tag, token) {

      this.tag = tag;
      window.app.user.set('confirm_token', token);
      var scope = this;

      this.loadLocale(function () {
        if (scope.FormTagCollection) {
          scope.initTemplateMobile(new VideoConfigurationResult(tag, true), 'VideoDoneFromEmail');
        } else {
          scope.FormTagCollection = FormTagCollection;
          scope.FormTagCollection.fetch({
            success: function (collection, response) {
              scope.initTemplateMobile(new VideoConfigurationResult(tag, true), 'VideoDoneFromEmail');
            }
          });
        }
      });
    },
    /**
     * Public Video Landing Upload Video
     */
    sharedPublicVideoLanding: function (tag, token) {

      if (this.mobile !== true) {
        this.tag = tag;
        var scope = this;
        this.loadLocale(function () {
          scope.initTemplate(new VideoPublic(tag, token), false, true, 'VideoPublic', true);
          scope.backgroundImg.setImgUrl('images/desktop/bg-reward.jpg');
        });

      } else {
        console.log('IS mobile');
        this.navigate('m/signup/' + tag + '/public-video/' + token, {trigger: true});
      }

    },
    /**
     * thanks Mobile
     */
    thanksMobile: function (tag) {
      this.tag = tag;
      var scope = this;
      this.loadLocale(function () {
        scope.initTemplateMobile(scope.cleanCreate(scope.mainContent, MobileThanksView), 'MobileThanks');
      });
    },
    /**
     * thanks 2 Mobile
     */
    thanks2Mobile: function () {
      var scope = this;
      this.loadLocale(function () {
        scope.initTemplateMobile(new MobileThanks2View(scope.tag), 'MobileThanks2');
      });
    },
    /**
     * thanks Download Mobile
     */
    thanksMobileDownload: function () {
      if (this.user.isAuthenticated()) {
        this.tag = 'download';
        var scope = this;
        this.loadLocale(function () {
          scope.initTemplateMobile(new MobileThanks2View(scope.tag), 'MobileDownload');
        });
      } else {
        this.navigate('m/download', {trigger: true});
      }
    },
    /**
     * Thanks Confirmation Video.
     * @param token
     */
    confirmationVideo: function (token) {
      var scope = this;
      this.loadLocale(function () {
        scope.initTemplate(new VideoConfirmationView(token), false, true, 'VideoConfirmation');
        scope.backgroundImg.setImgUrl('images/desktop/thanks-for-confirming.jpg');
      });
    },
    /**
     * Unsuscribe User
     * @param token
     */
    unsuscribeUser: function (token) {
      var scope = this;
      this.loadLocale(function () {
        scope.initTemplate(new UnsuscribeView(token), false, true, 'unsuscribe');
      });
    },

    /**
     * Thanks Confirmation Video Mobile
     */
    confirmationVideoMobile: function () {
      var scope = this;
      this.loadLocale(function () {
        scope.initTemplateMobile(scope.cleanCreate(scope.mainContent, MobileVideoConfirmationView), 'MobileVideoConfirmation');
      });
    },

    /**
     * How To Participate Mobile
     */
    howMobile: function () {
      var scope = this;
      this.loadLocale(function () {
        scope.initTemplateMobile(scope.cleanCreate(scope.mainContent, MobileHowView), 'MobileHow');
      });
    },

    /**
     * Gallery
     */
    gallery: function (point) {
      if (currentView) {
        currentView.close();
      }
      currentView = new GalleryView();
      this.loadLocale(function () {
        currentView.paintView('#wrapper');
      });

    },
    /**
     *
     * @param {class} template - The vierw's class
     * @param {boolean} isVideo - If the view have video backgraound
     * @param {boolean} hasNav - If the view have nav back button
     * @param {string} name - The name of the view. Only for reference
     * @param {boolean} withOutFooter - Pantallas que no tienen footer.
     */
    initTemplate: function (template, isVideo, hasNav, name, withOutFooter) {

      this.currentViewName = name; //default setting name

      console.log('Router: WithOutFooter: ' + withOutFooter);

      /**
       * Controla si se entra en un Routing de desktop desde un movil
       * se reenvía a la home mobile
       */
      if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        window.app.mobile = true;
        return this.navigate('m/', {trigger: true});
      }

      if (this.backgroundImg) {
        this.backgroundImg.hide();
      }

      if (isVideo) {
        this.backgroundType = 'video';
      } else {
        this.backgroundType = 'img';
      }

      /**
       * Se obliga a hacer el render del header siempre para que siempre cargue el btn que le toca.
       */
      if (this.HeaderView) {
        this.HeaderView.close();
      }
      this.HeaderView = new HeaderView();

      if (currentView && this.currentViewName && this.lastViewName !== 'Gallery') { //&& this.lastViewName !== 'Home'
        if (this.mainContent) {
          this.mainContent.close();
          this.mainContent = template;
          currentView.assign('#content', template);
          currentView.assign('header', this.HeaderView);

          if ((['VideoCartela', 'VideoFilter', 'VideoDone', 'VideoPublic'].indexOf(this.currentViewName) !== -1) || withOutFooter === true) {
            if (this.FooterView) {
              this.FooterView.close();
            }
          } else if (this.lastViewName === 'ConfigView') {
            if (this.FooterView) {
              this.FooterView.close();
            }
            this.FooterView = new FooterView();
            currentView.assign('footer', this.FooterView);
          }

        }
      } else {

        if (this.lastViewName === 'Gallery') {
          this.lastViewName = undefined;
        }

        ////console.log('Se repinta crea una vista default nueva.');
        if (this.backgroundImg) {
          this.backgroundImg.close();
        }
        this.backgroundImg = new BackgroundImgView();
        this.backgroundImg.setImgUrl('images/desktop/alesso-intro.jpg');
        this.backgroundImg.hide();

        if (this.backgroundVideo) {
          this.backgroundVideo.close();
        }
        this.backgroundVideo = new BackgroundVideoView();
        this.backgroundVideo.setVideoUrl('data/CH_video', ['mp4', 'webm', 'ogv']);
        this.backgroundVideo.hide();

        if (this.mainContent) {
          this.mainContent.close();
        }
        this.mainContent = template;

        if (this.FooterView) {
          this.FooterView.close();
        }

        var view;

        if ((['VideoCartela', 'VideoFilter', 'VideoDone', 'VideoPublic'].indexOf(this.currentViewName) === -1) && withOutFooter !== true) {

          this.FooterView = new FooterView();

          view = new DefaultView({
            subviews: {
              '#content': template,
              '#backgroundImg': this.backgroundImg,
              '#backgroundVideo': this.backgroundVideo,
              'header': this.HeaderView,
              'footer': this.FooterView
            }
          });

        } else {
          view = new DefaultView({
            subviews: {
              '#content': template,
              '#backgroundImg': this.backgroundImg,
              '#backgroundVideo': this.backgroundVideo,
              'header': this.HeaderView
            }
          });
        }

        render(view);
      }

      if (this.backgroundType == 'video') {
        if (this.backgroundImg) {
          this.backgroundImg.hide();
        }
        if (this.backgroundVideo) {
          this.backgroundVideo.show();
        }
      } else {
        if (this.backgroundImg) {
          this.backgroundImg.show();
        }
        if (this.backgroundVideo) {
          this.backgroundVideo.hide();
        }
      }

    },

    initTemplateMobile: function (template, name) {

      ////console.log('Render Mobile ' + name);

      window.app.mobile = true;

      if (this.HeaderView) {
        this.HeaderView.close();
      }
      this.HeaderView = new MobileHeaderView(name);

      if (this.mainContent) {
        this.mainContent.close();
      }

      this.mainContent = template;

      if (currentView && this.currentViewName) {
        ////console.log('Se repinta una seccion de un default ya creado');
        currentView.assign('header', this.HeaderView);
        currentView.assign('#content', this.mainContent);
      } else {
        ////console.log('Se repinta crea una vista default nueva.');
        if (this.FooterView) {
          this.FooterView.close();
        }
        this.FooterView = new MobileFooterView();

        var view = new MobileView({
          subviews: {
            '#content': this.mainContent,
            'header': this.HeaderView,
            'footer': this.FooterView
          }
        });

        render(view);
      }

    },

    /**
     * Carga el fichero json de idioma
     *
     * @param {function} callback - Ejecuta al cargar el locale
     */
    loadLocale: function (callback) {

      this.locale = localStorage.getItem('locale') || 'es';

      if (this.LocaleCollection) {
        callback();
      } else {
        var scope = this;
        this.LocaleCollection = LocaleCollection;
        this.LocaleCollection.fetch({
          success: function (locale, response) {
            ////console.log('Se cargan los locale');
            callback();
          },
          error: function () {
            ////console.log('Error loading locale.');
          }
        });
      }
    },

    /**
     * Carga el fichero json de eacodes
     *
     * @param {function} callback - Ejecuta al cargar el json
     */
    loadEancodes: function (callback) {

      if (this.EancodesCollection) {
        callback();
      } else {
        var scope = this;
        this.EancodesCollection = EancodesCollection;
        this.EancodesCollection.fetch({
          success: function (locale, response) {
            ////console.log('Se cargan los eancodes');
            callback();
          },
          error: function () {
            ////console.log('Error loading locale.');
          }
        });
      }
    },

    // Runs before every route loads
    execute: function (callback, args) {
      // Clear out any global messages

      if (callback) {
        callback.apply(this, args);
      }
    },

    /**
     * Sistema de captura de la posición del mouse para controla la inactividad del usuario
     */
    watchInactivity: function (tiempo) {

      ////console.log('watchInactivity init');

      document.onmousemove = function (e) {
        window.app.resetInactivity();
      };

      var scope = this;
      /**
       * se realiza la comprobación cada cierto tiempo "timerIntervalInactivity"
       * @type {*|number}
       */
      this.timerCheckInactivity = setInterval(function (e) {
        scope.checkInactivity(e);
      }, scope.timerIntervalInactivity);

    },
    checkInactivity: function (e) {
      /**
       * numero de veces que se ha realizado la comprobación
       * @type {number}
       */
      this.inactiveTime = this.inactiveTime + 1;
      ////console.log('watchInactivity ' + this.inactiveTime);
      /**
       * se comprueba si se supera la frecuencia maxima permitida de inactividad "timerIntervalInactivityMax"
       */
      if (this.inactiveTime >= this.timerIntervalInactivityMax) {
        /**
         * inactividad solo en pagina de timeline, ecualizador y video
         */
        if (this.currentViewName == 'Timeline' || this.currentViewName == 'Ecualizador' || this.currentViewName == 'Video') {
          /**
           *  lanza un evento que es escuchado por las vista "baseVideo"
           */
          window.Events.trigger('watcher::inactive');
        }

        this.inactiveTime = 0;

      }
    },
    resetInactivity: function (e) {
      this.inactiveTime = 0;
      window.Events.trigger('watcher::active');
    },

    /**
     * Carga una vista de mobile, primero carga todas las dependencias de tags.
     * @param view
     * @param tag
     */
    loadMobileView: function (view, viewName, tag) {

      this.tag = tag;
      if (this.user.isAuthenticated()) {
        var scope = this;
        this.loadLocale(function () {
          if (scope.FormTagCollection) {
            scope.initTemplateMobile(new view(tag), viewName);
          } else {
            scope.FormTagCollection = FormTagCollection;
            scope.FormTagCollection.fetch({
              success: function (collection, response) {
                scope.initTemplateMobile(new view(tag), viewName);
              }
            });
          }
        });
      } else {
        this.navigate('m/signup', {trigger: true});
      }
    }

  });

  return new Router();
});
