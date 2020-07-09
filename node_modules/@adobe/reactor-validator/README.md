# Launch Extension Validator

[![npm (scoped)](https://img.shields.io/npm/v/@adobe/reactor-validator.svg?style=flat)](https://www.npmjs.com/package/@adobe/reactor-validator)

Launch, by Adobe, is a next-generation tag management solution enabling simplified deployment of marketing technologies. For more information regarding Launch, please visit our [product website](http://www.adobe.com/enterprise/cloud-platform/launch.html).

The extension validator helps extension developers validate that an extension package is well-structured. Namely, it verifies that:

1. The extension has a [manifest](https://developer.adobelaunch.com/guides/extensions/extension-manifest/) (`extension.json`) matching the expected structure.
2. All referenced directories and files exist at the specified locations within the extension directory. 

For more information about developing an extension for Launch, please visit our [extension development guide](https://developer.adobelaunch.com/guides/extensions/).  

## Usage

This tool is currently integrated and automatically executed within other tools that extension developers typically use, namely the [Launch Extension Sandbox](https://github.com/Adobe-Marketing-Cloud/reactor-sandbox) and [Launch Extension Packager](https://github.com/Adobe-Marketing-Cloud/reactor-packager). This is likely sufficient for most extension developers.

### Running the Validator from the Command Line

Before running the validator, you must first have [Node.js](https://nodejs.org/en/) installed on your computer. Your npm version (npm comes bundled with Node.js) will need to be at least 5.2.0. You can check the installed version by running the following command from a command line:
                                                                                                      
```
npm -v
```

Once Node.js is installed, run the validator by executing the following command from the command line within your extension's directory:

```
npx @adobe/reactor-validator
```


### Incorporating the Validator into Other Tools


If you would like to incorporate the validator into your own extension development tools, you may do so by first installing the validator as a dependency inside your tool's project:

```
npm i @adobe/reactor-validator
```

Once it has been installed as a dependency, import the validator and pass it an extension manifest object (this is the object exported from an `extension.json` file). If the value returned from the validator is `undefined`, then the extension appears to be well-formed; otherwise, the value will contain a description of the issue that was encountered. 

```javascript
const validate = require('@adobe/reactor-validator');
const error = validate(require('./extension.json'));

// Will be undefined if no error was found.
console.log(error);
```

## Contributing

Contributions are welcomed! Read the [Contributing Guide](CONTRIBUTING.md) for more information.

To get started:

1. Install [node.js](https://nodejs.org/).
3. Clone the repository.
4. After navigating into the project directory, install project dependencies by running `npm install`.

To manually test your changes, first run the following command from the sandbox tool directory:

```
npm link
```

Then, in a directory containing an extension (any extension you would like to use for testing), run the following command:

```
npx @adobe/reactor-validator
```

Npx will execute the sandbox tool using your locally linked code rather than the code published on the public npm repository.

## Licensing

This project is licensed under the Apache V2 License. See [LICENSE](LICENSE) for more information.

