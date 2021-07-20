#! /usr/bin/env bash

# This script is run as part of the npm version command.
# It runs after package.json is updated with the new version,
# but before the commit and tag.

# grab the new version from package.json
VERSION=$(npx json -f package.json version)

# update the version in extension.json
npx json -I -f extension.json -e "this.version='$VERSION'"

# the json command has different json printing than prettier does.
npx prettier --write extension.json

# add extension.json so it is included in the commit
git add extension.json
