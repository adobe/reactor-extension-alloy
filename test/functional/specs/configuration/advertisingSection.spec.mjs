/*
Copyright 2024 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
*/
/* eslint-disable vitest/expect-expect */

import { t } from "testcafe";
import extensionViewController from "../../helpers/extensionViewController.mjs";
import createExtensionViewFixture from "../../helpers/createExtensionViewFixture.mjs";
import { instances } from "../../helpers/viewSelectors.mjs";
import * as advertisersMocks from "../../helpers/endpointMocks/advertisersMocks.mjs";
import spectrum from "../../helpers/spectrum.mjs";

createExtensionViewFixture({
  title: "Advertising Section Tests",
  viewPath: "configuration/configuration.html",
  requiresAdobeIOIntegration: true,
});

test.requestHooks(advertisersMocks.multipleAdvertisers)(
  "shows advertising section when component is enabled",
  async () => {
    await extensionViewController.init({
      settings: {
        components: {
          advertising: true,
        },
        instances: [
          {
            name: "alloy1",
            edgeConfigId: "PR123",
            advertising: {
              advertiserSettings: [],
              id5PartnerId: "",
              rampIdJSPath: "",
            },
          },
        ],
      },
    });

    // Verify the advertising section elements are visible
    await instances[0].advertising.addAdvertiserButton.expectExists();
    await instances[0].advertising.id5PartnerIdField.expectExists();
    await instances[0].advertising.rampIdJSPathField.expectExists();
  }
);

test.requestHooks(advertisersMocks.multipleAdvertisers)(
  "allows adding and configuring advertisers",
  async () => {
    await extensionViewController.init({
      settings: {
        components: {
          advertising: true,
        },
        instances: [
          {
            name: "alloy1",
            edgeConfigId: "PR123",
            advertising: {
              advertiserSettings: [],
              id5PartnerId: "",
              rampIdJSPath: "",
            },
          },
        ],
      },
    });

    // Add first advertiser
    await instances[0].advertising.addAdvertiserButton.click();
    await instances[0].advertising.advertiser0Field.expectExists();
    await instances[0].advertising.advertiserEnabled0Field.expectExists();
    await instances[0].advertising.deleteAdvertiser0Button.expectExists();

    // Select an advertiser
    await instances[0].advertising.advertiser0Field.openMenu();
    await instances[0].advertising.advertiser0Field.selectMenuOption(
      "Test Advertiser 1"
    );

    // Set status to Disabled  
    await instances[0].advertising.advertiserEnabled0Field.openMenu();
    await instances[0].advertising.advertiserEnabled0Field.selectMenuOption(
      "Disabled"
    );

    // Add second advertiser
    await instances[0].advertising.addAdvertiserButton.click();
    await instances[0].advertising.advertiser1Field.expectExists();
    
    // Select second advertiser
    await instances[0].advertising.advertiser1Field.openMenu();
    await instances[0].advertising.advertiser1Field.selectMenuOption(
      "Test Advertiser 2"
    );

    // Verify settings are saved correctly
    const settings = extensionViewController.getSettings();
    await t.expect(settings.instances[0].advertising.advertiserSettings).eql([
      {
        advertiserId: "12345",
        enabled: false,
      },
      {
        advertiserId: "67890", 
        enabled: true,
      },
    ]);
  }
);

test.requestHooks(advertisersMocks.multipleAdvertisers)(
  "allows deleting advertisers",
  async () => {
    await extensionViewController.init({
      settings: {
        components: {
          advertising: true,
        },
        instances: [
          {
            name: "alloy1",
            edgeConfigId: "PR123",
            advertising: {
              advertiserSettings: [
                {
                  advertiserId: "12345",
                  enabled: true,
                },
                {
                  advertiserId: "67890",
                  enabled: false,
                },
              ],
              id5PartnerId: "",
              rampIdJSPath: "",
            },
          },
        ],
      },
    });

    // Verify both advertisers are loaded
    await instances[0].advertising.advertiser0Field.expectValue("12345");
    await instances[0].advertising.advertiser1Field.expectValue("67890");

    // Delete first advertiser
    await instances[0].advertising.deleteAdvertiser0Button.click();

    // Verify only second advertiser remains and becomes first
    await instances[0].advertising.advertiser0Field.expectValue("67890");
    await instances[0].advertising.advertiser1Field.expectNotExists();
  }
);

