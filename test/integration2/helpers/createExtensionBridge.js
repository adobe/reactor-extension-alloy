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

export default () => {
  let registeredOptions;

  return {
    register(options) {
      registeredOptions = options;
    },

    init(initInfo) {
      initInfo = {
        company: { orgId: "ORG_ID" },
        tokens: { imsAccess: "IMS_ACCESS" },
        propertySettings: { id: "PROPERTY_ID" },
        ...initInfo,
      };

      registeredOptions.init.apply(this, [initInfo]);
    },

    async validate(...args) {
      const validationResult = registeredOptions.validate.apply(this, args);
      return validationResult;
    },

    getSettings(...args) {
      return registeredOptions.getSettings.apply(this, args);
    },

    openCodeEditor({ code }) {
      return Promise.resolve(`${code} + modified code`);
    },

    openRegexTester() {},

    openDataElementSelector({ tokenize }) {
      return Promise.resolve(
        tokenize ? "%data element name%" : "data element name",
      );
    },
  };
};
