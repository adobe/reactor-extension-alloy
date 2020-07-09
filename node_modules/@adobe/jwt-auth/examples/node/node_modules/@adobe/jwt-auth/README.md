# jwt-auth

Retrieve an Adobe bearer token via the JWT path

## Goals

Instead of every developer who wants to use the JWT Auth flow to retrieve an auth token from Adobe having to write their own implementation of this flow this package is intended to replace this need with one method call.

### Installation

Instructions for how to download/install the code onto your machine.

Example:

```
npm install @adobe/jwt-auth
```

### Common Usage

Usage instructions for your code.

Promise based example:

```javascript
const auth = require('@adobe/jwt-auth');

auth(config)
  .then(token => console.log(token))
  .catch(error => console.log(error));
```

Async/Await based example:

```javascript
const auth = require('@adobe/jwt-auth');

let token = await auth(config);
console.log(token);
```

#### Config object

The config object is where you pass in all the required and optional parameters to the `auth` call.

| parameter          | integration name     | required | type                              | default                        |
| ------------------ | -------------------- | -------- | --------------------------------- | ------------------------------ |
| clientId           | API Key (Client ID)  | true     | String                            |                                |
| technicalAccountId | Technical account ID | true     | String                            |                                |
| orgId              | Organization ID      | true     | String                            |                                |
| clientSecret       | Client secret        | true     | String                            |                                |
| privateKey         |                      | true     | String                            |                                |
| metaScopes         |                      | true     | Comma separated Sting or an Array |                                |
| ims                |                      | false    | String                            | https://ims-na1.adobelogin.com |

#### Example

```javascript
const auth = require('@adobe/jwt-auth');
const fs = require('fs');

const config = {
  clientId: 'asasdfasf',
  clientSecret: 'aslfjasljf-=asdfalasjdf==asdfa',
  technicalAccountId: 'asdfasdfas@techacct.adobe.com',
  orgId: 'asdfasdfasdf@AdobeOrg',
  metaScopes: ['ent_dataservices_sdk']
};
config.privateKey = fs.readFileSync('private.key');

auth(config)
  .then(token => console.log(token))
  .catch(error => console.log(error));
```

### Contributing

Contributions are welcomed! Read the [Contributing Guide](.github/CONTRIBUTING.md) for more information.

### Licensing

This project is licensed under the Apache V2 License. See [LICENSE](LICENSE) for more information.
