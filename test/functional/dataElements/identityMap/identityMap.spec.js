/*
Copyright 2019 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
*/

import { t } from "testcafe";
import createExtensionViewController from "../../helpers/createExtensionViewController";
import spectrum from "../../helpers/spectrum";
import getAdobeIOAccessToken from "../../helpers/getAdobeIOAccessToken";
import * as platformMocks from "../xdmObject/helpers/platformMocks";
import credentials from "../../helpers/adobeIOClientCredentials";

const identityMapViewController = createExtensionViewController(
  "dataElements/identityMap.html"
);

const initializeExtensionView = async additionalInitInfo => {
  const accessToken = await getAdobeIOAccessToken();
  const initInfo = {
    extensionSettings: {},
    company: {
      orgId: credentials.orgId
    },
    tokens: { imsAccess: accessToken },
    ...additionalInitInfo
  };
  await identityMapViewController.init(initInfo);
};

const addIdentityButton = spectrum.button("addIdentityButton");
const accordion = spectrum.accordion("identitiesAccordion");

const identities = [];
for (let i = 0; i < 3; i += 1) {
  const identifiers = [];
  for (let j = 0; j < 2; j += 1) {
    identifiers.push({
      id: spectrum.textfield(`identity${i}idField${j}`),
      authenticatedState: spectrum.select(
        `identity${i}authenticatedStateField${j}`
      ),
      primary: spectrum.checkbox(`identity${i}primaryField${j}`),
      deleteButton: spectrum.button(`deleteIdentifier${i}Button${j}`)
    });
  }
  identities.push({
    namespace: spectrum.textfield(`namespace${i}Field`),
    identifiers,
    deleteButton: spectrum.button(`deleteIdentity${i}Button`),
    addIdentifierButton: spectrum.button(`addIdentifier${i}Button`),
    namespaceSelect: spectrum.select(`namespaceSelect${i}Field`)
  });
}

fixture("Identity Map Data Element View")
  .beforeEach(async () => {
    await t.addRequestHooks(platformMocks.namespacesEmpty);
  })
  .disablePageReloads.page("http://localhost:3000/viewSandbox.html")
  .meta("requiresAdobeIOIntegration", true)
  .requestHooks(platformMocks.namespacesEmpty);

test("initializes Identity map with default settings", async () => {
  await initializeExtensionView();

  await identities[0].namespace.expectValue("");
  await identities[0].identifiers[0].id.expectValue("");
  await identities[0].identifiers[0].authenticatedState.expectSelectedOptionLabel(
    "Ambiguous"
  );
  await identities[0].identifiers[0].primary.expectUnchecked();
  await identities[0].identifiers[0].deleteButton.expectDisabled();
  await identities[0].deleteButton.expectDisabled();
});

