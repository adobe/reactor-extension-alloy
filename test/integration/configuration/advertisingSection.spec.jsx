/*
Copyright 2025 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
*/

import { describe, it, beforeEach, afterEach, expect } from "vitest";

import useView from "../helpers/useView";
import ConfigurationView from "../../../src/view/configuration/configurationView";
import { expandAccordion } from "../helpers/ui";
import { buildSettings } from "../helpers/settingsUtils";
import { worker } from "../helpers/mocks/browser";
import {
  noAdvertisersHandlers,
  advertisersUnauthorizedHandlers,
} from "../helpers/mocks/defaultHandlers";

let view;
let driver;
let cleanup;
let dspEnabledField;
let id5PartnerIdField;
let rampIdJSPathField;
let addAdvertiserButton;
let advertiser0Field;
let advertiser1Field;
let advertiserEnabled0Field;
let deleteAdvertiser0Button;
let advertisingComponentCheckbox;

/**
 * Wait for advertiser fields to load after enabling DSP
 */
const waitForAdvertisersToLoad = async () => {
  await expect.element(advertiser0Field).toBeVisible({ timeout: 10000 });
};

/**
 * Wait for ID5 and RampID fields to appear (they show after advertisers load)
 */
const waitForOptionalFieldsToLoad = async () => {
  await expect.element(id5PartnerIdField).toBeVisible({ timeout: 10000 });
};

