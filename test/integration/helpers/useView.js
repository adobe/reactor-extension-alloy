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

const withTimeoutAndRetries = (fn, timeout = 1000, retries = 3) => {
  let i = 0;
  while (true) {
    try {
      return Promise.race([
        fn(),
        new Promise((resolve, reject) => {
          setTimeout(() => reject(new Error("Timeout")), timeout);
        }),
      ]);
    } catch (error) {
      console.error(
        "withTimeoutAndRetries error in attempt",
        i + 1,
        error.message.split("\n")[0],
      );
      if (i >= retries - 1) {
        throw error;
      }
    }
    i += 1;
  }
};

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
  driver.validate = async () => {
    return registration.validate();
  };
  driver.getSettings = async () => {
    return registration.getSettings();
  };
  driver.tab = async () => {
    await userEvent.keyboard("{Tab}");
  };
  driver.expectSettings = (getProperty = identity) => {
    return expect.poll(
      async () =>
        withTimeoutAndRetries(async () =>
          getProperty(await registration.getSettings()),
        ),
      { timeout: 500 },
    );
  };
  driver.expectValidate = () => {
    return expect.poll(() =>
      withTimeoutAndRetries(async () => registration.validate()),
    );
  };

  const cleanup = () => {
    view.unmount();
    delete window.extensionBridge;
  };

  return { view, driver, cleanup };
}