test.requestHooks(advertisersMocks.multipleAdvertisers)(
  "supports data elements for advertiser status",
  async () => {
    await extensionViewController.init({
      settings: {
        components: {
          advertising: true,
        },
        instances: [
          {
            name: "alloy1",
            edgeConfigId: "PR123",
            advertising: {
              advertiserSettings: [],
              id5PartnerId: "",
              rampIdJSPath: "",
            },
          },
        ],
      },
    });

    // Add advertiser
    await instances[0].advertising.addAdvertiserButton.click();

    // Select advertiser
    await instances[0].advertising.advertiser0Field.openMenu();
    await instances[0].advertising.advertiser0Field.selectMenuOption(
      "Test Advertiser 1"
    );

    // Enter data element for status
    await instances[0].advertising.advertiserEnabled0Field.typeText(
      "%dataElement123%"
    );

    // Verify settings include data element
    const settings = extensionViewController.getSettings();
    await t.expect(settings.instances[0].advertising.advertiserSettings[0]).eql({
      advertiserId: "12345",
      enabled: "%dataElement123%",
    });
  }
);

test.requestHooks(advertisersMocks.multipleAdvertisers)(
  "saves ID5 Partner ID and RampID JS Path settings",
  async () => {
    await extensionViewController.init({
      settings: {
        components: {
          advertising: true,
        },
        instances: [
          {
            name: "alloy1",
            edgeConfigId: "PR123",
            advertising: {
              advertiserSettings: [],
              id5PartnerId: "",
              rampIdJSPath: "",
            },
          },
        ],
      },
    });

    // Enter ID5 Partner ID
    await instances[0].advertising.id5PartnerIdField.typeText("12345");

    // Enter RampID JS Path
    await instances[0].advertising.rampIdJSPathField.typeText(
      "https://cdn.ramp.com/ats.js"
    );

    // Verify settings are saved
    const settings = extensionViewController.getSettings();
    await t.expect(settings.instances[0].advertising.id5PartnerId).eql("12345");
    await t.expect(settings.instances[0].advertising.rampIdJSPath).eql(
      "https://cdn.ramp.com/ats.js"
    );
  }
);

test.requestHooks(advertisersMocks.multipleAdvertisers)(
  "supports data elements for ID5 Partner ID and RampID JS Path",
  async () => {
    await extensionViewController.init({
      settings: {
        components: {
          advertising: true,
        },
        instances: [
          {
            name: "alloy1",
            edgeConfigId: "PR123",
            advertising: {
              advertiserSettings: [],
              id5PartnerId: "",
              rampIdJSPath: "",
            },
          },
        ],
      },
    });

    // Enter data elements
    await instances[0].advertising.id5PartnerIdField.typeText("%partnerId%");
    await instances[0].advertising.rampIdJSPathField.typeText("%rampPath%");

    // Verify data elements are saved
    const settings = extensionViewController.getSettings();
    await t.expect(settings.instances[0].advertising.id5PartnerId).eql(
      "%partnerId%"
    );
    await t.expect(settings.instances[0].advertising.rampIdJSPath).eql(
      "%rampPath%"
    );
  }
);

test.requestHooks(advertisersMocks.noAdvertisers)(
  "shows no advertisers message when list is empty",
  async () => {
    await extensionViewController.init({
      settings: {
        components: {
          advertising: true,
        },
        instances: [
          {
            name: "alloy1",
            edgeConfigId: "PR123",
            advertising: {
              advertiserSettings: [],
              id5PartnerId: "",
              rampIdJSPath: "",
            },
          },
        ],
      },
    });

    // Verify no advertisers message is shown
    await spectrum.alert().expectExists();
    await t
      .expect(spectrum.alert().find('[data-testid="heading"]').innerText)
      .contains("No advertisers available");

    // Verify add advertiser button is not shown when no advertisers available
    await instances[0].advertising.addAdvertiserButton.expectNotExists();
  }
);

test.requestHooks(advertisersMocks.unauthorized)(
  "shows error message when API call fails",
  async () => {
    await extensionViewController.init({
      settings: {
        components: {
          advertising: true,
        },
        instances: [
          {
            name: "alloy1",
            edgeConfigId: "PR123",
            advertising: {
              advertiserSettings: [],
              id5PartnerId: "",
              rampIdJSPath: "",
            },
          },
        ],
      },
    });

    // Verify error message is shown
    await spectrum.alert().expectExists();
    await t
      .expect(spectrum.alert().find('[data-testid="heading"]').innerText)
      .contains("Failed to load advertisers");

    // Verify add advertiser button is not shown when there's an error
    await instances[0].advertising.addAdvertiserButton.expectNotExists();
  }
);

