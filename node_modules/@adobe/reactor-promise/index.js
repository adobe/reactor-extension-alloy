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

// For building Turbine we are using Rollup. For running the turbine tests we are using
// Karma + Webpack. You need to specify the default import when using promise-polyfill`
// with Webpack 2+. We need `require('promise-polyfill').default` for running the tests
// and `require('promise-polyfill')` for building Turbine.
module.exports =
  (typeof window !== 'undefined' && window.Promise) ||
  (typeof global !== 'undefined' && global.Promise) ||
  require('promise-polyfill').default ||
  require('promise-polyfill');
