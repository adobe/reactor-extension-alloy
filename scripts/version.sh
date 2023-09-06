#! /usr/bin/env bash

# This script is run as part of the npm version command.
# It runs after package.json is updated with the new version,
# but before the commit and tag.

# update the version of alloy if the current version of alloy is a pre-release.
./scripts/updateAlloy.js

# update package.json and package-lock.json in case alloy was updated.
git add package.json package-lock.json
