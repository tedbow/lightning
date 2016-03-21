#!/usr/bin/env bash

CONFIG_ID = scheduled_updates.scheduled_update_type.multiple_node_embargo

drush --yes config-set $CONFIG_ID update_types_supported '["independent"]' --format=json
drush --yes config-set $CONFIG_ID update_runner.id default_independent
drush --yes config-set $CONFIG_ID update_runner.bundles '{"landing_page":"landing_page","page":"page"}' --format=json
