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

const createAsyncMapOfArrays = require("./utils/createAsyncMapOfArrays");
const createMapOfArrays = require("./utils/createMapOfArrays");

const normalizePath = (path = "/") => {
  let end = path.length;
  while (end > 0 && "/".indexOf(path.charAt(end - 1)) !== -1) {
    end -= 1;
  }
  return path.substring(0, end) || "/";
};

module.exports = ({ getPageLocation }) => {
  const rendered = createAsyncMapOfArrays();
  const active = createMapOfArrays();
  let firstRequest = true;

  const getPageWideSurface = () => {
    const location = getPageLocation();
    const host = location.host.toLowerCase();
    const path = location.pathname;
    return `web://${host}${normalizePath(path)}`;
  };

  return {
    updateScopes(scopes, promise) {
      let allScopes = scopes;
      if (firstRequest) {
        allScopes = [...scopes, "__view__", getPageWideSurface()];
        firstRequest = false;
      }

      // Immediately update the rendered cache with promises for these scopes. That way if
      // the same scopes are requested to send display notifications, they will wait for
      // this promise to resolve.
      rendered.addTo(
        allScopes,
        promise.then(propositions =>
          propositions
            .filter(proposition => proposition.renderAttempted)
            .map(proposition => [proposition.scope, proposition])
        )
      );
      // When the promise resolves, update the active cache with the propositions.
      promise.then(propositions => {
        active.setPairs(
          allScopes,
          propositions.map(proposition => [proposition.scope, proposition])
        );
      });
    },
    flushScopedRenderedPropositions(scopes) {
      return rendered.flushKeys(scopes);
    },
    flushAllRenderedPropositions() {
      return rendered.flushAll();
    },
    getScopedActivePropositions(scopes) {
      return active.getKeys(scopes);
    },
    getAllActivePropositions() {
      return active.getAll();
    }
  };
};
