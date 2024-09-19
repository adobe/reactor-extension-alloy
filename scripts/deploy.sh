#! /usr/bin/env bash

# die on any error
set -e

VERSION=$1

npm ci

git config user.name $GITHUB_ACTOR
git config user.email gh-actions-${GITHUB_ACTOR}@github.com
git remote add gh-origin git@github.com:${GITHUB_REPOSITORY}.git

git pull origin main

npm version $VERSION --no-commit-hooks -m "[skip ci] $VERSION"

git push gh-origin HEAD:main --follow-tags

npm run package

npx @adobe/reactor-uploader@6.0.0-beta.15 package-adobe-alloy-${VERSION}.zip \
  --auth.client-id=0c1c7478c4994c69866b64c8341578ed \
  --upload-timeout=300

echo "Y" | npx @adobe/reactor-releaser@4.0.0-beta.8 \
  --auth.client-id=0c1c7478c4994c69866b64c8341578ed
