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

const defer = require("@adobe/alloy/libEs6/utils/defer");
const flatMap = require("@adobe/alloy/libEs6/utils/flatMap");

module.exports = () => {
  const promisesByScope = {};

  return {
    updateScopes(scopes, promise) {
      const savedPropositionsByScope = Object.assign({}, promisesByScope);
      const defersByScope = scopes.reduce((memo, scope) => {
        memo[scope] = defer();
        promisesByScope[scope] = memo[scope].promise;
        return memo;
      }, {});
      promise
        .then(propositions => {
          const propositionsByScope = {};
          propositions.forEach(proposition => {
            propositionsByScope[proposition.scope] ||= [];
            propositionsByScope[proposition.scope].push(proposition);
          });
          scopes.forEach(scope => {
            defersByScope[scope].resolve(propositionsByScope[scope] || []);
          });
        })
        .catch(() => {
          scopes.forEach(scope => {
            defersByScope[scope].resolve(savedPropositionsByScope[scope]);
          });
        });
    },
    getPropositionsForScopes(scopes) {
      return Promise.all(scopes.map(scope => promisesByScope[scope])).then(
        propositions => {
          return flatMap(propositions, proposition => proposition);
        }
      );
    },
    getAllPropositions() {
      return Promise.all(
        Object.keys(promisesByScope).map(key => promisesByScope[key])
      ).then(propositions => {
        return flatMap(propositions, proposition => proposition);
      });
    }
  };
};
