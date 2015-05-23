define(['views/baseView'], function (BaseView) {

  'use strict';

  var SocialButtons = BaseView.extend({

    template: JST['client/templates/modules/socials.jst'],
    templateSmall: JST['client/templates/modules/socialSmall.jst'],

    events: {
      'click .share-facebook': 'shareFacebook',
      'click .share-twitter': 'shareTwitter',
      'click .share-pinterest': 'sharePinteres',
      'click .share-instagram': 'shareInstagram',
      'click .share-gplus': 'shareGooglePlus'
    },

    className: 'wrapper-social',

    defaultImgToShare: 'thanks-for-confirming-social.jpg',
    defaultUrlToShare: '/#timeline',

    hashTag: '#ALESSOFOR212VIP',

    initialize: function (options) {
      if (options) {
        this.options = options;
      }

    },
    /**
     * Pinta la vista en el objeto en el contenedor seleccionado.
     * @param elementContainer
     */
    paintView: function (elementContainer) {
      $(elementContainer).html(this.render().$el);
      this.afterRender();
    },

    afterRender: function () {

    },

    render: function () {

      if(this.options.small){
        this.$el.html(this.templateSmall());
      }
      else{
        this.$el.html(this.template());
      }
      return this;
    },

    /**
     * Comparte la pantalla en facebooks.
     */
    shareFacebook: function () {

      this.trackEvent({
        'event': 'social',
        'socialNetwork': 'facebook',
        'socialAction': 'share'
      });

      FB.ui({
        method: 'feed',
        link: this.options.url,
        caption: this.options.msg,
        picture: this.getImgToShare()
      }, function (response) {});

    },

    /**
     * Share
     * @returns {boolean}
     */
    shareTwitter: function () {


      //console.log("xxxxxx");


      this.trackEvent({
        'event': 'social',
        'socialNetwork': 'twitter',
        'socialAction': 'tweet'
      });

     // var url = encodeURIComponent(this.options.url);
      var msg = encodeURIComponent(this.options.msg + " " + this.options.url);


      //console.log(this.options.url);

      var link = 'http://twitter.com/intent/tweet?text=' + msg;

      var newwindow = window.open(link, 'name', 'height=300,width=500');
      if (window.focus) {newwindow.focus()}
      return false;
    },
    /**
     * Share in Pinterest
     * @returns {boolean}
     */
    sharePinteres: function () {

      this.trackEvent({
        'event': 'social',
        'socialNetwork': 'pinterest',
        'socialAction': 'pin'
      });

      var link = 'https://www.pinterest.com/pin/create/extension/?description=' + this.options.msg + '&url=' + this.options.url + '&media=' + this.getImgToShare() + '&xv=cr1.36&xm=g';

      var newWindow = window.open(link, 'name', 'height=600,width=800');
      if (window.focus) {newWindow.focus()}

      return false;
    },

    /**
     * Share in Pinterest
     * @returns {boolean}
     */
    shareGooglePlus: function () {

      this.trackEvent({
        'event': 'social',
        'socialNetwork': 'google+',
        'socialAction': '+1'
      });

      var link = 'https://plus.google.com/share?url=' + this.options.url;

      var newWindow = window.open(link, 'name', 'menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=600,width=600');
      if (window.focus) {newWindow.focus()}

      return false;
    },

    /**
     * Handle to Share Pinteres
     * [Just for tracking event now.]
     */
    shareInstagram: function () {

      this.trackEvent({
        'event': 'social',
        'socialNetwork': 'instagram',
        'socialAction': 'pin'
      });
    },

    /**
     * Devuelve la image a compartir.
     * @returns {img|*}
     */
    getImgToShare: function () {

      var img = this.options.img ? this.options.img : this.defaultImgToShare;
      return _APP_BASE_PATH + '/images/desktop/' + img;

    }

  });

  return SocialButtons;

});
