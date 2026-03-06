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

import { userEvent } from "vitest/browser";
import useView from "../helpers/useView";
import ConfigurationView from "../../../src/view/configuration/configurationView";
import { expandAccordion } from "../helpers/ui";
import { buildSettings } from "../helpers/settingsUtils";

let view;
let driver;
let cleanup;
let mediaChannelField;
let mediaPlayerNameField;
let mediaVersionField;
let mediaAdPingIntervalField;
let mediaMainPingIntervalField;
let streamingMediaComponentCheckbox;

const fillNumberAndBlur = async (locator, value) => {
  await locator.fill(String(value));
  await userEvent.keyboard("{Tab}");
};

describe("Config streaming media section", () => {
  beforeEach(async () => {
    ({ view, driver, cleanup } = await useView(ConfigurationView));
    mediaChannelField = view.getByTestId("mediaChannelField");
    mediaPlayerNameField = view.getByTestId("mediaPlayerNameField");
    mediaVersionField = view.getByTestId("mediaVersionField");
    mediaAdPingIntervalField = view.getByTestId("mediaAdPingIntervalField");
    mediaMainPingIntervalField = view.getByTestId("mediaMainPingIntervalField");
    streamingMediaComponentCheckbox = view.getByTestId(
      "streamingMediaComponentCheckbox",
    );
  });

  afterEach(() => {
    cleanup();
  });

  it("sets form values from settings", async () => {
    await driver.init(
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

    await expect.element(mediaChannelField).toHaveValue("channel");
    await expect.element(mediaPlayerNameField).toHaveValue("name");
    await expect.element(mediaVersionField).toHaveValue("1.0");
    await expect.element(mediaAdPingIntervalField).toHaveValue("8");
    await expect.element(mediaMainPingIntervalField).toHaveValue("20");
  });

  it("updates form values and saves to settings", async () => {
    await driver.init(buildSettings());

    await mediaChannelField.fill("test-channel");
    await mediaPlayerNameField.fill("test-player");
    await mediaVersionField.fill("2.0");
    await fillNumberAndBlur(mediaAdPingIntervalField, 5);
    await fillNumberAndBlur(mediaMainPingIntervalField, 30);

    const settings = await driver.getSettings();
    expect(settings.instances[0].streamingMedia).toMatchObject({
      channel: "test-channel",
      playerName: "test-player",
      appVersion: "2.0",
      adPingInterval: 5,
      mainPingInterval: 30,
    });
  });

  it("saves settings with only channel and player name provided", async () => {
    await driver.init(buildSettings());

    await mediaChannelField.fill("test-channel");
    await mediaPlayerNameField.fill("test-player");

    const settings = await driver.getSettings();
    expect(settings.instances[0].streamingMedia).toMatchObject({
      channel: "test-channel",
      playerName: "test-player",
    });
  });

  it("shows alert panel when component is disabled", async () => {
    await driver.init(
      buildSettings({
        components: {
          streamingMedia: false,
        },
      }),
    );

    await expect
      .element(
        view.getByRole("heading", {
          name: /streaming media component disabled/i,
        }),
      )
      .toBeVisible();
  });

  it("hides form fields and shows alert when component is toggled off", async () => {
    await driver.init(buildSettings());
    await expandAccordion("Build options");
    await streamingMediaComponentCheckbox.click();

    await expect
      .element(
        view.getByRole("heading", {
          name: /streaming media component disabled/i,
        }),
      )
      .toBeVisible();
  });

  describe("validation", () => {
    it("requires channel when player name is provided", async () => {
      await driver.init(buildSettings());
      expect(await driver.validate()).toBe(true);

      await mediaPlayerNameField.fill("test-player");
      await mediaChannelField.fill("");

      expect(await driver.validate()).toBe(false);

      await expect.element(mediaChannelField).not.toBeValid();
      await expect
        .element(mediaChannelField)
        .toHaveAccessibleDescription(
          /please provide a channel name for streaming media/i,
        );
    });

    it("requires player name when channel is provided", async () => {
      await driver.init(buildSettings());
      expect(await driver.validate()).toBe(true);

      await mediaChannelField.fill("test-channel");
      await mediaPlayerNameField.fill("");

      expect(await driver.validate()).toBe(false);

      await expect.element(mediaPlayerNameField).not.toBeValid();
      await expect
        .element(mediaPlayerNameField)
        .toHaveAccessibleDescription(
          /please provide a player name for streaming media/i,
        );
    });

    it("validates ad ping interval minimum value", async () => {
      await driver.init(buildSettings());
      expect(await driver.validate()).toBe(true);

      await mediaChannelField.fill("test-channel");
      await mediaPlayerNameField.fill("test-player");
      await fillNumberAndBlur(mediaAdPingIntervalField, 0);

      expect(await driver.validate()).toBe(false);

      await expect.element(mediaAdPingIntervalField).not.toBeValid();
      await expect
        .element(mediaAdPingIntervalField)
        .toHaveAccessibleDescription(
          /the ad ping interval must be greater than 1 second/i,
        );
    });

    it("validates ad ping interval maximum value", async () => {
      await driver.init(buildSettings());
      expect(await driver.validate()).toBe(true);

      await mediaChannelField.fill("test-channel");
      await mediaPlayerNameField.fill("test-player");
      await fillNumberAndBlur(mediaAdPingIntervalField, 11);

      expect(await driver.validate()).toBe(false);

      await expect.element(mediaAdPingIntervalField).not.toBeValid();
      await expect
        .element(mediaAdPingIntervalField)
        .toHaveAccessibleDescription(
          /the ad ping interval must be less than 10 seconds/i,
        );
    });

    it("validates main ping interval minimum value", async () => {
      await driver.init(buildSettings());
      expect(await driver.validate()).toBe(true);

      await mediaChannelField.fill("test-channel");
      await mediaPlayerNameField.fill("test-player");
      await fillNumberAndBlur(mediaMainPingIntervalField, 9);

      expect(await driver.validate()).toBe(false);

      await expect.element(mediaMainPingIntervalField).not.toBeValid();
      await expect
        .element(mediaMainPingIntervalField)
        .toHaveAccessibleDescription(
          /the main ping interval must be greater than 10 seconds/i,
        );
    });

    it("validates main ping interval maximum value", async () => {
      await driver.init(buildSettings());
      expect(await driver.validate()).toBe(true);

      await mediaChannelField.fill("test-channel");
      await mediaPlayerNameField.fill("test-player");
      await fillNumberAndBlur(mediaMainPingIntervalField, 61);

      expect(await driver.validate()).toBe(false);

      await expect.element(mediaMainPingIntervalField).not.toBeValid();
      await expect
        .element(mediaMainPingIntervalField)
        .toHaveAccessibleDescription(
          /the main ping interval must be less than 60 seconds/i,
        );
    });

    it("accepts valid ad ping interval values", async () => {
      await driver.init(buildSettings());
      expect(await driver.validate()).toBe(true);

      await mediaChannelField.fill("test-channel");
      await mediaPlayerNameField.fill("test-player");
      await fillNumberAndBlur(mediaAdPingIntervalField, 5);

      expect(await driver.validate()).toBe(true);
    });

    it("accepts valid main ping interval values", async () => {
      await driver.init(buildSettings());
      expect(await driver.validate()).toBe(true);

      await mediaChannelField.fill("test-channel");
      await mediaPlayerNameField.fill("test-player");
      await fillNumberAndBlur(mediaMainPingIntervalField, 30);

      expect(await driver.validate()).toBe(true);
    });

    it("disables interval fields when channel and player name are not provided", async () => {
      await driver.init(buildSettings());
      expect(await driver.validate()).toBe(true);

      await expect.element(mediaAdPingIntervalField).toBeDisabled();
      await expect.element(mediaMainPingIntervalField).toBeDisabled();
    });
  });
});
