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

module.exports = ({ instanceManager, propositionCache }) => settings => {
  const { instanceName, propositions, metadata, scopes } = settings;

  const instance = instanceManager.getInstance(instanceName);
  if (!instance) {
    throw new Error(
      `Failed to apply propositions for instance "${instanceName}". No instance was found with this name.`
    );
  }

  let propositionsToApply = propositions;
  if (propositions === "all") {
    propositionsToApply = propositionCache.getAllActivePropositions();
  } else if (propositions === "scoped") {
    propositionsToApply = propositionCache.getScopedActivePropositions(scopes);
  }

  return instance("applyPropositions", {
    propositions: propositionsToApply,
    metadata
  });
};
