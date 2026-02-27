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
import { signal, computed } from "@preact/signals";

const simpleModel = (defaultValue, { validate = () => true } = {}) => {
  const value = signal(defaultValue);
  const dirty = signal(false);
  const error = computed(() => {
    if (dirty.value) {
      return validate(value.value);
    }
    return "";
  });
  return Object.freeze({
    type: "SimpleModel",
    signals: Object.freeze({ value, dirty, error }),
    initialize(settings) {
      if (settings !== undefined) {
        this.signals.value.value = settings;
      }
    },
    getSettings() {
      return this.signals.value.value;
    },
    validate() {
      this.signals.dirty.value = true;
      return !this.signals.error.value;
    },
  });
};

export default simpleModel;
