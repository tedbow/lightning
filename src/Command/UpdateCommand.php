<?php

/**
 * @file
 * Contains \Acquia\Lightning\Command\UpdateCommand.
 */

namespace Acquia\Lightning\Command;

use Doctrine\Common\Inflector\Inflector;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;

/**
 * Executes all manual update steps for upgrade path testing.
 */
class UpdateCommand extends Command {

  /**
   * The versions that can be updated, in order.
   *
   * @var string[]
   */
  private $versions = [
    'beta1',
    'beta2',
    'beta3',
    'beta4',
    'beta5',
    'rc1',
  ];

  /**
   * {@inheritdoc}
   */
  protected function configure() {
    $this
      ->setName('update')
      ->setDescription('Executes manual update steps automatically ;)')
      ->addArgument('from', InputArgument::REQUIRED, 'The version to update from.')
      ->addArgument('to', InputArgument::REQUIRED, 'The version to update to.');
  }

  /**
   * {@inheritdoc}
   */
  protected function execute(InputInterface $input, OutputInterface $output) {
    $versions = $this->versions;

    $i = array_search($input->getArgument('from'), $versions);
    $end = array_search($input->getArgument('to'), $versions);

    $sequence = [];
    while ($i < $end) {
      $update = [
        $versions[$i],
        $versions[++$i],
      ];
      // PHPCS hates uncamelized methods, so we need to inflect.
      $function = Inflector::camelize(implode(' ', $update));
      $sequence[$function] = $update;
    }
    foreach ($sequence as $function => $versions) {
      call_user_func([$this, $function]);
      $output->writeln('Updated ' . $versions[0] . ' to ' . $versions[1] . '.');
    }
  }

  /**
   * Updates from beta1 to beta2.
   */
  private function beta1Beta2() {
    `drush role-add-perm anonymous "view media"`;
    `drush role-add-perm authenticated "view media"`;
    `drush pm-enable lightning_workflow --yes`;
  }

  /**
   * Updates from beta2 to beta3.
   */
  private function beta2Beta3() {
    $config_id = 'scheduled_updates.scheduled_update_type.node_embargo';

    `drush config-set $config_id update_types_supported '["embedded"] --format=json --yes`;
    `drush config-set $config_id update_runner.id latest_revision --yes`;
    `drush config-set $config_id update_runner.update_user USER_UPDATE_OWNER --yes`;
  }

  /**
   * Updates from beta3 to beta4.
   */
  private function beta3Beta4() {
    $this->updateDatabase();
  }

  /**
   * Updates from beta4 to beta5.
   */
  private function beta4Beta5() {
    $config_id = 'scheduled_updates.scheduled_update_type.multiple_node_embargo';

    `drush config-set $config_id update_types_supported '["independent"]' --format=json --yes`;
    `drush config-set $config_id update_runner.id default_independent --yes`;
    `drush config-set $config_id update_runner.bundles '{"landing_page":"landing_page","page":"page"}' --format=json --yes`;
  }

  /**
   * Updates from beta5 to rc1.
   */
  private function beta5Rc1() {
    $this->updateDatabase();
  }

  /**
   * Does a normal database update.
   */
  private function updateDatabasge() {
    `drush updatedb --yes`;
  }

}
