import { RequestMock } from "testcafe";

/**
 * Mocks a 403 unauthorized response from the platform sandboxes endpoint
 * @type {RequestMock}
 */
const sandboxesUnauthorized = RequestMock()
  .onRequestTo(
    "https://platform.adobe.io/data/foundation/sandbox-management/sandboxes"
  )
  .respond(
    {
      status: 403,
      title: "User does not have READ permission to access the sandbox.",
      type: "http://ns.adobe.com/aep/errors/SMS-2010-403"
    },
    403,
    { "Access-Control-Allow-Origin": "*" }
  );

/**
 * Mocks a response from the platform sandboxes endpoint
 * @type {RequestMock}
 */
const sandboxes = RequestMock()
  .onRequestTo(
    "https://platform.adobe.io/data/foundation/sandbox-management/sandboxes"
  )
  .respond(
    {
      sandboxes: [
        {
          name: "prod",
          title: "Prod",
          type: "production",
          isDefault: true,
          region: "VA7",
          state: "active"
        },
        {
          name: "alloy-test",
          title: "Alloy Test",
          type: "production",
          isDefault: false,
          region: "FOO",
          state: "active"
        }
      ]
    },
    200,
    { "Access-Control-Allow-Origin": "*" }
  );

/**
 * Mocks a response from the platform schema meta endpoint
 * @type {RequestMock}
 */
const schemasMeta = RequestMock()
  .onRequestTo(
    "https://platform.adobe.io/data/foundation/schemaregistry/tenant/schemas?orderby=title&property=meta:extends==https%3A%2F%2Fns.adobe.com%2Fxdm%2Fcontext%2Fexperienceevent"
  )
  .respond(
    {
      results: [
        {
          $id: "https://ns.adobe.com/alloyengineering/schemas/foo",
          version: "1.0",
          title: "Foo1"
        },
        {
          $id: "https://ns.adobe.com/alloyengineering/schemas/foo2",
          version: "1.0",
          title: "Foo2"
        }
      ]
    },
    200,
    { "Access-Control-Allow-Origin": "*" }
  );

export default {
  sandboxes,
  sandboxesUnauthorized,
  schemasMeta
};
