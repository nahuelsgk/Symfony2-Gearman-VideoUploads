'use strict';

// RequireJS configuration
require.config({
  paths: {}
});

define('init', function (require) {

  window.app = require('./routes');

  // Use GET and POST to support all browsers
  // Also adds '_method' parameter with correct HTTP headers
  Backbone.emulateHTTP = false;

  // Overwrite remove it just empties $el instead of removing it
  // ref: http://stackoverflow.com/questions/14083724/backbone-remove-view-deletes-the-el#answer-19003561
  Backbone.View.prototype.remove = function () {
    this.$el.empty().off(); /* off to unbind the events */
    this.stopListening();
    return this;
  };

  // Create cleanup logic for Backbone views
  Backbone.View.prototype.close = function () {
    this.remove();
    this.unbind();
    // Allows user to create OnClose callback within view
    // Should be used to cleanup bind', and 'on' events
    if (this.onClose) {
      this.onClose();
    }
  };

  // Create subview logic for Backbone views
  // Allows the ability to attach views as subviews
  Backbone.View.prototype.assign = function (selector, view) {
    var selectors;
    if (_.isObject(selector)) {
      selectors = selector;
    } else {
      selectors = {};
      selectors[selector] = view;
    }
    if (!selectors) {return;}
    _.each(selectors, function (view, selector) {

      if (!this.childViews) {
        this.childViews = {};
      }
      /*if (this.childViews[selector]) {
       this.childViews[selector].close();      }*/

      view.setElement(this.$(selector)).render();  //todo: close en subview

      this.childViews[selector] = view;

    }, this);
  };

  // Send authorization header on each AJAX request
  /*
   $(document).ajaxSend(function(event, request) {
   var token = user.getToken();
   if (token) {
   request.setRequestHeader('authorization', 'Bearer ' + token);
   }
   });
   */

  window.Events = {};
  _.extend(window.Events, Backbone.Events);

  // Start listening to route changes
  Backbone.history.start();

  // Set up global click event handler to use pushState for links
  // use 'data-bypass' attribute on anchors to allow normal link behavior
  $(document).on('click', 'a:not([data-bypass])', function (event) {

    var href = $(this).attr('href');
    var protocol = this.protocol + '//';

    if (href.slice(protocol.length) !== protocol) {
      event.preventDefault();
      app.navigate(href, true);
    }

  });

  ////console.log('Welcome to Yeogurt');
});

// Initialize the application.
require(['init']);
