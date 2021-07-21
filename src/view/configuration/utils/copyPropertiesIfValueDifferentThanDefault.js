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
/**
 * Copies properties from one object to another, but only if the value
 * doesn't match the default value.
 * @param {Object} options
 * @param {Object} options.toObj Object to which properties should be copied.
 * @param {Object} options.fromObj Object from which properties should be copied.
 * @param {Object} options.defaultsObj Default values for each property.
 * @param {Array} options.keys The keys of the properties that should be attempted
 * to be copied.
 */
export default ({ toObj, fromObj, defaultsObj, keys }) => {
  keys.forEach(key => {
    if (fromObj[key] !== defaultsObj[key]) {
      toObj[key] = fromObj[key];
    }
  });
};
