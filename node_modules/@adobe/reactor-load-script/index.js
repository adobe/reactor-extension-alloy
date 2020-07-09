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

var Promise = require('@adobe/reactor-promise');

var getPromise = function(url, script) {
  return new Promise(function(resolve, reject) {
    script.onload = function() {
      resolve(script);
    };

    script.onerror = function() {
      reject(new Error('Failed to load script ' + url));
    };
  });
};

module.exports = function(url) {
  var script = document.createElement('script');
  script.src = url;
  script.async = true;

  var promise = getPromise(url, script);

  document.getElementsByTagName('head')[0].appendChild(script);
  return promise;
};

