/*
Copyright 2019 Adobe
All Rights Reserved.

NOTICE: Adobe permits you to use, modify, and distribute this file in
accordance with the terms of the Adobe license agreement accompanying
it. If you have received this file from a source other than Adobe,
then your use, modification, or distribution of it requires the prior
written permission of Adobe.
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
    metaScopes,
    ims = 'https://ims-na1.adobelogin.com'
  } = options;

  const errors = [];
  !clientId ? errors.push('clientId') : '';
  !technicalAccountId ? errors.push('technicalAccountId') : '';
  !orgId ? errors.push('orgId') : '';
  !clientSecret ? errors.push('clientSecret') : '';
  !privateKey ? errors.push('privateKey') : '';
  (!metaScopes || metaScopes.length === 0) ? errors.push('metaScopes') : '';
  if (errors.length > 0) {
    return Promise.reject(`Required parameter(s) ${errors.join(', ')} are missing`);
  }
  
  if(metaScopes.constructor!==Array)
  {
    metaScopes=metaScopes.split(',');
  }  

  const jwtPayload = {
    exp: Math.round(87000 + Date.now() / 1000),
    iss: orgId,
    sub: technicalAccountId,
    aud: `${ims}/c/${clientId}`
  };

  for (let i = 0; i < metaScopes.length; i++) {
    if (metaScopes.indexOf('https') > -1) {
      jwtPayload[metaScopes[i]] = true;
    } else {
      jwtPayload[`${ims}/s/${metaScopes[i]}`] = true;
    }
  }

  let token;
  try {
    token = jwt.sign(jwtPayload, privateKey, { algorithm: 'RS256' });
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

  return fetch(`${ims}/ims/exchange/jwt/`, postOptions).then(res => res.json());
}

module.exports = authorize;
