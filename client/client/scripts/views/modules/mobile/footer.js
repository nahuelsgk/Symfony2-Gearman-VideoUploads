define(['views/baseView'], function (BaseView) {
  'use strict';

  var MobileFooterView = BaseView.extend({

    template: JST['client/templates/modules/mobile/footer.jst'],

    initialize: function () {
      this.render();
    },

    render: function () {
      this.$el.html(this.template({}));

      return this;
    }

  });

  return MobileFooterView;

});
