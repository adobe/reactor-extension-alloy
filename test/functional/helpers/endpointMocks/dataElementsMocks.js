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

import { RequestMock } from "testcafe";
import responseHeaders from "./responseHeaders";

const DATA_ELEMENTS_REGEX = /properties\/PRabcd\/data_elements/;
const DATA_ELEMENTS_FIRST_PAGE_REGEX = /properties\/PRabcd\/data_elements?.*page%5Bnumber%5D=1/;
const DATA_ELEMENTS_SECOND_PAGE_REGEX = /properties\/PRabcd\/data_elements?.*page%5Bnumber%5D=2/;

const testDataVariable1 = {
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
const testDataVariable2 = {
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
        version: "1.1"
      }
    })
  }
};
const otherDataElement1 = {
  id: "DE3",
  attributes: {
    name: "Other data element 1",
    delegate_descriptor_id: "core::dataElements::constant",
    settings: '{"value":"aaaa"}'
  }
};
const testDataVariable3 = {
  id: "DE3",
  attributes: {
    name: "Test data variable 3",
    delegate_descriptor_id: "adobe-alloy::dataElements::variable",
    settings: JSON.stringify({
      cacheId: "7b2c068c-6c4c-44bd-b9ad-35a15b7c1955",
      sandbox: {
        name: "prod"
      },
      schema: {
        id: "sch123",
        version: "1.0"
      }
    })
  }
};
const testDataVariable4 = {
  id: "DE4",
  attributes: {
    name: "Test data variable 4",
    delegate_descriptor_id: "adobe-alloy::dataElements::variable",
    settings: JSON.stringify({
      cacheId: "7b2c068c-6c4c-44bd-b9ad-35a15b7c1956",
      sandbox: {
        name: "prod"
      },
      schema: {
        id: "sch456",
        version: "1.0"
      }
    })
  }
};
const testDataVariable5 = {
  id: "DE4",
  attributes: {
    name: "Test data variable 5",
    delegate_descriptor_id: "adobe-alloy::dataElements::variable",
    settings: JSON.stringify({
      cacheId: "7b2c068c-6c4c-44bd-b9ad-35a15b7c1957",
      sandbox: {
        name: "prod"
      },
      schema: {
        id: "sch789",
        version: "1.0"
      }
    })
  }
};
const testDataVariable6 = {
  id: "DE4",
  attributes: {
    name: "Test data variable 6",
    delegate_descriptor_id: "adobe-alloy::dataElements::variable",
    settings: JSON.stringify({
      cacheId: "7b2c068c-6c4c-44bd-b9ad-35a15b7c1958",
      sandbox: {
        name: "prod"
      },
      schema: {
        id: "sch10",
        version: "1.0"
      }
    })
  }
};
export const notFound = RequestMock()
  .onRequestTo({ url: DATA_ELEMENTS_REGEX, method: "GET" })
  .respond({}, 404, responseHeaders);

export const single = RequestMock()
  .onRequestTo({ url: DATA_ELEMENTS_REGEX, method: "GET" })
  .respond(
    {
      data: [otherDataElement1, testDataVariable1],
      meta: {
        pagination: {
          current_page: 1,
          next_page: null,
          prev_page: null,
          total_pages: 1,
          total_count: 2
        }
      }
    },
    200,
    responseHeaders
  );

export const none = RequestMock()
  .onRequestTo({ url: DATA_ELEMENTS_FIRST_PAGE_REGEX, method: "GET" })
  .respond(
    {
      data: [otherDataElement1],
      meta: {
        pagination: {
          current_page: 1,
          next_page: null,
          prev_page: null,
          total_pages: 1,
          total_count: 1
        }
      }
    },
    200,
    responseHeaders
  );

export const noneWithNextPage = RequestMock()
  .onRequestTo({ url: DATA_ELEMENTS_FIRST_PAGE_REGEX, method: "GET" })
  .respond(
    {
      data: [otherDataElement1],
      meta: {
        pagination: {
          current_page: 1,
          next_page: 2
        }
      }
    },
    200,
    responseHeaders
  );

export const secondPageWithOne = RequestMock()
  .onRequestTo({ url: DATA_ELEMENTS_SECOND_PAGE_REGEX, method: "GET" })
  .respond(
    {
      data: [testDataVariable1],
      meta: {
        pagination: {
          current_page: 2,
          next_page: null
        }
      }
    },
    200,
    responseHeaders
  );

export const multiple = RequestMock()
  .onRequestTo({ url: DATA_ELEMENTS_REGEX, method: "GET" })
  .respond(
    {
      data: [
        testDataVariable1,
        testDataVariable2,
        testDataVariable3,
        testDataVariable4,
        testDataVariable5,
        testDataVariable6
      ],
      meta: {
        pagination: {
          current_page: 1,
          next_page: null
        }
      }
    },
    200,
    responseHeaders
  );
