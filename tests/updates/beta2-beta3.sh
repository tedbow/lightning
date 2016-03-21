#!/usr/bin/env bash

CONFIG_ID = scheduled_updates.scheduled_update_type.node_embargo

drush --yes config-set $CONFIG_ID update_types_supported '["embedded"]' --format=json
drush --yes config-set $CONFIG_ID update_runner.id latest_revision
drush --yes config-set $CONFIG_ID update_runner.update_user USER_UPDATE_OWNER
