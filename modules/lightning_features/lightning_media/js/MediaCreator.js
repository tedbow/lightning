/**
 * Constructor for Lightning's CKEditor plugin allowing users to create
 * media assets from an embed code or by uploading an image.
 *
 * @param {CKEditor.editor} editor
 *   The CKEditor instance.
 * @param {object} attributes
 *   Attributes to be set on embedded entities.
 * @constructor
 */
function MediaCreator (editor, attributes) {

  attributes = _.extend({
    'data-align': 'none',
    'data-embed-button': 'media_library',
    'data-entity-embed-display': 'entity_reference:entity_reference_entity_view',
    'data-entity-embed-settings': '{"view_mode":"embedded"}'
  }, attributes || {});

  this.view = new TabsView();

  function doEmbed (model) {
    if (model.get('entity_type') === 'file') {
      // Files are not renderable by default (not without file_entity installed,
      // anyway), so if the entity is a file, embed the thumbnail directly.
      editor.insertHtml(model.get('thumbnail'));
    }
    else {
      var code = jQuery('<drupal-entity />')
      .attr(attributes)
      .attr({
        'data-entity-type': model.get('entity_type'),
        'data-entity-bundle': model.get('bundle'),
        'data-entity-id': model.id,
        'data-entity-label': model.get('label'),
        'data-entity-uuid': model.get('uuid')
      })
      .prop('outerHTML');

      editor.insertHtml(code);
    }
  }

  // The 'save' event is a custom event fired by SaveView instances when the
  // Save button is clicked. It expects to delegate the actual saving logic
  // to the calling code.
  this.view.on('save', function (model, view) {
    model.save().then(function () {
      view.reset();
      doEmbed(model);
      model.clear();
    });
  });

  this.view.on('place', function (model) {
    doEmbed(model);
  });

}

MediaCreator.prototype.createEmbed = function (url, attributes) {
  var model = new Embed();
  model.urlRoot = Drupal.url(url);

  attributes = _.extend({
    title: Drupal.t('Embed Code')
  }, attributes || {});

  var view = new EmbedView({
    model: model,
    attributes: attributes
  });

  var t = new SaveView({
    model: model,
    view: view
  });
  this.view.addTab(t);

  return this;
};

MediaCreator.prototype.createUpload = function (url, attributes) {
  attributes = _.extend({
    title: Drupal.t('Upload Image')
  }, attributes || {});

  var view = new UploadView({
    url: Drupal.url(url),
    attributes: attributes
  });

  var t = new SaveView({
    model: view.model,
    view: view
  });
  this.view.addTab(t);

  return this;
};

MediaCreator.prototype.createLibrary = function (url, bundle_url, attributes) {
  var options = {};

  options.backend = new LibraryConnector([], {
    baseUrl: Drupal.url(url)
  });

  options.attributes = _.extend({
    title: Drupal.t('Media Library')
  }, attributes || {});

  if (bundle_url) {
    options.bundles = jQuery.ajax({
      url: Drupal.url(bundle_url),
      headers: {
        Accept: 'application/json'
      }
    }).then(_.pairs);
  }

  this.view.addTab(new LibraryView(options));

  return this;
};
