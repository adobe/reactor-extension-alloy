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

module.exports = ({ sendEventCallbackStorage }) => {
  let activePropositions = [];

  sendEventCallbackStorage.add(({ propositions }) => {
    // TODO: figure out what to put here... Should it just be for requests that
    // are top of page or should it be for requests that include "__view__" with
    // renderDecisions == false?... or just "decisioning.propositionsFetch" events?
    activePropositions = propositions;
  });

  return {
    get() {
      return activePropositions;
    }
  };
};
