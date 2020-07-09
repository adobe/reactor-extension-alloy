/*
Copyright 2019 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
*/

const fetch = require('node-fetch');
const jwt = require('jsonwebtoken');
const FormData = require('form-data');

async function authorize(options) {
  let {
    clientId,
    technicalAccountId,
    orgId,
    clientSecret,
    privateKey,
    passphrase = '',
    metaScopes,
    ims = 'https://ims-na1.adobelogin.com'
  } = options;

  const errors = [];
  !clientId ? errors.push('clientId') : '';
  !technicalAccountId ? errors.push('technicalAccountId') : '';
  !orgId ? errors.push('orgId') : '';
  !clientSecret ? errors.push('clientSecret') : '';
  !privateKey ? errors.push('privateKey') : '';
  !metaScopes || metaScopes.length === 0 ? errors.push('metaScopes') : '';
  if (errors.length > 0) {
    return Promise.reject(
      new Error(`Required parameter(s) ${errors.join(', ')} are missing`)
    );
  }

  if (metaScopes.constructor !== Array) {
    metaScopes = metaScopes.split(',');
  }

  const jwtPayload = {
    exp: Math.round(300 + Date.now() / 1000),
    iss: orgId,
    sub: technicalAccountId,
    aud: `${ims}/c/${clientId}`
  };

  for (let i = 0; i < metaScopes.length; i++) {
    if (metaScopes[i].indexOf('https') > -1) {
      jwtPayload[metaScopes[i]] = true;
    } else {
      jwtPayload[`${ims}/s/${metaScopes[i]}`] = true;
    }
  }

  let token;
  try {
    token = jwt.sign(
      jwtPayload,
      { key: privateKey, passphrase },
      { algorithm: 'RS256' }
    );
  } catch (tokenError) {
    return Promise.reject(tokenError);
  }

  const form = new FormData();
  form.append('client_id', clientId);
  form.append('client_secret', clientSecret);
  form.append('jwt_token', token);

  const postOptions = {
    method: 'POST',
    body: form,
    headers: form.getHeaders()
  };

  return fetch(`${ims}/ims/exchange/jwt/`, postOptions)
    .then(res => res.json())
    .then(json => {
      const { access_token, error, error_description } = json;
      if (!access_token) {
        if (error && error_description) {
          return Promise.reject(new Error(`${error}: ${error_description}`));
        } else {
          return Promise.reject(
            new Error(
              `An unknown error occurred while swapping jwt. The response is as follows: ${JSON.stringify(
                json
              )}`
            )
          );
        }
      }
      return json;
    });
}

module.exports = authorize;
