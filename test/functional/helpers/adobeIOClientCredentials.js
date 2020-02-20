/*
Copyright 2020 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
*/

/*
Copyright 2020 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
*/

// This is a commonjs module instead of an ES6 module because it's also used by a node script
// outside of TestCafe.
const fs = require("fs");
const chalk = require("chalk");

const CLIENT_SECRET_ENV_VAR_NAME = "EDGE_E2E_CLIENT_SECRET";
const PRIVATE_KEY_FILE_ENV_VAR_NAME = "EDGE_E2E_PRIVATE_KEY_FILE";

const clientSecret = process.env[CLIENT_SECRET_ENV_VAR_NAME];
const privateKeyPath = process.env[PRIVATE_KEY_FILE_ENV_VAR_NAME];

let credentials;

if (clientSecret && privateKeyPath) {
  let privateKey;
  try {
    privateKey = fs.readFileSync(privateKeyPath);
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(
      chalk.redBright(
        `Failed to read private key at ${privateKeyPath}. Please ensure the value provided in the ${PRIVATE_KEY_FILE_ENV_VAR_NAME} environment variable is correct.`
      )
    );
  }

  if (privateKey) {
    credentials = {
      clientId: "4d865632c8004ba1925557eb83cd56f2",
      technicalAccountId: "22604A385E6697310A495F8F@techacct.adobe.com",
      orgId: "334F60F35E1597910A495EC2@AdobeOrg",
      clientSecret,
      privateKey,
      metaScopes: ["https://ims-na1.adobelogin.com/s/ent_dataservices_sdk"],
      ims: "https://ims-na1.adobelogin.com"
    };
  }
}

module.exports = credentials;
