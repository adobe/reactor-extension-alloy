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
import { signal } from "@preact/signals";
import { withOptions } from "./options";

const arrayModel = (createItemModel) => {
  return Object.freeze({
    type: "ArrayModel",
    createItemModel,
    signals: Object.freeze({
      items: signal([]),
    }),
    initialize(settings) {
      const arraySettings = settings || [];
      this.signals.items.value = arraySettings.map((itemSettings) => {
        const model = this.createItemModel();
        model.initialize(itemSettings);
        return model;
      });
    },
    validate: () => {
      const valids = this.signals.items.value.map((item) => item.validate());
      return valids.every((valid) => valid);
    },
    getSettings: () => {
      return this.signals.items.value.map((item) => item.getSettings());
    },
  });
};

export default withOptions(arrayModel);
