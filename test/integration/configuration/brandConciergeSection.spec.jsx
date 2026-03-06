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
let stickyConversationSessionField;
let streamTimeoutField;
let brandConciergeComponentCheckbox;

describe("Config brand concierge section", () => {
  beforeEach(async () => {
    ({ view, driver, cleanup } = await useView(ConfigurationView));
    stickyConversationSessionField = view.getByTestId(
      "stickyConversationSessionField",
    );
    streamTimeoutField = view.getByTestId("streamTimeoutDataTestId");
    brandConciergeComponentCheckbox = view.getByTestId(
      "brandConciergeComponentCheckbox",
    );
  });

  afterEach(() => {
    cleanup();
  });

  it("sets form values from settings", async () => {
    await driver.init(
      buildSettings({
        components: {
          brandConcierge: true,
        },
        instances: [
          {
            name: "alloy",
            conversation: {
              stickyConversationSession: true,
              streamTimeout: 20000,
            },
          },
        ],
      }),
    );

    await expect.element(stickyConversationSessionField).toBeChecked();
    await expect.element(streamTimeoutField).toHaveValue("20");
  });

  it("updates form values and saves to settings", async () => {
    await driver.init(
      buildSettings({
        components: {
          brandConcierge: true,
        },
      }),
    );

    await stickyConversationSessionField.click();

    await streamTimeoutField.fill("30");
    await userEvent.keyboard("{Tab}");

    await driver
      .expectSettings(
        (s) => s.instances[0].conversation.stickyConversationSession,
      )
      .toBe(true);
    await driver
      .expectSettings((s) => s.instances[0].conversation.streamTimeout)
      .toBe(30000);
  });

  it("does not emit brand concierge settings when component is disabled", async () => {
    await driver.init(
      buildSettings({
        components: {
          brandConcierge: true,
        },
        instances: [
          {
            name: "alloy",
            conversation: {
              stickyConversationSession: true,
              streamTimeout: 15000,
            },
          },
        ],
      }),
    );

    await expandAccordion("Build options");
    await brandConciergeComponentCheckbox.click();

    await driver
      .expectSettings((s) => s.instances[0].conversation)
      .toBeUndefined();
  });

  it("shows alert panel when brand concierge component is disabled", async () => {
    await driver.init(buildSettings());
    await expect
      .element(
        view.getByRole("heading", {
          name: /brand concierge component disabled/i,
        }),
      )
      .toBeVisible();
  });

  it("shows alert when component is toggled off", async () => {
    await driver.init(
      buildSettings({
        components: {
          brandConcierge: true,
        },
      }),
    );

    await expandAccordion("Build options");
    await brandConciergeComponentCheckbox.click();

    await expect
      .element(
        view.getByRole("heading", {
          name: /brand concierge component disabled/i,
        }),
      )
      .toBeVisible();
  });

  it("converts stream timeout from milliseconds to seconds on load", async () => {
    await driver.init(
      buildSettings({
        components: {
          brandConcierge: true,
        },
        instances: [
          {
            name: "alloy",
            conversation: {
              streamTimeout: 45000,
            },
          },
        ],
      }),
    );

    await expect.element(streamTimeoutField).toHaveValue("45");
  });

  it("does not save stream timeout when it equals default value", async () => {
    await driver.init(
      buildSettings({
        components: {
          brandConcierge: true,
        },
      }),
    );

    await driver
      .expectSettings((s) => s.instances[0].conversation?.streamTimeout)
      .toBeUndefined();
  });
});
