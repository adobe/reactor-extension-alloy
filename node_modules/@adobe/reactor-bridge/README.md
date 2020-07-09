# Launch Extension Bridge

[![npm (scoped with tag)](https://img.shields.io/npm/v/@adobe/reactor-bridge.svg?style=flat)](https://www.npmjs.com/package/@adobe/reactor-bridge)

Launch, by Adobe, is a next-generation tag management solution enabling simplified deployment of marketing technologies. For more information regarding Launch, please visit our [product website](http://www.adobe.com/enterprise/cloud-platform/launch.html).

When a Launch user is configuring extensions, rules, and data elements within the Launch UI, the Launch UI presents an extension's view within an iframe. This project provides the communication layer between the Launch UI and extension views for storage and retrieval of settings, validation, etc. It does so by exposing a simplified, abstracted API while leveraging the native `postMessage` browser API under the hood.

For more information about developing an extension for Launch, please visit our [extension development guide](https://developer.adobelaunch.com/guides/extensions/).

## Usage

The Launch UI consumes the bridge via the `@adobe/reactor-bridge` npm package while extension views consume the bridge by loading a CDN-hosted script as described in the [extension development guide](https://developer.adobelaunch.com/guides/extensions/views/).

The communication layer consists three different pieces:

* **Parent (lib/parent.js):** This is the portion of the communication layer that the Launch UI uses. The Launch UI uses this by importing it directly:

  `import { loadIframe } from '@adobe/reactor-bridge';`
  
  The arguments, return value, and behavior of `loadIframe` can be found within the code documentation in `parent.js`.

* **Child (dist/extensionbridge-child.js):** This is the portion of the communication layer that extension views use, though extension views don't load it directly (see Child Loader). This file is hosted by the Launch UI which means it may be different based on the environment. This is important since it needs to be compatible with the Parent that is being used by the Launch UI in the same environment.
* **Child Loader (dist/extensionbridge.js):** This loads Child. Child Loader will be loaded by extensions via a `script` tag. Extensions will always load the same Child Loader regardless of the environment they are running in. Child Loader then loads the environment-specific Child.

## Contributing

Contributions are welcomed! Read the [Contributing Guide](CONTRIBUTING.md) for more information.

To get started:

1. Install [node.js](https://nodejs.org/).
3. Clone the repository.
4. After navigating into the project directory, install project dependencies by running `npm install`.

### Scripts

To run tests a single time, run the following command:

`npm run test`

To run tests continually while developing, run the following command:

`npm run test:watch`

To run a sandbox where you can manually test your changes (manipulate the sandbox directory as desired), run the following command:

`npm run sandbox`

To create a build, run the following command:

`npm run build`

## Browser Support

The extension bridge supports the following browsers:

* Chrome (latest)
* Safari (latest)
* Firefox (latest)
* Edge (latest)
 
## Licensing

This project is licensed under the Apache V2 License. See [LICENSE](LICENSE) for more information.
