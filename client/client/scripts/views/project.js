define(['views/baseView'], function (BaseView) {
  'use strict';

  var Project = BaseView.extend({

    //el: '#content',

    template: JST['client/templates/project.jst'],

    events: {},

    render: function () {

      var scope = this;

      window.app.currentViewName = 'Project';
      window.app.backgroundType = 'img';
      window.app.backgroundImg.setImgUrl('images/desktop/bg-project.jpg');

      this.$el.html(this.template({
        name: window.app.currentViewName,
        title1: window.app.LocaleCollection.get(1).get("project")[0].string,
        texto1: window.app.LocaleCollection.get(1).get("project")[1].string,
        title2: window.app.LocaleCollection.get(1).get("project")[2].string,
        texto2: window.app.LocaleCollection.get(1).get("project")[3].string,
        title3: window.app.LocaleCollection.get(1).get("project")[4].string,
        texto3: window.app.LocaleCollection.get(1).get("project")[5].string
      }));

      setTimeout(function () {
        $('#backgroundImg img').css('max-width','100%');
      }, 0);

      return this;
    }

  });

  return Project;
});
