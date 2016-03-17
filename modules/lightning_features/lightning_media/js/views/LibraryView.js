var LibraryView = Backbone.View.extend({

  attributes: {
    class: 'library'
  },

  events: {
    'change header select': function (event) {
      var bundle = $(event.target).val();
      this.backend.filterByBundle(bundle);
    },

    'change header input': function (event) {
      this.backend.search(event.target.value);
    },

    'keyup header input': _.debounce(function (event) { $(event.target).trigger('change'); }, 600),

    'click footer button': function () {
      this.trigger('place', this.collectionView.getSelectedModel(), this);
    },

    'appear footer': function () {
      this.backend.loadMore();
    }
  },

  thumbnailView: Backbone.View.extend({
    initialize: function (options) {
      this.el.innerHTML = options.model.get('thumbnail');
    }
  }),

  onAddBundle: function (model) {
    this.$('header select')
      .append('<option value="' + model.get('id') + '">' + model.get('label') + '</option>')
      .closest(':hidden')
      .show();
  },

  initialize: function (options) {
    this.backend = options.backend;

    this.listenTo(this.backend, 'request sync', function () {
      this.$('footer').toggleClass('waiting');
    });

    this.collectionView = new Backbone.CollectionView({
      collection: this.collection,
      el: document.createElement('ul'),
      emptyListCaption: Drupal.t('There are no items to display.'),
      modelView: this.thumbnailView
    });

    this.render();

    if (options.bundles) {
      options.bundles.on('add', this.onAddBundle, this);
    }
  },

  render: function () {
    this.$el.append(['<header />', this.collectionView.el, '<footer />']);

    this.$('header').append([
      '<div><input type="search" class="search" placeholder="' + Drupal.t('Search') + '" /></div>',
      '<div style="display: none;"><select id="__bundle"><option>' + Drupal.t('- all -') + '</option></select></div>'
    ]);

    this.$('footer').append('<div><button>' + Drupal.t('Place') + '</button></div>');
  }

});
