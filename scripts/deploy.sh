#! /usr/bin/env bash

VERSION=$1

npm ci

npm run test:unit

git config user.name $GITHUB_ACTOR
git config user.email gh-actions-${GITHUB_ACTOR}@github.com
git remote add gh-origin git@github.com:${GITHUB_REPOSITORY}.git

npm version $VERSION -m "[skip ci] $VERSION"

git push gh-origin HEAD:main --follow-tags

npm run package

echo "$REACTOR_IO_INTEGRATION_PRIVATE_KEY_CONTENTS" > private.key

npx @adobe/reactor-uploader package-adobe-alloy-${VERSION}.zip \
  --org-id=97D1F3F459CE0AD80A495CBE@AdobeOrg \
  --tech-account-id=CC7A4BD95E695DBA0A495EB7@techacct.adobe.com \
  --api-key=f401a5fe22184c91a85fd441a8aa2976 \
  --private-key="./private.key"

npx @adobe/reactor-releaser \
  --org-id=97D1F3F459CE0AD80A495CBE@AdobeOrg \
  --tech-account-id=CC7A4BD95E695DBA0A495EB7@techacct.adobe.com \
  --api-key=f401a5fe22184c91a85fd441a8aa2976 \
  --private-key="./private.key"



