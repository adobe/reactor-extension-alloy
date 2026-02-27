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
const identity = (x) => x;

export const wrapModel = (
  model,
  {
    transformValues = identity,
    transformSettings = identity,
    key = undefined,
    visible,
  } = {},
) => {
  const newModel = {
    ...model,
    initialize(settings) {
      let resolvedSettings = settings;
      if (key) {
        const objSettings = settings || {};
        resolvedSettings = objSettings[key];
      }
      model.initialize(transformSettings(resolvedSettings));
    },
    validate() {
      const isValid = model.validate();
      if (visible && !visible.value) {
        return true;
      }
      return isValid;
    },
    getSettings() {
      if (visible && !visible.value) {
        return key ? {} : undefined;
      }
      const values = model.getSettings();
      const settings = transformValues(values);
      if (key) {
        return settings === undefined ? {} : { [key]: settings };
      }
      return settings;
    },
  };
  if (visible) {
    newModel.signals = Object.freeze({
      ...model.signals,
      visible,
    });
  }
  return Object.freeze(newModel);
};

export const withOptions =
  (createModel) =>
  (
    arg1,
    { transformValues, transformSettings, key, visible, ...otherOptions } = {},
  ) => {
    const wrappedModel = createModel(arg1, otherOptions);
    return wrapModel(wrappedModel, {
      transformValues,
      transformSettings,
      key,
      visible,
    });
  };
