<?php

/**
 * @file
 * Contains \MediaLibrarySubContext.
 */

use Behat\Behat\Hook\Scope\BeforeScenarioScope;
use Drupal\DrupalExtension\Context\DrupalSubContextBase;
use Drupal\DrupalExtension\Context\DrupalSubContextInterface;

class MediaLibrarySubContext extends DrupalSubContextBase implements DrupalSubContextInterface {

  /**
   * The Drupal context.
   *
   * @var \Drupal\DrupalExtension\Context\DrupalContext
   */
  protected $drupalContext;

  /**
   * The Mink context.
   *
   * @var \Drupal\DrupalExtension\Context\MinkContext
   */
  protected $minkContext;

  /**
   * Pre-scenario hook.
   *
   * @BeforeScenario
   */
  public function gatherContexts(BeforeScenarioScope $scope) {
    $environment = $scope->getEnvironment();

    $this->drupalContext = $environment->getContext('Drupal\DrupalExtension\Context\DrupalContext');
    $this->minkContext = $environment->getContext('Drupal\DrupalExtension\Context\MinkContext');
  }

  /**
   * Returns the first available CKEditor instance ID.
   *
   * @return string|false
   *   The CKEditor instance ID, or FALSE if there are no active instances.
   */
  protected function getCkEditorInstanceId() {
    $instances = $this->getSession()
      ->evaluateScript('Object.keys(CKEDITOR.instances).join(",")');

    $instances = explode(',', $instances);
    return reset($instances);
  }

  /**
   * Executes a command in a CKEditor instance.
   *
   * @param string $command
   *   The command to execute.
   * @param string|null $instance
   *   (optional) The CKEditor instance ID. Defaults to the first available one.
   *
   * @When I execute the :command command in CKEditor
   * @When I execute the :command command in CKEditor :instance
   */
  public function executeCkEditorCommand($command, $instance = NULL) {
    $instance = $instance ?: $this->getCkEditorInstanceId();

    $this->getSession()
      ->executeScript("CKEDITOR.instances['$instance'].execCommand('$command');");

    $this->minkContext->iWaitForAjaxToFinish();
  }

  /**
   * Opens the CKEditor media library.
   *
   * @When I open the CKEditor media library
   * @When I open the media library in CKEditor
   */
  public function openMediaLibrary() {
    $this->executeCkEditorCommand('media_library');
  }

}
