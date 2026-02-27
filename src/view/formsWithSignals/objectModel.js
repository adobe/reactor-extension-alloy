/*
Copyright 2026 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
*/
import withOptions from "./options";

export default withOptions((models) => {
  return Object.freeze({
    type: "ObjectModel",
    models: Object.freeze(models),
    signals: Object.freeze({}),
    initialize(settings) {
      Object.values(this.models).forEach((model) => {
        model.initialize(settings);
      });
    },
    getSettings() {
      return Object.values(this.models).reduce((acc, model) => {
        const modelSettings = model.getSettings();
        if (modelSettings === undefined) {
          return acc;
        }
        return {
          ...acc,
          ...modelSettings,
        };
      }, {});
    },
    validate() {
      const valids = Object.values(this.models).map((model) =>
        model.validate(),
      );
      return valids.every((valid) => valid);
    },
  });
});
