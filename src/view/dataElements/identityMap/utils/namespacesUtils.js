/*
Copyright 2022 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
*/

import fetchSandboxes from "../../xdmObject/helpers/fetchSandboxes";
import fetchNamespaces from "./fetchNamespaces";

const isNotECID = namespace => {
  return namespace.code !== "ECID";
};

const getNamespaces = async (initInfo, sandbox) => {
  const namespaces = await fetchNamespaces({
    orgId: initInfo.company.orgId,
    imsAccess: initInfo.tokens.imsAccess,
    sandbox
  });

  return namespaces || [];
};

const getDefaultSandbox = sandboxes => {
  return sandboxes.find(sandbox => sandbox.isDefault);
};

const getNamespacesForSandboxesPromises = async (initInfo, sandboxes) => {
  if (sandboxes.size > 0) {
    const promises = [];
    sandboxes.forEach(sandbox => {
      promises.push(getNamespaces(initInfo, sandbox));
    });
    return promises;
  }

  return fetchSandboxes({
    orgId: initInfo.company.orgId,
    imsAccess: initInfo.tokens.imsAccess
  })
    .then(result => {
      return getDefaultSandbox(result.results);
    })
    .then(sandbox => getNamespaces(initInfo, sandbox.name));
};

const dedupeBy = (arr, keyFunc) => {
  const set = new Set();

  return arr.filter(e => {
    const key = keyFunc(e);

    if (set.has(key)) {
      return false;
    }

    set.add(key);

    return true;
  });
};
const getExtensionSandboxes = initInfo => {
  const extensionSandboxes = new Set();

  const sandbox = initInfo?.extensionSettings?.instances[0]?.sandbox;
  const stagingSandbox =
    initInfo?.extensionSettings?.instances[0]?.stagingSandbox;
  const developmentSandbox =
    initInfo?.extensionSettings?.instances[0]?.developmentSandbox;

  if (sandbox) {
    extensionSandboxes.add(sandbox);
  }
  if (stagingSandbox) {
    extensionSandboxes.add(stagingSandbox);
  }
  if (developmentSandbox) {
    extensionSandboxes.add(developmentSandbox);
  }

  return extensionSandboxes;
};

export const getNamespacesOptions = async initInfo => {
  const extensionSandboxes = getExtensionSandboxes(initInfo);

  try {
    const namespaces = await Promise.all(
      await getNamespacesForSandboxesPromises(initInfo, extensionSandboxes)
    ).then(result => {
      const allNamespaces = result.flatMap(arr => arr);

      return dedupeBy(allNamespaces, e => e.code);
    });

    if (namespaces.length > 0) {
      return namespaces
        .filter(isNotECID)
        .sort((first, second) => first.name.localeCompare(second.name));
    }
    return [];
  } catch (e) {
    return [];
  }
};

export const findNamespace = (namespaces, namespaceCode) => {
  return namespaces.find(
    namespace => namespace.code.toUpperCase() === namespaceCode.toUpperCase()
  );
};
