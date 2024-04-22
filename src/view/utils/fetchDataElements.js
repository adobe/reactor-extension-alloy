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

// EXTENSION_NAME will be replace with this extension's name
const DELEGATE_DESCRIPTOR_ID = "__EXTENSION_NAME__::dataElements::variable";

const fetchDataElements = async ({
  orgId,
  imsAccess,
  propertyId,
  search = "",
  page = 1,
  signal
}) => {
  const allResults = [];
  let nextPage = page;
  while (allResults.length < 2 && nextPage) {
    const params = {
      "page[size]": "100",
      "page[number]": `${nextPage}`
    };
    if (search !== "") {
      params["filter[name]"] = `CONTAINS ${search}`;
    }

    let parsedResponse;
    try {
      // eslint-disable-next-line no-await-in-loop
      parsedResponse = await fetchFromReactor({
        orgId,
        imsAccess,
        path: `/properties/${propertyId}/data_elements`,
        params: new URLSearchParams(params),
        signal
      });
    } catch (e) {
      if (e.name === "AbortError") {
        throw e;
      }
      /*
      return {
        results: [
          {
            id: "DE6",
            name: "Test XDM variable 6",
            settings: {
              cacheId: "7b2c068c-6c4c-44bd-b9ad-35a15b7c1956",
              sandbox: {
                name: "prod"
              },
              schema: {
                id: "https://ns.adobe.com/unifiedjsqeonly/schemas/8f9fc4c28403e4428bbe7b97436322c44a71680349dfd489",
                version: "1.2"
              }
            }
          },
          {
            id: "SDE1",
            name: "Test data variable 1 (both)",
            settings: {
              cacheId: "7b2c068c-6c4c-44bd-b9ad-35a15b7c1957",
              solutions: ["analytics", "target"]
            }
          },
          {
            id: "SDE2",
            name: "Test data variable 2 (analytics only)",
            settings: {
              cacheId: "7b2c068c-6c4c-44bd-b9ad-35a15b7c1958",
              solutions: ["analytics"]
            }
          },
          {
            id: "SDE3",
            name: "Test data variable 3 (target only)",
            settings: {
              cacheId: "7b2c068c-6c4c-44bd-b9ad-35a15b7c1959",
              solutions: ["target"]
            }
          }
        ],
        nextPage: null
      };
      */

      throw new UserReportableError("Failed to load data elements.", {
        originatingError: e
      });
    }

    parsedResponse.parsedBody.data
      .filter(
        ({ attributes: { delegate_descriptor_id: other } }) =>
          DELEGATE_DESCRIPTOR_ID === other
      )
      .map(({ id, attributes: { name, settings } }) => ({
        id,
        name,
        settings: JSON.parse(settings)
      }))
      .forEach(result => allResults.push(result));

    nextPage = parsedResponse.parsedBody.meta.pagination.next_page;
  }
  return { results: allResults, nextPage };
};

export default fetchDataElements;
