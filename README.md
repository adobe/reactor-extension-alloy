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

## Manually Testing Views Using the Local Sandbox

When running `npm run dev`, a local sandbox will be provided where you can manually test extension views in isolation. For this extension, all views (except the extension configuration view) provide a dropdown where the user can select which configured SDK instance should be used for that particular action, data element, etc. This dropdown is populated with SDK instance names that were previously configured by the user in the extension configuration view, which is a required step when the user installs the extension on a Launch property. In other words, these views are dependent upon settings coming from the extension configuration view in order to function properly.

For illustration purposes, let's assume we are testing the Send Event action type. In the sandbox, we first need to select the "Extension Configuration" view. In that view, configure whatever instances you would like to test with. When you're done, click the Get Settings tab on the right side of the sandbox, then click the Get Settings button. You should be provided with a block of JSON that looks something like this:

```json
{
  "instances": [
    {
      "name": "alloy",
      "configId": "PR123",
      "idSyncContainerId": 10
    }
  ]
}
```

Copy this JSON. Now, switch to "Send Event" action view. You'll likely won't see any instances to choose from in the instances dropdown. That's expected, because it doesn't have extension settings (the settings that contain the configured instances) to work with yet since the view is being tested in isolation. It does not reflect how the extension will really behave inside Launch, however, because inside Launch, extension settings will always be provided to the view.

Within the Init tab on the right side of the page, find the `extensionSettings` node inside the JSON. Paste your copied JSON for the value of `extensionSettings`. Click "Init". You should now see instances to choose from in the instances dropdown. 

## Uploading

To upload the extension, you will first need to create an integration in [Adobe I/O](https://console.adobe.io). Once an integration has been created, use the [Launch Extension Uploader Tool](https://www.npmjs.com/package/@adobe/reactor-uploader) to upload the extension. For more information, please see the [Submissions documentation](https://developer.adobelaunch.com/extensions/submissions/) provided by Launch.

## Requesting Write Access (Adobe Employees)

For Adobe Employees that would like write access to this repository, please follow the instructions found in the [GitHub Adobe Org Management document](https://git.corp.adobe.com/OpenSourceAdvisoryBoard/handbook/blob/master/GitHub-Adobe-Org-Management.md#request-access-to-our-adobe-github-org). When you must indicate a team to which your user should be added, please enter `adobe|UnifiedJS`.
