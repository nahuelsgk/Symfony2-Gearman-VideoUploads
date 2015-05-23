define(function (require) {
  'use strict';

  var VideoConfigurationBase = require('views/video_config/videoConfigurationBase');

  var VideoConfigurationFilter = VideoConfigurationBase.extend({

    events: {
      'click .img-tumbler': 'selectEffect',
      'click .step': 'goToStep'
    },

    template: JST['client/templates/video_config/videoConfigurationFilter.jst'],
    templateMobile: JST['client/templates/mobile/video_config/videoConfigurationFilterMobile.jst'],

    render: function () {

      var scope = this;

      var templateOptions = {
        title: window.app.LocaleCollection.get(1).get("video_config")[0].string,
        t1: window.app.LocaleCollection.get(1).get("video_config")[2].string,
        intro: window.app.LocaleCollection.get(1).get("video_config")[3].string,
        filters: window.app.LocaleCollection.get(1).get("video_config")[4].string,
        next: window.app.LocaleCollection.get(1).get("video_config")[5].string,
        sizmekCode: this.trackingSizmek(23525) // todo buscar codigo realen el excel
      };

      var html = window.app.mobile ? this.templateMobile(templateOptions) : this.template(templateOptions);

      this.$el.html(html);

      this.waiting = setInterval(function () {
        window.app.user.logAction('VideoSelectFilter::getPreviewForVideo', window.app.currentViewName);
        window.app.user.getPreviewForVideo(function (images) {
          console.log('Se cargan las imagenes de preview. ya se pueden mostrar');
          scope.addImagesPreview(images);
          clearInterval(scope.waiting);
        }, function () {
          console.log('No está listo el preview- Se mantiene el loading');
        });

      }, 3000);

      return this;
    },
    /**
     * Selecciona la cartela del video. [Title del video]
     * @param e
     */
    selectEffect: function (e) {
      var selectedFilter = this.chagenSelectedEffect(e);
      window.app.configVideoOptions.set('filter', selectedFilter);
      var imgPreview = this.$el.find('.img-preview.' + selectedFilter);
      window.app.configVideoOptions.set('filterImgPreview', imgPreview.attr('src'));
      window.app.user.logAction('VideoSelectFilter::selectEffect', window.app.currentViewName);

    },
    /**
     * Añade las imagenes preview al DOM.
     */
    addImagesPreview: function (images) {

      var html = '<img src="' + images.italiano + '" alt="" class="img-preview italiano"/>' + '<img src="' + images.light_leaks + '" alt="" class="img-preview lightleak hidden"/>' + '<img src="' + images.grid + '" alt="" class="img-preview grid hidden"/>';

      this.$el.find('.wrapper-video-preview').html(html);

    },

    onClose: function () {
      VideoConfigurationFilter.__super__.onClose.apply(this, arguments);
      clearInterval(this.waiting);
    }

  });

  return VideoConfigurationFilter;
});
