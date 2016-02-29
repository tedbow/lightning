function MediaCreator (editor, options, attributes) {

  attributes = _.extend({
    'data-align': 'none',
    'data-embed-button': 'media_library',
    'data-entity-embed-display': 'entity_reference:entity_reference_entity_view',
    'data-entity-embed-settings': '{"view_mode":"embedded"}',
  }, attributes || {});

  this.view = new TabsView(options);

  this.view.on('save', function (model, view) {
    model.save().then(function (model) {
      view.reset();

      if (model.get('entity_type') === 'file') {
        // Files are not renderable by default (not without file_entity installed,
        // anyway), so if the entity is a file, embed the thumbnail directly.
        editor.insertHtml(model.get('thumbnail'));
      }
      else {
        var code = $('<drupal-entity />')
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

      model.clear();
    });
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
}

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
}
