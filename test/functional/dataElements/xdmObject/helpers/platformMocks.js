import { RequestMock } from "testcafe";

const responseHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, content-type, content-range, pragma, if-match, if-modified-since, range, x-gw-ims-org-id, x-api-key, x-model-name, x-admin,ticketId, origin, accept, emailToNotify, x-products, x-auditor-ims-org-id,x-sandbox-name,x-sandbox-id,x-ups-search-version"
};

const SANDBOXES_ENDPOINT_REGEX = /sandbox-management/;
const SCHEMAS_ENDPOINT_REGEX = /\/schemaregistry\/tenant\/schemas(\?|$)/;
const SCHEMA_ENDPOINT_REGEX = /\/schemaregistry\/tenant\/schemas\/.+/;
const IDENTITIES_ENDPOINT_REGEX = /\/data\/core\/idnamespace\/identities(\?|$)/;

export const sandboxesUnauthorized = RequestMock()
  .onRequestTo(SANDBOXES_ENDPOINT_REGEX)
  .respond(
    {
      error_code: "401013",
      message: "Oauth token is not valid"
    },
    401,
    responseHeaders
  );

export const sandboxesUserRegionMissing = RequestMock()
  .onRequestTo(SANDBOXES_ENDPOINT_REGEX)
  .respond(
    {
      error_code: "403027",
      message: "User region is missing"
    },
    403,
    responseHeaders
  );

export const sandboxesNonJsonBody = RequestMock()
  .onRequestTo(SANDBOXES_ENDPOINT_REGEX)
  .respond("non-json body", 200, responseHeaders);

export const sandboxesEmpty = RequestMock()
  .onRequestTo(SANDBOXES_ENDPOINT_REGEX)
  .respond(
    {
      sandboxes: []
    },
    200,
    responseHeaders
  );

export const sandboxesSingleWithoutDefault = RequestMock()
  .onRequestTo(SANDBOXES_ENDPOINT_REGEX)
  .respond(
    {
      sandboxes: [
        {
          name: "testsandbox1",
          title: "Test Sandbox 1",
          type: "production",
          isDefault: false,
          region: "VA7",
          state: "active"
        }
      ]
    },
    200,
    responseHeaders
  );

export const sandboxesMultipleWithDefault = RequestMock()
  .onRequestTo(SANDBOXES_ENDPOINT_REGEX)
  .respond(
    {
      sandboxes: [
        {
          name: "testsandbox1",
          title: "Test Sandbox 1",
          type: "production",
          isDefault: false,
          region: "VA7",
          state: "active"
        },
        {
          name: "testsandbox2",
          title: "Test Sandbox 2",
          type: "production",
          isDefault: true,
          region: "VA7",
          state: "active"
        },
        {
          name: "testsandbox3",
          title: "Test Sandbox 3",
          type: "production",
          isDefault: false,
          region: "VA7",
          state: "active"
        },
        {
          name: "prod",
          title: "Test Sandbox Prod",
          type: "production",
          isDefault: false,
          region: "VA7",
          state: "active"
        }
      ]
    },
    200,
    responseHeaders
  );

export const sandboxesMultipleWithoutDefault = RequestMock()
  .onRequestTo(SANDBOXES_ENDPOINT_REGEX)
  .respond(
    {
      sandboxes: [
        {
          name: "testsandbox1",
          title: "Test Sandbox 1",
          type: "production",
          isDefault: false,
          region: "VA7",
          state: "active"
        },
        {
          name: "testsandbox2",
          title: "Test Sandbox 2",
          type: "production",
          isDefault: false,
          region: "VA7",
          state: "active"
        },
        {
          name: "testsandbox3",
          title: "Test Sandbox 3",
          type: "production",
          isDefault: false,
          region: "VA7",
          state: "active"
        },
        {
          name: "prod",
          title: "Test Sandbox Prod",
          type: "production",
          isDefault: false,
          region: "VA7",
          state: "active"
        }
      ]
    },
    200,
    responseHeaders
  );

export const schemasMetaSingle = RequestMock()
  .onRequestTo({
    url: SCHEMAS_ENDPOINT_REGEX,
    headers: {
      "x-sandbox-name": "prod"
    }
  })
  .respond(
    {
      results: [
        {
          $id: "https://ns.adobe.com/unifiedjsqeonly/schemas/sch123",
          version: "1.0",
          title: "Test Schema 1"
        }
      ],
      _page: {
        next: null
      }
    },
    200,
    responseHeaders
  );

export const schemasMetaMultiple = RequestMock()
  .onRequestTo({
    url: SCHEMAS_ENDPOINT_REGEX,
    headers: {
      "x-sandbox-name": "prod"
    }
  })
  .respond(
    {
      results: [
        {
          $id: "https://ns.adobe.com/unifiedjsqeonly/schemas/sch123",
          version: "1.0",
          title: "Test Schema 1"
        },
        {
          $id: "https://ns.adobe.com/unifiedjsqeonly/schemas/sch124",
          version: "1.0",
          title: "Test Schema 2"
        }
      ],
      _page: {
        next: null
      }
    },
    200,
    responseHeaders
  );