test("initializes Identity map with sorted namespaces", async () => {
  await initializeExtensionView({
    settings: {
      S_CUSTOM_IDENTITY: [
        {
          id: "test1",
          authenticatedState: "loggedOut",
          primary: false
        },
        {
          id: "test2",
          authenticatedState: "ambiguous",
          primary: true
        }
      ],
      W_CUSTOM_IDENTITY2: [
        {
          id: "test3",
          authenticatedState: "authenticated",
          primary: false
        }
      ],
      B_CUSTOM_IDENTITY2: [
        {
          id: "test3",
          authenticatedState: "authenticated",
          primary: false
        }
      ]
    }
  });

  await accordion.clickHeader("B_CUSTOM_IDENTITY2");
  await identities[0].namespace.expectValue("B_CUSTOM_IDENTITY2");
  await identities[0].identifiers[0].id.expectValue("test3");
  await identities[0].identifiers[0].authenticatedState.expectSelectedOptionLabel(
    "Authenticated"
  );
  await identities[0].identifiers[0].primary.expectUnchecked();
  await identities[0].identifiers[0].deleteButton.expectDisabled();
  await identities[0].deleteButton.expectEnabled();

  await accordion.clickHeader("S_CUSTOM_IDENTITY");
  await identities[1].namespace.expectValue("S_CUSTOM_IDENTITY");

  await identities[1].identifiers[0].id.expectValue("test1");
  await identities[1].identifiers[0].authenticatedState.expectSelectedOptionLabel(
    "Logged Out"
  );
  await identities[1].identifiers[0].primary.expectUnchecked();
  await identities[1].identifiers[0].deleteButton.expectEnabled();

  await identities[1].identifiers[1].id.expectValue("test2");
  await identities[1].identifiers[1].authenticatedState.expectSelectedOptionLabel(
    "Ambiguous"
  );
  await identities[1].identifiers[1].primary.expectChecked();
  await identities[1].identifiers[1].deleteButton.expectEnabled();

  await identities[1].deleteButton.expectEnabled();

  await accordion.clickHeader("W_CUSTOM_IDENTITY2");
  await identities[2].namespace.expectValue("W_CUSTOM_IDENTITY2");
  await identities[2].identifiers[0].id.expectValue("test3");
  await identities[2].identifiers[0].authenticatedState.expectSelectedOptionLabel(
    "Authenticated"
  );
  await identities[2].identifiers[0].primary.expectUnchecked();
  await identities[2].identifiers[0].deleteButton.expectDisabled();
  await identities[2].deleteButton.expectEnabled();

  await identityMapViewController.expectIsValid();
  await identityMapViewController.expectSettings({
    B_CUSTOM_IDENTITY2: [
      {
        id: "test3",
        authenticatedState: "authenticated",
        primary: false
      }
    ],
    S_CUSTOM_IDENTITY: [
      {
        id: "test1",
        authenticatedState: "loggedOut",
        primary: false
      },
      {
        id: "test2",
        authenticatedState: "ambiguous",
        primary: true
      }
    ],
    W_CUSTOM_IDENTITY2: [
      {
        id: "test3",
        authenticatedState: "authenticated",
        primary: false
      }
    ]
  });
});
test("adds a new Identity and new Identifier with minimal settings", async () => {
  await initializeExtensionView({
    settings: {
      CUSTOM_IDENTITY: [
        {
          id: "test1",
          authenticatedState: "loggedOut",
          primary: false
        }
      ]
    }
  });

  await identities[0].namespace.expectValue("CUSTOM_IDENTITY");
  await identities[0].identifiers[0].id.expectValue("test1");
  await identities[0].identifiers[0].authenticatedState.expectSelectedOptionLabel(
    "Logged Out"
  );
  await identities[0].identifiers[0].primary.expectUnchecked();
  await identities[0].identifiers[0].deleteButton.expectDisabled();

  await identities[0].addIdentifierButton.click();
  await identities[0].identifiers[1].id.typeText("test2");
  await identities[0].identifiers[1].authenticatedState.selectOption(
    "Ambiguous"
  );
  await identities[0].identifiers[1].primary.click();

  await addIdentityButton.click();
  await identities[1].namespace.typeText("CUSTOM_IDENTITY2");
  await identities[1].identifiers[0].id.typeText("test3");
  await identities[1].identifiers[0].authenticatedState.selectOption(
    "Authenticated"
  );

  await identityMapViewController.expectIsValid();
  await identityMapViewController.expectSettings({
    CUSTOM_IDENTITY: [
      {
        id: "test1",
        authenticatedState: "loggedOut",
        primary: false
      },
      {
        id: "test2",
        authenticatedState: "ambiguous",
        primary: true
      }
    ],
    CUSTOM_IDENTITY2: [
      {
        id: "test3",
        authenticatedState: "authenticated",
        primary: false
      }
    ]
  });
});
test("removing Identifier returns the correct settings", async () => {
  await initializeExtensionView({
    settings: {
      CUSTOM_IDENTITY: [
        {
          id: "test1",
          authenticatedState: "loggedOut",
          primary: false
        }
      ],
      CUSTOM_IDENTITY2: [
        {
          id: "test3",
          authenticatedState: "authenticated",
          primary: false
        },
        {
          id: "test2",
          authenticatedState: "ambiguous",
          primary: true
        }
      ]
    }
  });

  await accordion.clickHeader("CUSTOM_IDENTITY2");
  await identities[1].identifiers[1].deleteButton.click();

  await identityMapViewController.expectIsValid();
  await identityMapViewController.expectSettings({
    CUSTOM_IDENTITY: [
      {
        id: "test1",
        authenticatedState: "loggedOut",
        primary: false
      }
    ],
    CUSTOM_IDENTITY2: [
      {
        id: "test3",
        authenticatedState: "authenticated",
        primary: false
      }
    ]
  });
});
test("invalid Identity trigger validation error", async () => {
  await initializeExtensionView();

  await identities[0].identifiers[0].id.typeText("test3");
  await identities[0].identifiers[0].authenticatedState.selectOption(
    "Authenticated"
  );

  await identityMapViewController.expectIsNotValid();
  await identities[0].namespace.expectError();
});
test("invalid Identifier trigger validation error", async () => {
  await initializeExtensionView();

  await identities[0].namespace.typeText("CUSTOM_IDENTITY");
  await identities[0].identifiers[0].authenticatedState.selectOption(
    "Authenticated"
  );

  await identityMapViewController.expectIsNotValid();
  await identities[0].identifiers[0].id.expectError();
});

test("double Identity namespace trigger validation error", async () => {
  await initializeExtensionView({
    settings: {
      CUSTOM_IDENTITY: [
        {
          id: "",
          authenticatedState: "",
          primary: false
        }
      ]
    }
  });
  await addIdentityButton.click();
  await identities[1].namespace.typeText("CUSTOM_IDENTITY");
  await identities[1].identifiers[0].id.typeText("test3");
  await identities[1].identifiers[0].authenticatedState.selectOption(
    "Authenticated"
  );

  await identityMapViewController.expectIsNotValid();
  await identities[1].namespace.expectError();
});

test("initialization of namespaces as dropdown with values", async () => {
  await t.removeRequestHooks(platformMocks.namespacesEmpty);

  await t.addRequestHooks(platformMocks.namespaces);

  await initializeExtensionView();

  await identities[0].namespaceSelect.selectOption("AAID");
  await identities[0].identifiers[0].id.typeText("test3");

  await identityMapViewController.expectIsValid();
  await identityMapViewController.expectSettings({
    AAID: [
      {
        id: "test3",
        authenticatedState: "ambiguous",
        primary: false
      }
    ]
  });
});

test("when namespaces call fails instantiate form with textfield", async () => {
  await t.removeRequestHooks(platformMocks.namespacesEmpty);

  await t.addRequestHooks(platformMocks.namespacesError);

  await initializeExtensionView();

  await identities[0].namespace.expectValue("");
});

test("multiple primary identifiers trigger validation error", async () => {
  await initializeExtensionView({
    settings: {
      CUSTOM_IDENTITY: [
        {
          id: "123",
          authenticatedState: "authenticated",
          primary: true
        }
      ]
    }
  });
  await addIdentityButton.click();
  await identities[1].namespace.typeText("CUSTOM_IDENTITY2");
  await identities[1].identifiers[0].id.typeText("test3");
  await identities[1].identifiers[0].authenticatedState.selectOption(
    "Authenticated"
  );
  await identities[1].identifiers[0].primary.click();

  await identityMapViewController.expectIsNotValid();
  await identities[1].identifiers[0].primary.expectError();
});
