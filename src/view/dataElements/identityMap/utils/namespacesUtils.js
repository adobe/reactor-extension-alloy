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

import fetchNamespaces from "./fetchNamespaces";

const isNotECID = namespace => {
  return namespace.code !== "ECID";
};

export const getNamespaces = async (initInfo, sandbox) => {
  const namespaces = await fetchNamespaces({
    orgId: initInfo.company.orgId,
    imsAccess: initInfo.tokens.imsAccess,
    sandbox
  });

  if (namespaces.length > 0) {
    return namespaces
      .filter(isNotECID)
      .sort((first, second) => first.name.localeCompare(second.name));
  }
  return [];
};

export const findNamespace = (namespaces, namespaceCode) => {
  return namespaces.find(
    namespace => namespace.code.toUpperCase() === namespaceCode.toUpperCase()
  );
};
