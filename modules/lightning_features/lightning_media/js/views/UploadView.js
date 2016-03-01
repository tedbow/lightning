var UploadView = Backbone.View.extend({

  initialize: function (options) {
    this.model = new Backbone.Model();

    // The Dropzone's event handlers need access to the model.
    var model = this.model;
    model.urlRoot = options.url;
    model.on('destroy', model.clear);

    // The dict* messages are not displayed when the dropzone is created
    // programmatically unless the target element already has the dropzone
    // class. @see https://github.com/enyo/dropzone/issues/655
    this.$el.addClass('dropzone');

    this.dz = new Dropzone(this.el, {
      acceptedFiles: 'image/*',
      addRemoveLinks: true,
      dictDefaultMessage: Drupal.t('Click or drag and drop an image here to upload it.'),
      dictFallbackMessage: Drupal.t('Click here to upload an image'),
      init: function () {
        // Set a unique identifier on the hidden file field, for testing.
        this.hiddenFileInput.name = '__dropzone_' + UploadView.count++;
      },
      maxFiles: 1,
      thumbnailHeight: null,
      thumbnailWidth: null,
      url: model.urlRoot
    })
    .on('success', function (file, response) {
      model.set(response).trigger('sync', model, response, {});
    })
    .on('removedfile', function () {
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

}, { count: 0 });
