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

import { expect } from "vitest";
import { userEvent } from "vitest/browser";
import defer from "../../../src/view/utils/defer";
import renderView from "./renderView";

const READY_EVENT = "extension-reactor-alloy:rendered";
const identity = (x) => x;

export default async function useView(View) {
  const deferredRegistration = defer();

  const driver = {
    openCodeEditorMock: async ({ code }) => {
      return Promise.resolve(`${code} + modified code`);
    },
    openRegexTesterMock: async () => {
      return Promise.resolve(
        `Edited Regex ${Math.round(Math.random() * 10000)}`,
      );
    },
    openDataElementSelectorMock: async ({ tokenize }) => {
      return Promise.resolve(
        tokenize ? "%data element name%" : "data element name",
      );
    },
    ready: new Promise((resolve) => {
      const handler = () => {
        window.removeEventListener(READY_EVENT, handler);
        resolve();
      };
      window.addEventListener(READY_EVENT, handler);
    }),
  };

  window.extensionBridge = {
    register(options) {
      deferredRegistration.resolve(options);
    },
    openCodeEditor: (...args) => driver.openCodeEditorMock(...args),
    openRegexTester: (...args) => driver.openRegexTesterMock(...args),
    openDataElementSelector: (...args) =>
      driver.openDataElementSelectorMock(...args),
  };

  const view = await renderView(View);
  const registration = await deferredRegistration.promise;

  driver.init = (initInfo) => {
    registration.init({
      company: { orgId: "1234@AdobeOrg" },
      tokens: { imsAccess: "IMS_ACCESS" },
      propertySettings: { id: "PR1234" },
      ...initInfo,
    });
    return driver.ready;
  };
  driver.validate = async (...args) => {
    return registration.validate(...args);
  };
  driver.getSettings = async (...args) => {
    return registration.getSettings(...args);
  };
  driver.expectSettings = (getProperty = identity) => {
    return expect.poll(
      async () => {
        await userEvent.keyboard("{Tab}");
        return getProperty(await registration.getSettings());
      },
      { timeout: 500, interval: 50 },
    );
  };
  driver.expectValidate = () => {
    return expect.poll(
      async () => {
        await userEvent.keyboard("{Tab}");
        return registration.validate();
      },
      { timeout: 500, interval: 50 },
    );
  };

  const cleanup = () => {
    view.unmount();
    delete window.extensionBridge;
  };

  return { view, driver, cleanup };
}
