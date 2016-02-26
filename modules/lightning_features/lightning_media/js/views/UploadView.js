var UploadView = Backbone.View.extend({

  attributes: {
    // The dict* messages are not displayed when the dropzone is created
    // programmatically unless the target element already has the dropzone
    // class. @see https://github.com/enyo/dropzone/issues/655
    class: 'dropzone'
  },

  initialize: function (options) {
    this.model = new Backbone.Model();

    // The Dropzone's event handlers need access to the model.
    var model = this.model;
    model.urlRoot = options.url;
    model.on('destroy', model.clear);

    this.dz = new Dropzone(this.el, {
      acceptedFiles: 'image/*',
      addRemoveLinks: true,
      dictDefaultMessage: Drupal.t('Click or drag and drop an image here to upload it.'),
      dictFallbackMessage: Drupal.t('Click here to upload an image'),
      maxFiles: 1,
      thumbnailHeight: null,
      thumbnailWidth: null,
      url: model.urlRoot
    })
    .on('success', function (file, response) {
      model.set(response).trigger('sync', model, response, {});
    })
    .on('removedfile', function (file) {
      if (model.destroy) {
        model.destroy();
      }
    });
  },

  reset: function () {
    // Know thy Ghostbusters villains...
    var gozer = this.model.destroy;
    this.model.destroy = null;
    // Clear the dropzone, canceling any upload in progress.
    this.dz.removeAllFiles(true);
    this.model.destroy = gozer;
  }

});
