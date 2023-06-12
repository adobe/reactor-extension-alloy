/*
Copyright 2023 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
*/

const defer = require("./defer");

module.exports = () => {
  let map = {};
  return {
    addTo: (keys, promise) => {
      const saved = Object.assign({}, map);
      const defersByKey = keys.reduce((acc, key) => {
        acc[key] = defer();
        map[key] = acc[key].promise;
        return acc;
      }, {});
      promise
        .then(pairs => {
          const newValuesByKey = pairs.reduce((acc, [key, value]) => {
            acc[key] ||= [];
            acc[key].push(value);
            return acc;
          }, {});
          keys.forEach(key => {
            (saved[key] || Promise.resolve([])).then(values => {
              defersByKey[key].resolve([
                ...values,
                ...(newValuesByKey[key] || [])
              ]);
            });
          });
        })
        .catch(() => {
          keys.forEach(key => {
            (saved[key] || Promise.resolve([])).then(values => {
              defersByKey[key].resolve(values);
            });
          });
        });
    },
    flushKeys: keys => {
      const promises = keys
        .map(key => map[key])
        .filter(value => value !== undefined);
      keys.forEach(key => delete map[key]);
      return Promise.all(promises).then(valueArrays =>
        [].concat(...valueArrays)
      );
    },
    flushAll: () => {
      const promises = Object.values(map);
      map = {};
      return Promise.all(promises).then(valueArrays =>
        [].concat(...valueArrays)
      );
    }
  };
};
