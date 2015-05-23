define(['views/baseView'], function (BaseView) {
  'use strict';

  var Gallery = BaseView.extend({

    //el: '#content',
    tag: '',

    template: JST['client/templates/gallery.jst'],

    events: {

    },

    initialize: function (options) {
      if(options) this.options =  options;
      ////console.log('Se crea la vista de upload.');

    },

    render: function () {

      window.app.currentViewName = 'Home';

      this.$el.html(this.template({
        name: 'Participate',
        tag: this.tag,
        title: window.app.LocaleCollection.get(1).get("participate")[0].string,
        text: window.app.LocaleCollection.get(1).get("participate")[1].string,
        bot1: window.app.LocaleCollection.get(1).get("participate")[2].string,
        bot2: window.app.LocaleCollection.get(1).get("participate")[3].string
      }));

      return this;
    },

    afterRender:function(){
      var gallery212 = $("#gallery212").gallery();
    }



  });

  return Gallery;
});
