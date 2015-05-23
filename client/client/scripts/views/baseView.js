define(function () {
  'use strict';

  var BaseView = Backbone.View.extend({

    events: {},

    subviews: {},


    initialize: function (options) {
      if (options) {
        this.options = options;
      }

      this.listenTo(window.Events, 'header::CHANGE_LANG', this.render);

    },

    /**
     * Muestra la vista en el elemento escogido.
     * @param wrapperElement
     */
    showView:function(wrapperElement){
      $(wrapperElement).html(this.render().$el);
      this.afterRender();
    },

    /**
     * Reload Render and After Render.
     */
    reloadView: function () {
      this.render();
      this.afterRender();
    },

    render: function () {
      this.$el.html(this.template);

      // If subviews are passed in, then assign/render them
      if (this.options && this.options.subviews) {
        this.assign(_.extend(this.options.subviews, this.subviews));
      } else {
        // Assign/Render subviews
        this.assign(this.subviews);
      }

      return this;
    },

    /**
     * Document.ready
     */
    afterRender: function () {

    },

    /**
     * Before Close function
     * (Off events, clear children views)
     * Should be used to cleanup bind', and 'on' events
     */
    onClose: function () {
      this.stopListening();
    },
    /**
     * realiza una animación y luego eliman las clases animadas.
     * @param selector  - Elemento a animar.
     * @param classList - Lista de clases animadas que se añaden.
     * @param _callback - callback ejecutado cuando se termina la animación.
     */
    addAnimatedClass:function(selector,classList,_callback){
      $(selector).addClass(classList);
      $(selector).one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
        $(selector).removeClass(classList);
        ////console.log("Termina la animacion:: Se eliminan las clases animadas: "+classList);
        if(_callback)_callback();
      });
    },
    /**
     * Go to a particular Route View waiting for the delay time.
     * @param route
     * @param delay
     */
    goToViewAfterWaiting:function(route,delay){

      window.Events.trigger('BaseView::goToViewAfterWaiting',{
        from: this.currentViewName ? this.currentViewName : false,
        to:route,
        delay:delay
      });

      var timer = setTimeout(function(){
        window.app.navigate(route, {trigger: true});
        clearInterval(timer);
      },delay);

    },
    /**
     * Function de Debug para medir el tiempo de una funcion.
     * @param _function
     * @param functionName
     */
    debugCalculateTimeofFunction:function(_function,functionName){

      var start = new Date().getTime();

        _function();

      var end = new Date().getTime();
      var time = end-start;

      //console.log('Tiempo de exec.['+functionName+']: '+time);
    },
    /**
     * Tracking the todos los eventos
     * @param trackingInfoObject
     */
    trackEvent:function(trackingInfoObject){

      if(! _.isUndefined(dataLayer)) {
        dataLayer.push(trackingInfoObject);
      }
    },
    /**
     * Hace el tracking de los eventos de  Sizmek
     * @param SizmekTrackingId
     * @returns {string}
     */
    trackingSizmek:function(SizmekTrackingId){

      /**
       // Conversion Name: 212VIP Club Main Landing Performance Downloads Site 0415
       // INSTRUCTIONS
       // The Conversion Tags should be placed at the top of the <BODY> section of the HTML page.
       // In case you want to ensure that the full page loads as a prerequisite for a conversion
       // being recorded, place the tag at the bottom of the page. Note, however, that this may
       // skew the data in the case of slow-loading pages and in general not recommended.
       //
       // NOTE: It is possible to test if the tags are working correctly before campaign launch
       // as follows:  Browse to http://bs.serving-sys.com/Serving/adServer.bs?cn=at, which is
       // a page that lets you set your local machine to 'testing' mode.  In this mode, when
       // visiting a page that includes an conversion tag, a new window will open, showing you
       // the data sent by the conversion tag to the MediaMind servers.
       //
       */

      var _random = Math.random()*1000000;

      return "<script type='text/javascript' src='HTTP://bs.serving-sys.com/Serving/ActivityServer.bs?cn=as&ActivityID="+SizmekTrackingId+"&rnd="+_random+"'></script>" +
        "<noscript>" +
        "<img width='1' height='1' style='border:0' src='HTTP://bs.serving-sys.com/Serving/ActivityServer.bs?cn=as&ActivityID="+SizmekTrackingId+"&ns=1'/>" +
        "</noscript>";
    }


  });

  return BaseView;
});
