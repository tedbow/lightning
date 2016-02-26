var TabsView = Backbone.View.extend({

  initialize: function () {
    this.render();
  },

  render: function () {
    this.$el.prepend('<ul />').tabs();
  },

  active: function () {
    var i = this.$el.tabs('option', 'active') + 1;

    return this.$el
      .children()
      .eq(i)
      .data('view');
  },

  addTab: function (view) {
    function randomID () {
      var id = '';
      for (var i = 0; i < 12; i++) {
        id += 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.charAt(Math.floor(Math.random() * 52));
      }
      return id;
    }

    this.listenTo(view, 'save', function (model, view) {
      this.trigger('save', model, view);
    });

    view.$el
      .data('view', view)
      .attr('id', function (undefined, id) {
        return id || randomID();
      });

    this.$el
      .append(view.el)
      .children('ul')
      .first()
      .append('<li><a href="#' + view.el.id + '">' + view.el.title + '</a></li>')
      .parent()
      .tabs('refresh');
  },

  reset: function () {
    this.$el.children(':gt(0):data(view)').each(function () {
      $(this).data('view').reset();
    });
  }

});
