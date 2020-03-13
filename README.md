# Alloy Extension for Adobe Experience Platform Launch

[Alloy](https://github.com/adobe/alloy) is the web SDK for the Adobe Experience Platform. This repository is for the [Adobe Experience Platform Launch](https://www.adobe.com/experience-platform/launch.html) extension that makes it easier for Launch users to implement Alloy on their websites. This repository is currently under active development and is not yet intended for general consumption.

## Contributing

Contributions are welcomed! Read the [Contributing Guide](./.github/CONTRIBUTING.md) for more information about how our community works.

To get started on development:

1. Install [node.js](https://nodejs.org/).
1. Clone the repository.
1. After navigating into the project directory, install project dependencies by running `npm install`.

Several npm scripts have been provided for assisting in development. Each script can be run by navigating to the cloned repository directory in a terminal and executing `npm run scriptname` where `scriptname` is the name of the script you would like to run. The most useful scripts are as follows:

* `package` Builds and packages the extension to a zip file ready to be uploaded to Launch.  
* `upload` Same as `package` but also uploads the extension package to Launch.  
* `dev` Spins up a sandbox where you can manually test the extension. More details about the sandbox can be found [here](https://www.npmjs.com/package/@adobe/reactor-sandbox). 
* `lint` Analyzes code for potential errors.
* `format` Formats code to match agreed-upon style guidelines.
* `test:unit` Runs unit tests against source files. Unit tests can be found in the `test/unit` directory.
* `test:unit:coverage` Same as `test:unit`, but will also produce a coverage report.
* `test:unit:watch` Same as `test:unit`, but will re-run the tests as you change source files or test files.
* `test:unit:watch:chrome` Same as `test:watch`, but will run the tests inside of Chrome (non-headless) for easier debugging.
* `test:functional` Runs functional tests against source files. Functional tests can be found in the `test/functional` directory.
* `test:functional:watch` Same as `test:functional`, but will allow you to quickly re-run tests as changes are made.
* `test:functional:watch:debug` Same as `test:functional:watch`, but will allow you to debug "server-side" TestCafe code.
* `test` Runs unit and functional tests against source files. Tests can be found in the `test` directory.

When you attempt to commit code changes, several of the above tasks will be run automatically to help ensure that your changes pass tests and are consistent with agreed-upon standards.

Thank you for your interest in contributing!

## Testing

Please see [Test Instructions](test/docs/README.md) for more details about running tests.

## Publishing a New Extension Version

Only Adobe employees are eligible to publish new extension versions.

This steps listed below assume the new extension version includes changes from the Alloy standalone library.

1. Ensure you have extension upload rights for the Launch product within the Unified JS Lab Experience Cloud organization. If you need to be given rights or want to make sure you have rights before proceeding, please send a message to the internal `alloy-engineering` Slack channel and someone with admin rights can help you.
1. Go to the [Adobe I/O Console](https://console.adobe.io/) and create an integration. Please see [these instructions in the Adobe Launch developer documentation](https://developer.adobelaunch.com/api/guides/access_tokens/#create-a-new-integration) on how to create an Adobe I/O integration for uploading Launch extensions.
1. Open the Alloy repository locally. 
1. Make sure you're on the `master` branch and have pulled the latest changes.
1. Version and tag Alloy by running `npm version major/minor/patch`. Whether you use `major`, `minor`, or `patch` depends on what has changed since the last release and how that matches [semantic versioning](https://semver.org/). Note that while the version is below 1.0.0, semantic versioning is flexible on how a project should be versioned. In our case, we have decided that breaking changes should bump the minor version (`npm version minor`) while any other change should bump the patch version (`npm version patch`).
1. Running `npm version major/minor/patch` should have changed `package.json` and `package-lock.json`, committed the changes, and created a new git tag. Push these changes to Github by running `git push origin master --follow-tags`. Go to Github and ensure you see the newly added commit and tag.
1. Create a new production build of Alloy by running `npm run build:prod`.
1. Open up `dist/reactor/alloy.js` and copy the file's contents.
1. Open the Alloy extension repository (the one you're looking at right now) locally and make sure you're on the `master` branch and have pulled the latest changes.
1. Open `src/lib/runAlloy.js`.
1. Find the `// LIBRARY CODE` comment and the `// END OF LIBRARY CODE` comment. Replace the content between the two comments with the content you previously copied from the Alloy repository.
1. Manually bump the version in `extension.json`. Follow the same semantic versioning rules that you did for Alloy. The version used in the extension does not need to match the version used in Alloy. In fact, they'll almost always be different because sometimes we'll make changes in the Alloy Launch extension that don't require changes in Alloy.
1. At this point, it's good to test out the latest code before committing your local changes. Start by running `npm run package` to create a zip file you'll upload to Launch.
1. Run `npx @adobe/reactor-uploader` to upload the zip file to Launch. You'll likely find it easiest to pass arguments and use environment variables as outlined in the [reactor-uploader documentation](https://www.npmjs.com/package/@adobe/reactor-uploader). This information will come from the Adobe I/O integration you previously created. You may even want to create a bash script that you can easily re-run in the future, but don't commit it to the git repository because the argument values will be specific to your Adobe I/O integration.
1. Once the zip file has been uploaded and processed, the new version will be available only to properties configured for extension development within the Unified JS Lab organization. Go create a property configured for extension development within the Unified JS Lab within Launch, install the extension, create some rules, create a library containing all the resources, and build the library. Then, place the Launch dev environment's embed code on a test page and test that your rules run properly. These steps are documented in more detail in the [Adobe Launch developer documentation](https://developer.adobelaunch.com/extensions/submissions/upload-and-test/#4-create-a-development-property).
1. After validating that the extension works as expected, commit your local changes into git. In your commit message, note the new Alloy version and Alloy extension version.
1. Version and tag the Alloy extension by running `npm version v0.0.1`, where `0.0.1` is whatever version is in `extension.json`.
1. Publish the git commits and the new tag to Github by running `git push origin master --follow-tags`. Go to Github and ensure you see the newly added commits and tag.
1. Promote the extension to private availability by running `npx @adobe/reactor-releaser`. It takes the same arguments and environment variables as the uploader you used previously. See the [reactor-releaser documentation](https://www.npmjs.com/package/@adobe/reactor-releaser) for more information. With the extension promoted to private availability, users of other Launch properties in the Unified JS org that are not configured for extension development will be able to see and upgrade to the new version.
1. Create a pull request on the user-facing extension documentation and include any remaining documentation changes and release notes. You can follow what was done in [this example pull request](https://git.corp.adobe.com/AdobeDocs/launch.en/pull/90).
1. Once the documentation pull request has been merged, promote the extension to public availability by messaging Ben Robison and requesting it be published. Be sure to include the extension package ID in the message. You'll find the extension package ID in the console output from the reactor-releaser.
1. Once Ben says the extension package has been promoted, any Launch user in any organization can install the new version on their properties. Congratulations! You've published a new version of the extension. 

## Requesting Write Access (Adobe Employees)

For Adobe Employees that would like write access to this repository, please follow the instructions found in the [GitHub Adobe Org Management document](https://git.corp.adobe.com/OpenSourceAdvisoryBoard/handbook/blob/master/GitHub-Adobe-Org-Management.md#request-access-to-our-adobe-github-org). When you must indicate a team to which your user should be added, please enter `adobe|UnifiedJS`.
