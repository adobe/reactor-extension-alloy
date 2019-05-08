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
* `dev` Spins up a sandbox where you can manually test the extension. More details about the sandbox can be found [here](https://www.npmjs.com/package/@adobe/reactor-sandbox). 
* `test` Runs unit tests against source files. Tests can be found in the `test` directory.
* `test:watch` Same as `test`, but will re-run the tests as you change source files or test files.
* `test:watch:chrome` Same as `test:watch`, but will run the tests inside of Chrome (non-headless) for easier debugging.
* `lint` Analyzes code for potential errors.
* `format` Formats code to match agreed-upon style guidelines.

When you attempt to commit code changes, several of the above tasks will be run automatically to help ensure that your changes pass tests and are consistent with agreed-upon standards.

Thank you for your interest in contributing! 
