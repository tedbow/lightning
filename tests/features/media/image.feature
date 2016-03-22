@lightning @lightning_media @api
  Feature: Image media assets
    A media asset representing a locally hosted image.

  Scenario: Creating an image
    Given I am logged in as a user with the media_creator role
    When I visit "/media/add"
    And I click "Image"
    Then I should see "Image"
    And I should see "Save to my media library"

  @javascript
  Scenario: Uploading an image from within CKEditor
    Given I am logged in as a user with the "administrator" role
    When I visit "/node/add/page"
    And I execute the "media_library" command in CKEditor "edit-body-0-value"
    And I click "Upload Image"
    And I make the "input[name='__dropzone_0']" element visible
    And I attach the file "puppy.jpg" to "__dropzone_0"
    And I wait for AJAX to finish
    And I check the box "Save to my media library"
    And I press "Save"
    And I wait for AJAX to finish
    Then CKEditor "edit-body-0-value" should match "/data-entity-id=.?[0-9]+.?/"
