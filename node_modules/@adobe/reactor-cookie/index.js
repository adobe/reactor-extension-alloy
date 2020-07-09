/***************************************************************************************
 * (c) 2017 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 ****************************************************************************************/
'use strict';

var cookie = require('js-cookie');

// js-cookie has other methods that we haven't exposed here. By limiting the exposed API,
// we have a little more flexibility to change the underlying implementation later. If clear
// use cases come up for needing the other methods js-cookie exposes, we can re-evaluate whether
// we want to expose them here.
module.exports = {
  get: cookie.get,
  set: cookie.set,
  remove: cookie.remove
};
