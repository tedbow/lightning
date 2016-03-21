#!/usr/bin/env bash
drush role-add-perm anonymous "view media"
drush role-add-perm authenticated "view media"
drush pm-enable --yes lightning_workflow
