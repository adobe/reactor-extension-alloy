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

var querystring = require('querystring');

// We proxy the underlying querystring module so we can limit the API we expose.
// This allows us to more easily make changes to the underlying implementation later without
// having to worry about breaking extensions. If extensions demand additional functionality, we
// can make adjustments as needed.
module.exports = {
  parse: function(string) {
    //
    if (typeof string === 'string') {
      // Remove leading ?, #, & for some leniency so you can pass in location.search or
      // location.hash directly.
      string = string.trim().replace(/^[?#&]/, '');
    }
    return querystring.parse(string);
  },
  stringify: function(object) {
    return querystring.stringify(object);
  }
};
