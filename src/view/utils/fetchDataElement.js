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

import fetchFromReactor from "./fetchFromReactor";
import UserReportableError from "../errors/userReportableError";

export const testDataVariable1 = {
  id: "DE1",
  attributes: {
    name: "Test data variable 1",
    delegate_descriptor_id: "adobe-alloy::dataElements::variable",
    settings: JSON.stringify({
      cacheId: "7b2c068c-6c4c-44bd-b9ad-35a15b7c1953",
      sandbox: {
        name: "prod"
      },
      schema: {
        id:
          "https://ns.adobe.com/unifiedjsqeonly/schemas/8f9fc4c28403e4428bbe7b97436322c44a71680349dfd489",
        version: "1.2"
      }
    })
  }
};
export const testDataVariable2 = {
  id: "DE2",
  attributes: {
    name: "Test data variable 2",
    delegate_descriptor_id: "adobe-alloy::dataElements::variable",
    settings: JSON.stringify({
      cacheId: "7b2c0687b2c068cc-6c4c-44bd-b9ad-35a15b7c1954",
      sandbox: {
        name: "prod"
      },
      schema: {
        id:
          "https://ns.adobe.com/unifiedjsqeonly/schemas/8f9fc4c28403e4428bbe7b97436322c44a71680349dfd489",
        version: "1.2"
      }
    })
  }
};
export const testDataVariable3 = {
  id: "DE3",
  attributes: {
    name: "Test data variable 3",
    delegate_descriptor_id: "adobe-alloy::dataElements::variable",
    settings: JSON.stringify({
      cacheId: "7b2c0687b2c068cc-6c4c-44bd-b9ad-35a15b7c1955",
      solutions: ["analytics", "target"]
    })
  }
};
const fetchDataElement = async ({ orgId, imsAccess, dataElementId }) => {
  let parsedResponse;
  try {
    parsedResponse = await fetchFromReactor({
      orgId,
      imsAccess,
      path: `/data_elements/${dataElementId}`
    });
  } catch (e) {
    if (e.name === "AbortError") {
      throw e;
    }
    if (dataElementId === "DE1") {
      parsedResponse = { parsedBody: { data: testDataVariable1 } };
    } else if (dataElementId === "DE2") {
      parsedResponse = { parsedBody: { data: testDataVariable2 } };
    } else if (dataElementId === "DE3") {
      parsedResponse = { parsedBody: { data: testDataVariable3 } };
    } else {
      throw new UserReportableError("Failed to load data element.", {
        originatingError: e
      });
    }
  }

  const {
    id,
    attributes: { name, settings }
  } = parsedResponse.parsedBody.data;
  return { id, name, settings: JSON.parse(settings) };
};

export default fetchDataElement;
