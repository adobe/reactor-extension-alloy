[![Version](https://img.shields.io/npm/v/@adobe/jwt-auth.svg)](https://npmjs.org/package/@adobe/jwt-auth)
[![Downloads/week](https://img.shields.io/npm/dw/@adobe/jwt-auth.svg)](https://npmjs.org/package/@adobe/jwt-auth)
[![Build Status](https://travis-ci.com/adobe/jwt-auth.svg?branch=master)](https://travis-ci.com/adobe/jwt-auth)
[![codecov](https://codecov.io/gh/adobe/jwt-auth/branch/master/graph/badge.svg)](https://codecov.io/gh/adobe/jwt-auth)
[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0) [![Greenkeeper badge](https://badges.greenkeeper.io/adobe/jwt-auth.svg)](https://greenkeeper.io/)
[![Language grade: JavaScript](https://img.shields.io/lgtm/grade/javascript/g/adobe/jwt-auth.svg?logo=lgtm&logoWidth=18)](https://lgtm.com/projects/g/adobe/jwt-auth/context:javascript)

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
  .then(tokenResponse => console.log(tokenResponse))
  .catch(error => console.log(error));
```

Async/Await based example:

```javascript
const auth = require('@adobe/jwt-auth');

let tokenResponse = await auth(config);
console.log(tokenResponse);
```

or (if you don't care about the other properties in the token response)

```javascript
const auth = require('@adobe/jwt-auth');

let { access_token } = await auth(config);
console.log(access_token);
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
| passphrase         |                      | false    | String                            |                                |
| metaScopes         |                      | true     | Comma separated Sting or an Array |                                |
| ims                |                      | false    | String                            | https://ims-na1.adobelogin.com |

In order to determine which **metaScopes** you need to register for you can look them up by product in this [handy table](https://www.adobe.io/authentication/auth-methods.html#!AdobeDocs/adobeio-auth/master/JWT/Scopes.md).

For instance if you need to be authenticated to call API's for both GDPR and User Management you would [look them up](https://www.adobe.io/authentication/auth-methods.html#!AdobeDocs/adobeio-auth/master/JWT/Scopes.md) and find that they are:

- GDPR: https://ims-na1.adobelogin.com/s/ent_gdpr_sdk
- User Management: https://ims-na1.adobelogin.com/s/ent_user_sdk

They you would create an array of **metaScopes** as part of the config object. For instance:

```javascript
const config = {
  clientId: 'asasdfasf',
  clientSecret: 'aslfjasljf-=asdfalasjdf==asdfa',
  technicalAccountId: 'asdfasdfas@techacct.adobe.com',
  orgId: 'asdfasdfasdf@AdobeOrg',
  metaScopes: [
    'https://ims-na1.adobelogin.com/s/ent_gdpr_sdk',
    'https://ims-na1.adobelogin.com/s/ent_user_sdk'
  ]
};
```

However, if you omit the IMS url the package will automatically add it for you when making the call to generate the JWT. For example:

```javascript
const config = {
  clientId: 'asasdfasf',
  clientSecret: 'aslfjasljf-=asdfalasjdf==asdfa',
  technicalAccountId: 'asdfasdfas@techacct.adobe.com',
  orgId: 'asdfasdfasdf@AdobeOrg',
  metaScopes: ['ent_gdpr_sdk', 'ent_user_sdk']
};
```

This is the recommended approach.

#### Response Object

The response object contains three keys:

* `token_type`
* `access_token`
* `expires_in`

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
