define(function (require) {
  'use strict';


  var BaseView = require('views/baseView');
  var HeaderView = require('views/modules/header');
  var FooterView = require('views/modules/footer');


  var Gallery = BaseView.extend({

    id:'wrapper-inner',

    wrapperGallery:'#gallery212',
    colNum:6,

    template: JST['client/templates/layouts/gallery.jst'],

    events: {
      'click .slide-link':'trackGalleyInteraction'
    },

    initialize: function (options) {
      if (options) {
        this.options = options;
      }

      var scope = this;

      $(window).on('keydown', function(e) {
        if(e.keyCode==38 || e.keyCode==40 || e.keyCode==37 || e.keyCode==39 ) {

          scope.kewDown();

        }
      });

      /*this.header =  window.app.HeaderView;
      this.footer = window.app.FooterView;*/
    },
    /**
     * Carga las images a mostrar en la gallery.
     * @param _callback
     */
    loadImageGallery:function(_callback){

      this.gallery = new Backbone.Collection();
      this.gallery.url='data/galleryImages.json';

      this.gallery.fetch(
        {
          success:function(){
            _callback();
          },
          error:function(){
            ////console.log('Error loading the gallery');
          }
        }
      );
    },

    render: function () {

      window.app.currentViewName = 'Gallery';

      this.header = new HeaderView();
      this.footer = new FooterView();

      this.$el.html(this.template({
         colNum: this.colNum,
         gallery:this.gallery.toJSON(),
         tip: window.app.LocaleCollection.get(1).get("gallery")[0].string
      }));

      window.app.lastViewName = window.app.currentViewName;

      return this;

    },
    /**
     * Dom ready function
     */
    afterRender:function(){

      //Setting the gallery
      $(this.wrapperGallery).gallery();

      //Setting header and footer.
      $('header').html(this.header.render().$el);
      this.footer.render(function(rederedFooterView){
        $('footer').html(rederedFooterView.$el);
      });


      $('body').css('overflow','hidden');

    },
    /**
     * Pinta la vista en el elemento Seleccionado.
     * @param elementContent
     */
    paintView:function(elementContent){

      var socpe = this;

      this.loadImageGallery(function(){
        $(elementContent).html(socpe.render().$el);
        socpe.afterRender();
      });
    },

    onClose:function(){
      $(window).off('keydown');
      $('body').css('overflow','inherit');
      window.app.lastViewName = 'Gallery';
    },
    /**
     * tracking events.
     */
    trackGalleyInteraction:function(event){

      var fotoId = $(event.currentTarget).attr('id');

      this.trackEvent({
        'event':  'gaEvent',
        'eventCategory': 'gallery',
        'eventAction': 'change picture',
        'eventLabel': fotoId
      });

    },

    kewDown:function(){

      var fotoId = $('.slide-link.active').attr('id');
      this.trackEvent({
        'event':  'gaEvent',
        'eventCategory': 'gallery',
        'eventAction': 'change picture',
        'eventLabel': fotoId
      });
    }


  });

  return Gallery;

});

