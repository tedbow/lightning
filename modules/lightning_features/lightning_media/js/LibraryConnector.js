var LibraryConnector = Backbone.Collection.extend({

  query: {
    page: 0
  },

  initialize: function (models, options) {
    this.baseUrl = options.baseUrl;
  },

  load: function (reset) {
    if (reset) {
      this.query.page = 0;
    }

    this.url = this.baseUrl
      + '?'
      + Object.keys(this.query).map(function (k) { return k + '=' + this.query[k]; }.bind(this)).join('&');

    this.fetch({ reset: reset || false });
  },

  search: function (keywords) {
    if (keywords) {
      this.query.keywords = keywords;
    }
    else {
      delete this.query.keywords;
    }
    this.load(true);
  },

  filterByBundle: function (bundle) {
    if (bundle) {
      this.query.bundle = bundle;
    }
    else {
      delete this.query.bundle;
    }
    this.load(true);
  },

  loadMore: function () {
    this.query.page++;
    this.load();
  }

});