describe("Config advertising section", () => {
  beforeEach(async () => {
    ({ view, driver, cleanup } = await useView(ConfigurationView));
    dspEnabledField = view.getByTestId("dspEnabledField");
    id5PartnerIdField = view.getByTestId("id5PartnerIdField");
    rampIdJSPathField = view.getByTestId("rampIdJSPathField");
    addAdvertiserButton = view.getByTestId("addAdvertiserButton");
    advertiser0Field = view.getByTestId("advertiser0Field");
    advertiser1Field = view.getByTestId("advertiser1Field");
    advertiserEnabled0Field = view.getByTestId("advertiserEnabled0Field");
    deleteAdvertiser0Button = view.getByTestId("deleteAdvertiser0Button");
    advertisingComponentCheckbox = view.getByTestId(
      "advertisingComponentCheckbox",
    );
  });

  afterEach(() => {
    cleanup();
  });

  it("sets form values from settings", async () => {
    await driver.init(
      buildSettings({
        components: {
          advertising: true,
        },

        instances: [
          {
            name: "alloy",
            advertising: {
              dspEnabled: true,
              advertiserSettings: [
                {
                  advertiserId: "167534",
                  enabled: true,
                },
              ],
              id5PartnerId: "test-id5-partner",
              rampIdJSPath: "https://example.com/ats.js",
            },
          },
        ],
      }),
    );

    await waitForAdvertisersToLoad();
    await waitForOptionalFieldsToLoad();

    await expect.element(dspEnabledField).toHaveValue("Enabled");

    await expect.element(id5PartnerIdField).toHaveValue("test-id5-partner");

    await expect
      .element(rampIdJSPathField)
      .toHaveValue("https://example.com/ats.js");
  });

  it("sets form values from settings with DSP disabled", async () => {
    await driver.init(
      buildSettings({
        components: {
          advertising: true,
        },

        instances: [
          {
            name: "alloy",
            advertising: {
              dspEnabled: false,
            },
          },
        ],
      }),
    );

    await expect.element(dspEnabledField).toHaveValue("Disabled");
  });

  it("updates form values and saves to settings", async () => {
    await driver.init(
      buildSettings({
        components: {
          advertising: true,
        },
      }),
    );

    await dspEnabledField.selectOption("Enabled");
    await expect.element(dspEnabledField).toHaveValue("Enabled");

    // Wait for advertisers to load after enabling DSP
    await waitForAdvertisersToLoad();
    await waitForOptionalFieldsToLoad();

    await advertiser0Field.selectOption("test");
    await expect.element(advertiser0Field).toHaveValue("test");

    await id5PartnerIdField.fill("new-id5-partner");

    await rampIdJSPathField.fill("https://new.example.com/ats.js");
    await driver.tab();

    // Get settings and verify
    await driver
      .expectSettings((s) => s.instances[0].advertising)
      .toMatchObject({
        dspEnabled: true,
        id5PartnerId: "new-id5-partner",
        rampIdJSPath: "https://new.example.com/ats.js",
        advertiserSettings: [
          {
            advertiserId: "167536",
            enabled: true,
          },
        ],
      });
  });

  it("does not emit advertising settings when component is disabled", async () => {
    await driver.init(
      buildSettings({
        components: {
          advertising: true,
        },

        instances: [
          {
            name: "alloy",
            advertising: {
              dspEnabled: true,
              advertiserSettings: [
                {
                  advertiserId: "167536",
                  enabled: true,
                },
              ],
              id5PartnerId: "test-id5-partner",
              rampIdJSPath: "https://example.com/ats.js",
            },
          },
        ],
      }),
    );

    await expandAccordion("Build options");
    await advertisingComponentCheckbox.element().scrollIntoView();
    await advertisingComponentCheckbox.click();

    await driver
      .expectSettings((s) => s.instances[0].advertising)
      .toBeUndefined();
  });

  it("shows alert panel when advertising component is disabled", async () => {
    await driver.init(buildSettings());
    await expect
      .element(
        view.getByRole("heading", {
          name: /adobe advertising component disabled/i,
        }),
      )
      .toBeVisible();
  });

  it("hides form fields and shows alert when component is toggled off", async () => {
    await driver.init(
      buildSettings({
        components: {
          advertising: true,
        },
      }),
    );

    await expandAccordion("Build options");
    await advertisingComponentCheckbox.element().scrollIntoView();
    await advertisingComponentCheckbox.click();

    // Should now show alert panel
    await expect
      .element(
        view.getByRole("heading", {
          name: /adobe advertising component disabled/i,
        }),
      )
      .toBeVisible();
  });

  it("allows data element in DSP enabled field", async () => {
    await driver.init(
      buildSettings({
        components: {
          advertising: true,
        },

        instances: [
          {
            name: "alloy",
            advertising: {
              dspEnabled: "%myDataElement%",
            },
          },
        ],
      }),
    );

    await expect.element(dspEnabledField).toHaveValue("%myDataElement%");

    // Verify it's saved as string
    await driver
      .expectSettings((s) => s.instances[0].advertising.dspEnabled)
      .toBe("%myDataElement%");
  });

  it("allows data element in ID5 Partner ID field", async () => {
    await driver.init(
      buildSettings({
        components: {
          advertising: true,
        },

        instances: [
          {
            name: "alloy",
            advertising: {
              dspEnabled: true,
              id5PartnerId: "%id5DataElement%",
            },
          },
        ],
      }),
    );

    await waitForAdvertisersToLoad();
    await waitForOptionalFieldsToLoad();

    await expect.element(id5PartnerIdField).toHaveValue("%id5DataElement%");

    // Verify it's saved as string
    await driver
      .expectSettings((s) => s.instances[0].advertising.id5PartnerId)
      .toBe("%id5DataElement%");
  });

  it("allows data element in RampID JS Path field", async () => {
    await driver.init(
      buildSettings({
        components: {
          advertising: true,
        },

        instances: [
          {
            name: "alloy",
            advertising: {
              dspEnabled: true,
              rampIdJSPath: "%rampIdDataElement%",
            },
          },
        ],
      }),
    );

    await waitForAdvertisersToLoad();
    await waitForOptionalFieldsToLoad();

    await expect.element(rampIdJSPathField).toHaveValue("%rampIdDataElement%");

    // Verify it's saved as string
    await driver
      .expectSettings((s) => s.instances[0].advertising.rampIdJSPath)
      .toBe("%rampIdDataElement%");
  });

  it("does not save optional fields when empty", async () => {
    await driver.init(
      buildSettings({
        components: {
          advertising: true,
        },
      }),
    );

    await dspEnabledField.selectOption("Enabled");
    await expect.element(dspEnabledField).toHaveValue("Enabled");

    // Wait for advertisers to load
    await waitForAdvertisersToLoad();

    // Leave optional fields empty
    await driver.tab();
    await driver
      .expectSettings((s) => s.instances[0].advertising.id5PartnerId)
      .toBeUndefined();
    await driver
      .expectSettings((s) => s.instances[0].advertising.rampIdJSPath)
      .toBeUndefined();
  });

  it("shows default DSP disabled value when no settings provided", async () => {
    await driver.init(
      buildSettings({
        components: {
          advertising: true,
        },
      }),
    );

    await expect.element(dspEnabledField).toHaveValue("Disabled");
  });

  it("converts boolean dspEnabled to string for UI display", async () => {
    await driver.init(
      buildSettings({
        components: {
          advertising: true,
        },

        instances: [
          {
            name: "alloy",
            advertising: {
              dspEnabled: true,
            },
          },
        ],
      }),
    );

    await expect.element(dspEnabledField).toHaveValue("Enabled");
  });

  it("converts Enabled string to boolean true when saving", async () => {
    await driver.init(
      buildSettings({
        components: {
          advertising: true,
        },
      }),
    );

    await dspEnabledField.selectOption("Enabled");
    await expect.element(dspEnabledField).toHaveValue("Enabled");

    // Wait for advertisers to load
    await waitForAdvertisersToLoad();

    await driver.tab();
    await driver
      .expectSettings((s) => s.instances[0].advertising.dspEnabled)
      .toBe(true);
  });

  it("converts Disabled string to boolean false when saving", async () => {
    await driver.init(
      buildSettings({
        components: {
          advertising: true,
        },
      }),
    );

    await dspEnabledField.selectOption("Disabled");
    await expect.element(dspEnabledField).toHaveValue("Disabled");
    await driver.tab();

    await driver
      .expectSettings((s) => s.instances[0].advertising.dspEnabled)
      .toBe(false);
  });

  it("hides DSP fields when DSP is disabled", async () => {
    await driver.init(
      buildSettings({
        components: {
          advertising: true,
        },
      }),
    );

    await expect.element(dspEnabledField).toHaveValue("Disabled");

    // Verify DSP-specific fields are not visible
    await expect.element(addAdvertiserButton).not.toBeInTheDocument();
    await expect.element(id5PartnerIdField).not.toBeInTheDocument();
    await expect.element(rampIdJSPathField).not.toBeInTheDocument();
  });

  it("shows DSP fields when DSP is enabled", async () => {
    await driver.init(
      buildSettings({
        components: {
          advertising: true,
        },
      }),
    );

    await dspEnabledField.selectOption("Enabled");
    await expect.element(dspEnabledField).toHaveValue("Enabled");
    await driver.tab();

    // Wait for advertisers to load
    await waitForAdvertisersToLoad();
    await waitForOptionalFieldsToLoad();

    // Verify DSP-specific fields are now visible
    await expect.element(addAdvertiserButton).toBeVisible();
    await expect.element(id5PartnerIdField).toBeVisible();
    await expect.element(rampIdJSPathField).toBeVisible();
    await expect.element(advertiser0Field).toBeVisible();
  });

  it("shows warning alert when no advertisers are found but allows manual entry", async () => {
    // Override the default handler with no advertisers response
    worker.use(...noAdvertisersHandlers);

    await driver.init(
      buildSettings({
        components: {
          advertising: true,
        },
      }),
    );

    await dspEnabledField.selectOption("Enabled");
    await expect.element(dspEnabledField).toHaveValue("Enabled");
    await driver.tab();

    // Wait for the warning alert to appear
    await expect
      .element(
        view.getByRole("heading", {
          name: /no dsp advertisers found/i,
        }),
      )
      .toBeVisible({ timeout: 5000 });

    // Verify the alert content
    await expect
      .element(view.getByText(/no advertisers found for this ims org/i))
      .toBeVisible();

    // Verify DSP fields are now visible for manual entry
    await expect.element(addAdvertiserButton).toBeVisible();
    await expect.element(id5PartnerIdField).toBeVisible();
    await expect.element(rampIdJSPathField).toBeVisible();

    // Verify form is invalid without advertiser ID
    await driver.expectValidate().toBe(false);
  });

  it("shows warning alert when advertiser API fails but allows manual entry", async () => {
    // Override the default handler with unauthorized response
    worker.use(...advertisersUnauthorizedHandlers);

    await driver.init(
      buildSettings({
        components: {
          advertising: true,
        },
      }),
    );

    await dspEnabledField.selectOption("Enabled");
    await expect.element(dspEnabledField).toHaveValue("Enabled");
    await driver.tab();

    // Wait for the warning alert to appear
    await expect
      .element(
        view.getByRole("heading", {
          name: /unable to load advertisers/i,
        }),
      )
      .toBeVisible({ timeout: 5000 });

    // Verify the alert content
    await expect
      .element(view.getByText(/could not retrieve advertiser data from dsp/i))
      .toBeVisible();

    // Verify DSP fields are now visible for manual entry
    await expect.element(addAdvertiserButton).toBeVisible();
    await expect.element(id5PartnerIdField).toBeVisible();
    await expect.element(rampIdJSPathField).toBeVisible();

    // Verify form is invalid without advertiser ID
    await driver.expectValidate().toBe(false);
  });

  it("shows add advertiser button when advertisers load successfully", async () => {
    await driver.init(
      buildSettings({
        components: {
          advertising: true,
        },
      }),
    );

    await dspEnabledField.selectOption("Enabled");
    await expect.element(dspEnabledField).toHaveValue("Enabled");
    await driver.tab();

    // Wait for advertisers to load
    await waitForAdvertisersToLoad();

    // Verify add advertiser button is visible
    await expect.element(addAdvertiserButton).toBeVisible();

    // Verify one advertiser row is visible by default
    await expect.element(advertiser0Field).toBeVisible();
  });

  it("allows adding multiple advertisers", async () => {
    await driver.init(
      buildSettings({
        components: {
          advertising: true,
        },
      }),
    );

    await dspEnabledField.selectOption("Enabled");
    await expect.element(dspEnabledField).toHaveValue("Enabled");

    // Wait for advertisers to load
    await waitForAdvertisersToLoad();
    await waitForOptionalFieldsToLoad();

    // Select first advertiser
    await advertiser0Field.selectOption("test");
    await expect.element(advertiser0Field).toHaveValue("test");

    // Add second advertiser
    await addAdvertiserButton.click();

    // Select second advertiser
    await advertiser1Field.selectOption("Advertiser BF");
    await expect.element(advertiser1Field).toHaveValue("Advertiser BF");
    await driver.tab();

    // Verify settings
    await driver
      .expectSettings((s) => s.instances[0].advertising.advertiserSettings)
      .toHaveLength(2);
    await driver
      .expectSettings((s) => s.instances[0].advertising.advertiserSettings[0])
      .toMatchObject({
        advertiserId: "167536",
        enabled: true,
      });
    await driver
      .expectSettings((s) => s.instances[0].advertising.advertiserSettings[1])
      .toMatchObject({
        advertiserId: "167524",
        enabled: true,
      });
  });

  it("allows removing advertisers", async () => {
    await driver.init(
      buildSettings({
        components: {
          advertising: true,
        },

        instances: [
          {
            name: "alloy",
            advertising: {
              dspEnabled: true,
              advertiserSettings: [
                {
                  advertiserId: "167534",
                  enabled: true,
                },
                {
                  advertiserId: "167524",
                  enabled: true,
                },
              ],
            },
          },
        ],
      }),
    );

    await waitForAdvertisersToLoad();
    await waitForOptionalFieldsToLoad();

    // Remove first advertiser
    await deleteAdvertiser0Button.click();

    // Verify settings
    await driver
      .expectSettings((s) => s.instances[0].advertising.advertiserSettings)
      .toHaveLength(1);
    await driver
      .expectSettings((s) => s.instances[0].advertising.advertiserSettings[0])
      .toMatchObject({
        advertiserId: "167524",
        enabled: true,
      });
  });

  it("allows toggling advertiser enabled state", async () => {
    await driver.init(
      buildSettings({
        components: {
          advertising: true,
        },

        instances: [
          {
            name: "alloy",
            advertising: {
              dspEnabled: true,
              advertiserSettings: [
                {
                  advertiserId: "167534",
                  enabled: true,
                },
              ],
            },
          },
        ],
      }),
    );

    await waitForAdvertisersToLoad();
    await waitForOptionalFieldsToLoad();

    // Toggle to disabled
    await advertiserEnabled0Field.selectOption("Disabled");
    await expect.element(advertiserEnabled0Field).toHaveValue("Disabled");
    await driver.tab();

    // Verify settings
    await driver
      .expectSettings(
        (s) => s.instances[0].advertising.advertiserSettings[0].enabled,
      )
      .toBe(false);

    // Toggle back to enabled
    await advertiserEnabled0Field.selectOption("Enabled");
    await expect.element(advertiserEnabled0Field).toHaveValue("Enabled");
    await driver.tab();

    // Verify settings
    await driver
      .expectSettings(
        (s) => s.instances[0].advertising.advertiserSettings[0].enabled,
      )
      .toBe(true);
  });

  describe("validation", () => {
    it("requires DSP enabled field", async () => {
      await driver.init(
        buildSettings({
          components: {
            advertising: true,
          },
        }),
      );

      await dspEnabledField.fill("");
      await driver.tab();

      await driver.expectValidate().toBe(false);

      await expect.element(dspEnabledField).not.toBeValid();
      await expect
        .element(dspEnabledField)
        .toHaveAccessibleDescription(
          /please choose a value or specify a data element/i,
        );
    });

    it("validates data element format in DSP enabled field", async () => {
      await driver.init(
        buildSettings({
          components: {
            advertising: true,
          },

          instances: [
            {
              name: "alloy",
              advertising: {
                dspEnabled: "invalid%dataElement",
                advertiserSettings: [
                  {
                    advertiserId: "167534",
                    enabled: "Enabled",
                  },
                ],
              },
            },
          ],
        }),
      );

      // Trigger validation
      await driver.expectValidate().toBe(false);

      await expect.element(dspEnabledField).not.toBeValid();
      await expect
        .element(dspEnabledField)
        .toHaveAccessibleDescription(/please enter a valid data element/i);
    });

    it("accepts valid data element format in DSP enabled field", async () => {
      await driver.init(
        buildSettings({
          components: {
            advertising: true,
          },

          instances: [
            {
              name: "alloy",
              advertising: {
                dspEnabled: "%validDataElement%",
                advertiserSettings: [
                  {
                    advertiserId: "167534",
                    enabled: "Enabled",
                  },
                ],
              },
            },
          ],
        }),
      );

      // When DSP is a data element, advertisers will still load
      await waitForAdvertisersToLoad();

      await driver.expectValidate().toBe(true);
    });

    it("validates data element format in ID5 Partner ID field", async () => {
      await driver.init(
        buildSettings({
          components: {
            advertising: true,
          },

          instances: [
            {
              name: "alloy",
              advertising: {
                dspEnabled: true,
                id5PartnerId: "invalid%dataElement",
                advertiserSettings: [
                  {
                    advertiserId: "167534",
                    enabled: "Enabled",
                  },
                ],
              },
            },
          ],
        }),
      );

      await waitForAdvertisersToLoad();
      await waitForOptionalFieldsToLoad();

      // Trigger validation
      await driver.expectValidate().toBe(false);

      await expect.element(id5PartnerIdField).not.toBeValid();
      await expect
        .element(id5PartnerIdField)
        .toHaveAccessibleDescription(/please enter a valid data element/i);
    });

    it("validates data element format in RampID JS Path field", async () => {
      await driver.init(
        buildSettings({
          components: {
            advertising: true,
          },

          instances: [
            {
              name: "alloy",
              advertising: {
                dspEnabled: true,
                rampIdJSPath: "invalid%dataElement",
                advertiserSettings: [
                  {
                    advertiserId: "167534",
                    enabled: "Enabled",
                  },
                ],
              },
            },
          ],
        }),
      );

      await waitForAdvertisersToLoad();
      await waitForOptionalFieldsToLoad();

      // Trigger validation
      await driver.expectValidate().toBe(false);

      await expect.element(rampIdJSPathField).not.toBeValid();
      await expect
        .element(rampIdJSPathField)
        .toHaveAccessibleDescription(/please enter a valid data element/i);
    });

    it("shows error when advertiser field is missing while DSP is enabled", async () => {
      await driver.init(
        buildSettings({
          components: {
            advertising: true,
          },

          instances: [
            {
              name: "alloy",
              advertising: {
                dspEnabled: true,
                advertiserSettings: [],
              },
            },
          ],
        }),
      );

      await waitForAdvertisersToLoad();

      // Trigger validation
      await driver.expectValidate().toBe(false);

      await expect.element(advertiser0Field).not.toBeValid();
      await expect
        .element(advertiser0Field)
        .toHaveAccessibleDescription(/please select an advertiser/i);
    });
  });
});
