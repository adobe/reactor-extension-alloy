#! /usr/bin/env bash

# die on any error
set -e

VERSION=$1

npm ci

git config user.name $GITHUB_ACTOR
git config user.email gh-actions-${GITHUB_ACTOR}@github.com
git remote add gh-origin git@github.com:${GITHUB_REPOSITORY}.git

git pull origin main

# update alloy version in package-lock.json
if ! git diff --quiet -- package-lock.json; then
  git add package-lock.json
  git commit -m "[skip ci] update alloy version in package-lock.json"
else
  echo "No alloy update found; skipping commit."
fi

# tag this build
npm version $VERSION --no-commit-hooks -m "[skip ci] $VERSION"
git push gh-origin HEAD:main --follow-tags

npm run package

npx @adobe/reactor-uploader@6.0.0-beta.12 package-adobe-alloy-${VERSION}.zip \
  --auth.client-id=f401a5fe22184c91a85fd441a8aa2976 \
  --upload-timeout=300

echo "Y" | npx @adobe/reactor-releaser@4.0.0-beta.8 \
  --auth.client-id=f401a5fe22184c91a85fd441a8aa2976
