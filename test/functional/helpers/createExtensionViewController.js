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

const getSettings = async () => {
  return t.eval(() => {
    return window.initializeExtensionViewPromise.then(extensionView => {
      return extensionView.getSettings();
    });
  });
};

const validate = async () => {
  return t.eval(() => {
    return window.initializeExtensionViewPromise.then(extensionView => {
      return extensionView.validate();
    });
  });
};

module.exports = viewPath => {
  return {
    async init(initInfo = {}, sharedViewMethodMocks = {}) {
      return t.eval(
        () => {
          window.initializeExtensionViewPromise = window.initializeExtensionView(
            {
              viewPath,
              initInfo,
              sharedViewMethodMocks
            }
          );
        },
        {
          dependencies: {
            viewPath,
            initInfo,
            sharedViewMethodMocks
          }
        }
      );
    },
    getSettings,
    validate,
    async expectIsValid() {
      const valid = await validate();
      await t
        .expect(valid)
        .ok("Expected settings to be valid when they were not valid");
    },
    async expectIsNotValid() {
      const valid = await validate();
      await t
        .expect(valid)
        .notOk("Expected settings to not be valid when they were valid");
    },
    async expectSettings(expectedSettings) {
      const actualSettings = await getSettings();

      await t
        .expect(actualSettings)
        .eql(
          expectedSettings,
          `Expected settings: ${JSON.stringify(
            expectedSettings
          )} Actual settings: ${JSON.stringify(actualSettings)}`
        );
    }
  };
};