export const schemasMetaEmpty = RequestMock()
  .onRequestTo({
    url: SCHEMAS_ENDPOINT_REGEX,
    headers: {
      "x-sandbox-name": "alloy-test"
    }
  })
  .respond(
    {
      results: [],
      _page: {
        next: null
      }
    },
    200,
    responseHeaders
  );

export const schemasMetaPagingTitles = [
  "Ada",
  "Agnus",
  "Agnese",
  "Alyssa",
  "Amalie",
  "Ardys",
  "Aryn",
  "Arynio",
  "Bettine",
  "Cacilie",
  "Camile",
  "Caritta",
  "Cassondra",
  "Cherrita",
  "Christal",
  "Clarice",
  "Claudina",
  "Clo",
  "Concettina",
  "Corene",
  "Courtnay",
  "Danny",
  "Delilah",
  "Dorice",
  "Drucie",
  "Emma",
  "Emylee",
  "Ethel",
  "Feliza",
  "Fidelia",
  "Flo",
  "Florence",
  "Fredericka",
  "Gertrud",
  "Ginnie",
  "Glynnis",
  "Grier",
  "Gwenneth",
  "Halette",
  "Hallie",
  "Hollie",
  "Janeczka",
  "Jany",
  "Jasmina",
  "Jillayne",
  "Jobi",
  "Joleen",
  "Jordan",
  "Judy",
  "Justina",
  "Justinn",
  "Karina",
  "Karlee",
  "Kathi",
  "Katleen",
  "Kenna",
  "Kial",
  "Kirbee",
  "Lanae",
  "Laticia",
  "Lisette",
  "Lita",
  "Luci",
  "Madalyn",
  "Mady",
  "Mamie",
  "Marcelline",
  "Marguerite",
  "Mariann",
  "Marti",
  "Mary",
  "Miquela",
  "Nanete",
  "Natka",
  "Nikki",
  "Noelle",
  "Olpen",
  "Olwen",
  "Pamella",
  "Paola"
];

export const schemasMetaPagingMock = RequestMock()
  .onRequestTo({
    url: SCHEMAS_ENDPOINT_REGEX,
    headers: {
      "x-sandbox-name": "prod"
    }
  })
  .respond((req, res) => {
    const PAGE_ITEMS_LIMIT = 30;
    const url = new URL(req.url);
    const start = url.searchParams.get("start");
    // There are multiple "property" query string params. We need the one
    // used for matching the "title" property
    const titleQuery = url.searchParams
      .getAll("property")
      .find(query => query.startsWith("title"));
    const title = titleQuery ? titleQuery.split("~")[1] : null;
    const filteredTitles = schemasMetaPagingTitles.filter(
      name => !title || new RegExp(title).test(name)
    );
    const startIndex = start ? filteredTitles.indexOf(start) : 0;
    const endIndex = Math.min(
      startIndex + PAGE_ITEMS_LIMIT,
      filteredTitles.length
    );

    res.setBody({
      results: filteredTitles.slice(startIndex, endIndex).map(name => {
        return {
          $id: `https://ns.adobe.com/unifiedjsqeonly/schemas/${name}`,
          version: "1.0",
          title: name
        };
      }),
      _page: {
        next: endIndex < filteredTitles.length ? filteredTitles[endIndex] : null
      }
    });
    res.statusCode = 200;
    res.headers = responseHeaders;
  });

export const schema = RequestMock()
  .onRequestTo({
    url: SCHEMA_ENDPOINT_REGEX,
    headers: {
      "x-sandbox-name": "alloy-test"
    }
  })
  .respond(
    {
      $id: "sch123",
      title: "Test Schema 1",
      version: "1.0",
      type: "object",
      properties: {
        testField: {
          title: "Test Field",
          type: "string"
        }
      }
    },
    200,
    responseHeaders
  );

export const namespaces = RequestMock()
  .onRequestTo(IDENTITIES_ENDPOINT_REGEX)
  .respond(
    [
      {
        updateTime: 1551688425455,
        code: "CORE",
        status: "ACTIVE",
        name: "Audience Manager",
        description: "Adobe Audience Manager UUID"
      },
      {
        updateTime: 1551688425455,
        code: "AAID",
        status: "ACTIVE",
        name: "Adobe Analytics",
        description: "Adobe Analytics (Legacy ID)",
        id: 10
      },
      {
        updateTime: 1551688425455,
        code: "ECID",
        status: "ACTIVE",
        name: "Experience Cloud",
        description: "Adobe Experience Cloud ID",
        id: 4
      },
      {
        updateTime: 1551688425455,
        code: "Email",
        status: "ACTIVE",
        name: "Email",
        description: "Email Address",
        id: 6
      },
      {
        updateTime: 1551688425455,
        code: "WAID",
        status: "ACTIVE",
        name: "Windows AID",
        description: "Windows AID",
        id: 8
      }
    ],
    200,
    responseHeaders
  );

export const namespacesEmpty = RequestMock()
  .onRequestTo(IDENTITIES_ENDPOINT_REGEX)
  .respond([], 200, responseHeaders);

export const namespacesError = RequestMock()
  .onRequestTo(IDENTITIES_ENDPOINT_REGEX)
  .respond({}, 403, responseHeaders);
