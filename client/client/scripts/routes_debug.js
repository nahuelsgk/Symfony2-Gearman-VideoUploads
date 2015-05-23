define(function (require) {
  'use strict';

  //Views.

  var GalleryView = require('./views/layouts/gallery');
  var LocaleCollection = require('./collections/locale');



  //Vars
  var locale, backgroundImg, backgroundVideo, backgroundType, mainContent, header, footer, tag;



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
    timerIntervalInactivity: 5000,
    timerIntervalInactivityMax: 3,
    timerIntervalActivity: 1000,
    currentViewName: '',

    routes: {
      'gallery': 'gallery',
      '': 'gallery'
    },




    /**
     * Gallery
     */
    gallery: function () {
      if (currentView) {
        currentView.close();
      }
      currentView = new GalleryView();
      this.loadLocale(function () {
        currentView.paintView('#wrapper');
      });

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
            //console.log('Se cargan los locale');
            callback();
          },
          error: function () {
            //console.log('Error loading locale.');
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
    }


  });

  return new Router();
});
