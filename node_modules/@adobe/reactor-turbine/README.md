# Launch Turbine

[![Build Status](https://travis-ci.com/adobe/reactor-turbine.svg?branch=master)](https://travis-ci.com/adobe/reactor-turbine)
[![Coverage Status](https://coveralls.io/repos/github/Adobe-Marketing-Cloud/reactor-turbine/badge.svg)](https://coveralls.io/github/Adobe-Marketing-Cloud/reactor-turbine)
[![npm (scoped with tag)](https://img.shields.io/npm/v/@adobe/reactor-turbine.svg?style=flat)](https://www.npmjs.com/package/@adobe/reactor-turbine)
[![dependencies Status](https://david-dm.org/Adobe-Marketing-Cloud/reactor-turbine/status.svg)](https://david-dm.org/Adobe-Marketing-Cloud/reactor-turbine)
[![devDependencies Status](https://david-dm.org/Adobe-Marketing-Cloud/reactor-turbine/dev-status.svg)](https://david-dm.org/Adobe-Marketing-Cloud/reactor-turbine?type=dev)

Launch, by Adobe, is a next-generation tag management solution enabling simplified deployment of marketing technologies. For more information regarding Launch, please visit our [product website](http://www.adobe.com/enterprise/cloud-platform/launch.html).

Turbine is the orchestrator within a Launch JavaScript runtime library (the library deployed on a client website) which processes previously configured rules and delegates logic to extensions.

This project is not intended to be used directly by consumers; it is used by the Launch build system and incorporated into emitted runtime libraries.

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

To ensure your code meets our linting standards, run the following command:

`npm run lint`

To create a build, run the following command:

`npm run build`

## Browser Support

Turbine supports the following browsers:

* Chrome (latest)
* Safari (latest)
* Firefox (latest)
* Internet Explorer (10 and above)
* iOS Safari (latest)
 
## Licensing

This project is licensed under the Apache V2 License. See [LICENSE](LICENSE) for more information.
