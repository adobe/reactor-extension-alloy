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

// delegateDescriptorId would be something like this: "adobe-alloy::dataElements::object-variable"
const fetchDataElements = async ({
  orgId,
  imsAccess,
  propertyId,
  signal,
  delegateDescriptorIds
}) => {
  let parsedResponse;

  const matchingDataElements = [];
  let page = 1;

  // eslint-disable-next-line no-constant-condition
  while (true) {
    try {
      // eslint-disable-next-line no-await-in-loop
      parsedResponse = await fetchFromReactor({
        orgId,
        imsAccess,
        path: `/properties/${propertyId}/data_elements`,
        params: `page[size]=100&page[number]=${page}`,
        signal
      });
    } catch (e) {
      if (e.name === "AbortError") {
        throw e;
      }

      /*
      throw new UserReportableError("Failed to load data elements.", {
        originatingError: e
      });
      */
    }

    parsedResponse.parsedBody.data
      .filter(({ attributes: { delegate_descriptor_id: other } }) =>
        delegateDescriptorIds.includes(other)
      )
      .map(({ attributes: { name, settings } }) => ({
        name,
        settings: JSON.parse(settings)
      }))
      .forEach(dataElement => matchingDataElements.push(dataElement));

    if (parsedResponse.parsedBody.meta.pagination.total_pages <= page) {
      break;
    }
    page += 1;
  }

  matchingDataElements.push(
    {
      name: "XDM Variable 1",
      settings: {
        schemaType: "xdm",
        sandbox: "prod",
        schemaId:
          "https://ns.adobe.com/unifiedjsqeonly/schemas/8f9fc4c28403e4428bbe7b97436322c44a71680349dfd489",
        schemaVersion: "1.4",
        cacheId: "3b74bab6-8563-459d-b7e3-c75bea8f5c4d"
      }
    },
    {
      name: "XDM Variable 2",
      settings: {
        schemaType: "xdm",
        sandbox: "prod",
        schemaId:
          "https://ns.adobe.com/unifiedjsqeonly/schemas/8f9fc4c28403e4428bbe7b97436322c44a71680349dfd489",
        schemaVersion: "1.4",
        cacheId: "777c1327-dfe4-4a03-a4d3-6a35cb724d4f"
      }
    },
    {
      name: "Data variable 1",
      settings: {
        schemaType: "object",
        cacheId: "a1bc4d62-80c0-4a50-9c3f-8c7fcd176c33"
      }
    },
    {
      name: "Data variable 2",
      settings: {
        schemaType: "object",
        cacheId: "5b1fc1fc-ba06-469a-b631-97392d03183b"
      }
    }
  );

  matchingDataElements.sort((a, b) =>
    a.name.localeCompare(b.name, "en", { sensitivity: "base" })
  );

  return matchingDataElements;
};

export default fetchDataElements;
