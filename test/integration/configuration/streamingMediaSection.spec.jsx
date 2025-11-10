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
import renderView from "../helpers/renderView";
import createExtensionBridge from "../helpers/createExtensionBridge";
import ConfigurationView from "../../../src/view/configuration/configurationView";
import {
  waitForConfigurationViewToLoad,
  spectrumTextField,
  spectrumNumberField,
} from "../helpers/ui";
import { buildSettings } from "../helpers/settingsUtils";

let extensionBridge;

describe("Streaming media component", () => {
  beforeEach(() => {
    extensionBridge = createExtensionBridge();
    window.extensionBridge = extensionBridge;
  });

  afterEach(() => {
    delete window.extensionBridge;
  });

  it("sets form values from settings", async () => {
    renderView(ConfigurationView);

    extensionBridge.init(
      buildSettings({
        instances: [
          {
            name: "alloy",
            streamingMedia: {
              channel: "channel",
              playerName: "name",
              appVersion: "1.0",
              adPingInterval: 8,
              mainPingInterval: 20,
            },
          },
        ],
      }),
    );

    await waitForConfigurationViewToLoad();

    // Verify text fields are populated correctly
    const channelField = spectrumTextField("mediaChannelField");
    expect(channelField.getValue()).toBe("channel");

    const playerNameField = spectrumTextField("mediaPlayerNameField");
    expect(playerNameField.getValue()).toBe("name");

    const appVersionField = spectrumTextField("mediaVersionField");
    expect(appVersionField.getValue()).toBe("1.0");

    // Verify number fields are populated correctly
    const adPingIntervalField = spectrumNumberField("mediaAdPingIntervalField");
    expect(adPingIntervalField.getNumericValue()).toBe(8);

    const mainPingIntervalField = spectrumNumberField(
      "mediaMainPingIntervalField",
    );
    expect(mainPingIntervalField.getNumericValue()).toBe(20);
  });

  it("updates form values and saves to settings", async () => {
    renderView(ConfigurationView);

    extensionBridge.init(buildSettings());

    await waitForConfigurationViewToLoad();

    // Fill in text fields
    const channelField = spectrumTextField("mediaChannelField");
    await channelField.fill("test-channel");

    const playerNameField = spectrumTextField("mediaPlayerNameField");
    await playerNameField.fill("test-player");

    const appVersionField = spectrumTextField("mediaVersionField");
    await appVersionField.fill("2.0");

    // Fill in number fields
    const adPingIntervalField = spectrumNumberField("mediaAdPingIntervalField");
    await adPingIntervalField.fill("5");

    const mainPingIntervalField = spectrumNumberField(
      "mediaMainPingIntervalField",
    );
    await mainPingIntervalField.fill("30");

    // Get settings and verify
    const settings = await extensionBridge.getSettings();
    expect(settings.instances[0].streamingMedia.channel).toBe("test-channel");
    expect(settings.instances[0].streamingMedia.playerName).toBe("test-player");
    expect(settings.instances[0].streamingMedia.appVersion).toBe("2.0");
    expect(settings.instances[0].streamingMedia.adPingInterval).toBe(5);
    expect(settings.instances[0].streamingMedia.mainPingInterval).toBe(30);
  });
});
