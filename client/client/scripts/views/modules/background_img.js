define(['views/baseView'], function (BaseView) {
  'use strict';

  var BackgroundImageView = BaseView.extend({

    template: JST['client/templates/modules/background_img.jst'],

    events: {
      'click #logoutLink': 'handleLogout'
    },

    imgUrl: 'images/dummy2_background.jpg',

    isVisible: true,

    initialize: function () {},

    show: function () {
      this.$el.show();
      this.isVisible = true;
    },
    hide: function () {
      this.$el.hide();
      this.isVisible = false;
    },

    onClose: function () {
      //unbinding events.
      this.stopListening();
    },

    render: function () {
      this.setImgUrl(this.imgUrl, true);

      if (window.app.backgroundType != 'img') {
        this.hide();
      }
      return this;
    },

    /**
     * Set the imgUrl for background.
     * and render de view
     * @param {string} imgUrl - Path of the img
     * @param {boolean} force - (Optional) Force render the view, for imgUrl with the same path. Defaul: false
     */
    setImgUrl: function (imgUrl, force) {
      if (this.imgUrl != imgUrl || force) {
        ////console.log('Se pinta background Imagen ');

        this.imgUrl = imgUrl;

        this.$el.html(this.template({
          imgUrl: this.imgUrl
        }));
      }
    }
  });

  return BackgroundImageView;

});
