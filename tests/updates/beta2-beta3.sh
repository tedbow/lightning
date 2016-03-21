#!/usr/bin/env bash
drush --yes config-set scheduled_updates.scheduled_update_type.node_embargo update_types_supported '["embedded"]' --format=json
drush --yes config-set scheduled_updates.scheduled_update_type.node_embargo update_runner.id latest_revision
drush --yes config-set scheduled_updates.scheduled_update_type.node_embargo update_runner.update_user USER_UPDATE_OWNER
