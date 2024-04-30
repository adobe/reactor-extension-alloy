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

echo "$REACTOR_IO_INTEGRATION_PRIVATE_KEY_CONTENTS" >private.key

# reactor-uploader 5.0.5 has a bug where an error occurs during upload
# If this fails we sleep for 5 minutes, then run the next command. Sometimes the upload
# just needs a little time to complete.
npx @adobe/reactor-uploader@5.2.0 package-adobe-alloy-${VERSION}.zip \
	--org-id=97D1F3F459CE0AD80A495CBE@AdobeOrg \
	--tech-account-id=CC7A4BD95E695DBA0A495EB7@techacct.adobe.com \
	--api-key=f401a5fe22184c91a85fd441a8aa2976 \
	--private-key="./private.key" \
	--upload-timeout=300

echo "Y" | npx @adobe/reactor-releaser \
	--org-id=97D1F3F459CE0AD80A495CBE@AdobeOrg \
	--tech-account-id=CC7A4BD95E695DBA0A495EB7@techacct.adobe.com \
	--api-key=f401a5fe22184c91a85fd441a8aa2976 \
	--private-key="./private.key"
