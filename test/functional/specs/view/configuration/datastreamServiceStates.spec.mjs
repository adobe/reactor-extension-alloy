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

import { t } from "testcafe";
import createExtensionViewFixture from "../../../helpers/createExtensionViewFixture.mjs";
import * as sandboxesMocks from "../../../helpers/endpointMocks/sandboxesMocks.mjs";
import * as datastreamsMocks from "../../../helpers/endpointMocks/datastreamsMocks.mjs";
import * as datastreamMocks from "../../../helpers/endpointMocks/datastreamMocks.mjs";
import extensionViewController from "../../../helpers/extensionViewController.mjs";
import overrideViewSelectors from "../../../helpers/overrideViewSelectors.mjs";

createExtensionViewFixture({
  title: "Datastream Service States",
  viewPath: "configuration/configuration.html",
  requiresAdobeIOIntegration: true,
});

test.requestHooks(sandboxesMocks.singleDefault, datastreamsMocks.empty)(
  "allows all services to be editable when no datastream config exists",
  async () => {
    await extensionViewController.init({
      settings: {
        instances: [
          {
            name: "alloy1",
            edgeConfigId: "PR123",
          },
        ],
      },
    });

    await overrideViewSelectors.envTabs.development.click();
    await overrideViewSelectors.comboBoxes.envEnabled.clear();
    await overrideViewSelectors.comboBoxes.envEnabled.enterSearch("Enabled");

    // Verify all services are editable
    await overrideViewSelectors.comboBoxes.analyticsEnabled.expectEnabled();
    await overrideViewSelectors.comboBoxes.targetEnabled.expectEnabled();
    await overrideViewSelectors.comboBoxes.audienceManagerEnabled.expectEnabled();
    await overrideViewSelectors.comboBoxes.experiencePlatformEnabled.expectEnabled();
});

test.requestHooks(
  sandboxesMocks.singleDefault,
  datastreamMocks.withUndefinedServices
)(
  "shows disabled and non-editable state for undefined services in datastream",
  async () => {
    await extensionViewController.init({
      settings: {
        instances: [
          {
            name: "alloy1",
            edgeConfigId: "PR123",
            edgeConfigOverrides: {
              development: {
                enabled: true
              }
            }
          },
        ],
      },
    });

    await overrideViewSelectors.envTabs.development.click();
    await overrideViewSelectors.comboBoxes.envEnabled.clear();
    await overrideViewSelectors.comboBoxes.envEnabled.enterSearch("Enabled");

    // First verify the services exist
    await overrideViewSelectors.comboBoxes.analyticsEnabled.expectExists();
    await overrideViewSelectors.comboBoxes.targetEnabled.expectExists();

    // Then verify their state
    // Check if the element has aria-disabled attribute
    await overrideViewSelectors.comboBoxes.analyticsEnabled.selector.withAttribute('aria-disabled', 'true').exists;
    await overrideViewSelectors.comboBoxes.targetEnabled.selector.withAttribute('aria-disabled', 'true').exists;

    // Get actual settings and verify
    const actualSettings = await extensionViewController.getSettings();
    // Verify only the expected properties exist
    await t.expect(actualSettings).eql({
      instances: [
        {
          name: "alloy1",
          edgeConfigId: "PR123",
          edgeConfigOverrides: {
            development: {
              enabled: true
            }
          }
        }
      ]
    });
});

test.requestHooks(
  sandboxesMocks.singleDefault,
  datastreamMocks.withConfigOverrides
)(
  "allows editing of enabled services and preserves their values",
  async () => {
    const initialSettings = {
      instances: [
        {
          name: "alloy1",
          edgeConfigId: "PR123",
          edgeConfigOverrides: {
            development: {
              enabled: true,
              com_adobe_analytics: {
                enabled: true,
                reportSuites: ["override-suite"]
              },
              com_adobe_target: {
                enabled: false,
                propertyToken: "override-token"
              }
            }
          }
        }
      ]
    };

    await extensionViewController.init({
      settings: initialSettings
    });

    await overrideViewSelectors.envTabs.development.click();
    await overrideViewSelectors.comboBoxes.envEnabled.clear();
    await overrideViewSelectors.comboBoxes.envEnabled.enterSearch("Enabled");

    // First verify the services exist
    await overrideViewSelectors.comboBoxes.analyticsEnabled.expectExists();
    await overrideViewSelectors.comboBoxes.targetEnabled.expectExists();

    // Verify enabled services are editable
    await overrideViewSelectors.comboBoxes.analyticsEnabled.expectEnabled();
    await overrideViewSelectors.comboBoxes.targetEnabled.expectEnabled();

    // Test changing Analytics enabled state
    await overrideViewSelectors.comboBoxes.analyticsEnabled.clear();
    await overrideViewSelectors.comboBoxes.analyticsEnabled.enterSearch("Disabled");

    // Get actual settings and verify
    const actualSettings = await extensionViewController.getSettings();
    // Verify the expected properties and values
    await t.expect(actualSettings).eql({
      instances: [
        {
          name: "alloy1",
          edgeConfigId: "PR123",
          edgeConfigOverrides: {
            development: {
              enabled: true,
              com_adobe_analytics: {
                enabled: false,
                reportSuites: ["override-suite"]
              },
              com_adobe_target: {
                enabled: false,
                propertyToken: "override-token"
              }
            }
          }
        }
      ]
    });
});