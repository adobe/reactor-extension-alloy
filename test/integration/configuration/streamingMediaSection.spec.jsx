/* eslint-disable vitest/expect-expect */
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

import { describe, it, beforeEach, afterEach } from "vitest";
import { screen } from "@testing-library/react";
import renderView from "../helpers/renderView";
import createExtensionBridge from "../helpers/createExtensionBridge";
import ConfigurationView from "../../../src/view/configuration/configurationView";

let extensionBridge;

describe("Streming media component configuration", () => {
  beforeEach(() => {
    extensionBridge = createExtensionBridge();
    window.extensionBridge = extensionBridge;
  });

  afterEach(() => {
    delete window.extensionBridge;
  });

  it("renders the counter with initial state", async () => {
    renderView(ConfigurationView);

    extensionBridge.init({
      settings: {
        components: {
          eventMerge: false,
        },
        instances: [
          {
            name: "alloy",
          },
        ],
      },
    });

    await screen.findByRole("button", {
      name: /SDK instances/i,
    });

    const x = await extensionBridge.getSettings();
    console.log(x);
  });

  it("renders the counter with initial state - copy 2", async () => {
    renderView(ConfigurationView);

    extensionBridge.init({
      settings: {
        components: {
          eventMerge: false,
        },
        instances: [
          {
            name: "alloy",
          },
        ],
      },
    });

    await screen.findByRole("button", {
      name: /SDK instances/i,
    });

    const x = await extensionBridge.getSettings();
    console.log(x);
  });

  it("renders the counter with initial state - copy 3", async () => {
    renderView(ConfigurationView);

    extensionBridge.init({
      settings: {
        components: {
          eventMerge: false,
        },
        instances: [
          {
            name: "alloy",
          },
        ],
      },
    });

    await screen.findByRole("button", {
      name: /SDK instances/i,
    });

    const x = await extensionBridge.getSettings();
    console.log(x);
  });

  it("renders the counter with initial state - copy 4", async () => {
    renderView(ConfigurationView);

    extensionBridge.init({
      settings: {
        components: {
          eventMerge: false,
        },
        instances: [
          {
            name: "alloy",
          },
        ],
      },
    });

    await screen.findByRole("button", {
      name: /SDK instances/i,
    });

    const x = await extensionBridge.getSettings();
    console.log(x);
  });

  it("renders the counter with initial state - copy 5", async () => {
    renderView(ConfigurationView);

    extensionBridge.init({
      settings: {
        components: {
          eventMerge: false,
        },
        instances: [
          {
            name: "alloy",
          },
        ],
      },
    });

    await screen.findByRole("button", {
      name: /SDK instances/i,
    });

    const x = await extensionBridge.getSettings();
    console.log(x);
  });

  it("renders the counter with initial state - copy 6", async () => {
    renderView(ConfigurationView);

    extensionBridge.init({
      settings: {
        components: {
          eventMerge: false,
        },
        instances: [
          {
            name: "alloy",
          },
        ],
      },
    });

    await screen.findByRole("button", {
      name: /SDK instances/i,
    });

    const x = await extensionBridge.getSettings();
    console.log(x);
  });

  it("renders the counter with initial state - copy 7", async () => {
    renderView(ConfigurationView);

    extensionBridge.init({
      settings: {
        components: {
          eventMerge: false,
        },
        instances: [
          {
            name: "alloy",
          },
        ],
      },
    });

    await screen.findByRole("button", {
      name: /SDK instances/i,
    });

    const x = await extensionBridge.getSettings();
    console.log(x);
  });

  it("renders the counter with initial state - copy 8", async () => {
    renderView(ConfigurationView);

    extensionBridge.init({
      settings: {
        components: {
          eventMerge: false,
        },
        instances: [
          {
            name: "alloy",
          },
        ],
      },
    });

    await screen.findByRole("button", {
      name: /SDK instances/i,
    });

    const x = await extensionBridge.getSettings();
    console.log(x);
  });

  it("renders the counter with initial state - copy 9", async () => {
    renderView(ConfigurationView);

    extensionBridge.init({
      settings: {
        components: {
          eventMerge: false,
        },
        instances: [
          {
            name: "alloy",
          },
        ],
      },
    });

    await screen.findByRole("button", {
      name: /SDK instances/i,
    });

    const x = await extensionBridge.getSettings();
    console.log(x);
  });

  it("renders the counter with initial state - copy 10", async () => {
    renderView(ConfigurationView);

    extensionBridge.init({
      settings: {
        components: {
          eventMerge: false,
        },
        instances: [
          {
            name: "alloy",
          },
        ],
      },
    });

    await screen.findByRole("button", {
      name: /SDK instances/i,
    });

    const x = await extensionBridge.getSettings();
    console.log(x);
  });

  it("renders the counter with initial state2", async () => {
    renderView(ConfigurationView);

    extensionBridge.init({
      settings: {
        components: {
          eventMerge: false,
        },
        instances: [
          {
            name: "alloy",
          },
        ],
      },
    });

    await screen.findByRole("button", {
      name: /SDK instances/i,
    });

    const x = await extensionBridge.getSettings();
    console.log(x);
  });

  it("renders the counter with initial state2 - copy 2", async () => {
    renderView(ConfigurationView);

    extensionBridge.init({
      settings: {
        components: {
          eventMerge: false,
        },
        instances: [
          {
            name: "alloy",
          },
        ],
      },
    });

    await screen.findByRole("button", {
      name: /SDK instances/i,
    });

    const x = await extensionBridge.getSettings();
    console.log(x);
  });

  it("renders the counter with initial state2 - copy 3", async () => {
    renderView(ConfigurationView);

    extensionBridge.init({
      settings: {
        components: {
          eventMerge: false,
        },
        instances: [
          {
            name: "alloy",
          },
        ],
      },
    });

    await screen.findByRole("button", {
      name: /SDK instances/i,
    });

    const x = await extensionBridge.getSettings();
    console.log(x);
  });

  it("renders the counter with initial state2 - copy 4", async () => {
    renderView(ConfigurationView);

    extensionBridge.init({
      settings: {
        components: {
          eventMerge: false,
        },
        instances: [
          {
            name: "alloy",
          },
        ],
      },
    });

    await screen.findByRole("button", {
      name: /SDK instances/i,
    });

    const x = await extensionBridge.getSettings();
    console.log(x);
  });

  it("renders the counter with initial state2 - copy 5", async () => {
    renderView(ConfigurationView);

    extensionBridge.init({
      settings: {
        components: {
          eventMerge: false,
        },
        instances: [
          {
            name: "alloy",
          },
        ],
      },
    });

    await screen.findByRole("button", {
      name: /SDK instances/i,
    });

    const x = await extensionBridge.getSettings();
    console.log(x);
  });

  it("renders the counter with initial state2 - copy 6", async () => {
    renderView(ConfigurationView);

    extensionBridge.init({
      settings: {
        components: {
          eventMerge: false,
        },
        instances: [
          {
            name: "alloy",
          },
        ],
      },
    });

    await screen.findByRole("button", {
      name: /SDK instances/i,
    });

    const x = await extensionBridge.getSettings();
    console.log(x);
  });

  it("renders the counter with initial state2 - copy 7", async () => {
    renderView(ConfigurationView);

    extensionBridge.init({
      settings: {
        components: {
          eventMerge: false,
        },
        instances: [
          {
            name: "alloy",
          },
        ],
      },
    });

    await screen.findByRole("button", {
      name: /SDK instances/i,
    });

    const x = await extensionBridge.getSettings();
    console.log(x);
  });

  it("renders the counter with initial state2 - copy 8", async () => {
    renderView(ConfigurationView);

    extensionBridge.init({
      settings: {
        components: {
          eventMerge: false,
        },
        instances: [
          {
            name: "alloy",
          },
        ],
      },
    });

    await screen.findByRole("button", {
      name: /SDK instances/i,
    });

    const x = await extensionBridge.getSettings();
    console.log(x);
  });

  it("renders the counter with initial state2 - copy 9", async () => {
    renderView(ConfigurationView);

    extensionBridge.init({
      settings: {
        components: {
          eventMerge: false,
        },
        instances: [
          {
            name: "alloy",
          },
        ],
      },
    });

    await screen.findByRole("button", {
      name: /SDK instances/i,
    });

    const x = await extensionBridge.getSettings();
    console.log(x);
  });

  it("renders the counter with initial state2 - copy 10", async () => {
    renderView(ConfigurationView);

    extensionBridge.init({
      settings: {
        components: {
          eventMerge: false,
        },
        instances: [
          {
            name: "alloy",
          },
        ],
      },
    });

    await screen.findByRole("button", {
      name: /SDK instances/i,
    });

    const x = await extensionBridge.getSettings();
    console.log(x);
  });
});