test(
  "hides advertising section when component is disabled",
  async () => {
    await extensionViewController.init({
      settings: {
        components: {
          advertising: false,
        },
        instances: [
          {
            name: "alloy1",
            edgeConfigId: "PR123",
          },
        ],
      },
    });

    // Verify advertising section shows disabled message
    await spectrum.alert().expectExists();
    await t
      .expect(spectrum.alert().find('[data-testid="heading"]').innerText)
      .contains("Adobe Advertising component disabled");

    // Verify advertising controls are not shown
    await instances[0].advertising.addAdvertiserButton.expectNotExists();
    await instances[0].advertising.id5PartnerIdField.expectNotExists();
    await instances[0].advertising.rampIdJSPathField.expectNotExists();
  }
);

test.requestHooks(advertisersMocks.multipleAdvertisers)(
  "shows multi-instance message in non-first instances",
  async () => {
    await extensionViewController.init({
      settings: {
        components: {
          advertising: true,
        },
        instances: [
          {
            name: "alloy1",
            edgeConfigId: "PR123",
            advertising: {
              advertiserSettings: [],
              id5PartnerId: "",
              rampIdJSPath: "",
            },
          },
          {
            name: "alloy2",
            edgeConfigId: "PR456",
          },
        ],
      },
    });

    // Switch to second instance
    await t.click('[data-testid="instanceTab1"]');

    // Verify multi-instance message is shown
    await spectrum.alert().expectExists();
    await t
      .expect(spectrum.alert().find('[data-testid="heading"]').innerText)
      .contains("Adobe Advertising available in first instance only");

    // Verify advertising controls are not shown in second instance
    await instances[1].advertising.addAdvertiserButton.expectNotExists();
  }
);

test.requestHooks(advertisersMocks.multipleAdvertisers)(
  "prevents duplicate advertiser selection",
  async () => {
    await extensionViewController.init({
      settings: {
        components: {
          advertising: true,
        },
        instances: [
          {
            name: "alloy1",
            edgeConfigId: "PR123",
            advertising: {
              advertiserSettings: [],
              id5PartnerId: "",
              rampIdJSPath: "",
            },
          },
        ],
      },
    });

    // Add first advertiser
    await instances[0].advertising.addAdvertiserButton.click();
    await instances[0].advertising.advertiser0Field.openMenu();
    await instances[0].advertising.advertiser0Field.selectMenuOption(
      "Test Advertiser 1"
    );

    // Add second advertiser  
    await instances[0].advertising.addAdvertiserButton.click();
    await instances[0].advertising.advertiser1Field.openMenu();
    await instances[0].advertising.advertiser1Field.selectMenuOption(
      "Test Advertiser 1"
    ); // Same advertiser

    // Verify validation error is shown
    await spectrum.alert().expectExists();
    await t
      .expect(spectrum.alert().find('[data-testid="content"]').innerText)
      .contains("Duplicate advertiser not allowed");
  }
);

test.requestHooks(advertisersMocks.multipleAdvertisers)(
  "initializes form with existing advertiser settings",
  async () => {
    await extensionViewController.init({
      settings: {
        components: {
          advertising: true,
        },
        instances: [
          {
            name: "alloy1",
            edgeConfigId: "PR123",
            advertising: {
              advertiserSettings: [
                {
                  advertiserId: "12345",
                  enabled: true,
                },
                {
                  advertiserId: "67890",
                  enabled: false,
                },
              ],
              id5PartnerId: "partner123",
              rampIdJSPath: "https://example.com/ats.js",
            },
          },
        ],
      },
    });

    // Verify advertisers are loaded
    await instances[0].advertising.advertiser0Field.expectValue("12345");
    await instances[0].advertising.advertiserEnabled0Field.expectText("Enabled");
    
    await instances[0].advertising.advertiser1Field.expectValue("67890");
    await instances[0].advertising.advertiserEnabled1Field.expectText("Disabled");

    // Verify other fields are loaded
    await instances[0].advertising.id5PartnerIdField.expectValue("partner123");
    await instances[0].advertising.rampIdJSPathField.expectValue(
      "https://example.com/ats.js"
    );
  }
);