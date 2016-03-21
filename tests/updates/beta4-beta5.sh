#!/usr/bin/env bash
drush --yes config-set scheduled_updates.scheduled_update_type.multiple_node_embargo update_types_supported '["independent"]' --format=json
drush --yes config-set scheduled_updates.scheduled_update_type.multiple_node_embargo update_runner.id default_independent
drush --yes config-set scheduled_udpates.scheduled_update_type.multiple_node_embargo update_runner.bundles '{"landing_page":"landing_page","page":"page"}' --format=json
