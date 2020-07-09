# @adobe/reactor-turbine-schemas

Launch, by Adobe, is a next-generation tag management solution enabling simplified deployment of marketing technologies. For more information regarding Launch, please visit our [product website](http://www.adobe.com/enterprise/cloud-platform/launch.html).

This project is a collection of schemas based on the [JSON Schema vocabulary](https://json-schema.org/) that are used for validation of JSON objects within Launch. The schemas are not intended to be used directly by consumers; they are used by the Launch system and extension development tools.

## Available Schemas

### container.json

A schema describing the "container" output for [Turbine](https://github.com/Adobe-Marketing-Cloud/reactor-turbine) (the Launch rule engine). The container object contains configuration specific to a Launch property. Turbine uses the container as instruction on how to behave when running on a client website.

### extension-package-web.json

A schema describing the `extension.json` found in a web extension package. The `extension.json` file describes the contents of an extension. More information can be found on the [extension development guide](https://developer.adobelaunch.com/guides/extensions/extension-manifest/).

### extension-package-mobile.json

A schema describing the `extension.json` found in a web extension package. The `extension.json` file describes the contents of an extension.

## Contributing

Contributions are welcomed! Read the [Contributing Guide](CONTRIBUTING.md) for more information.

To get started:

1. Install [node.js](https://nodejs.org/).
3. Clone the repository.
4. After navigating into the project directory, install project dependencies by running `npm install`.

### Scripts

To run tests a single time, run the following command:

`npm run test`
 
## Licensing

This project is licensed under the Apache V2 License. See [LICENSE](LICENSE) for more information.
