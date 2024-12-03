/*
Copyright 2024 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
*/

import spectrum from '../dom/spectrum';

const jsonArrayField = (type, dataTestId) => (index) => {
  return spectrum[type](`${dataTestId}${index}`);
};

// Population Strategy Options
export const individualAttributesOption = spectrum.radio("partsPopulationStrategyField");
export const entireObjectOption = spectrum.radio("wholePopulationStrategyField");

// Key-Value Fields
export const key = jsonArrayField("textField", "keyField");
export const value = jsonArrayField("textField", "valueField");

// Buttons
export const propertyAddButton = spectrum.button("addPropertyButton");

// JSON Editor
export const jsonEditor = spectrum.textArea("valueField");

// Helper Functions
export const enterKeyValue = async (index, keyText, valueText) => {
  await key(index).typeText(keyText);
  await value(index).typeText(valueText);
};

export const expectKeyValue = async (index, keyText, valueText) => {
  await key(index).expectValue(keyText);
  await value(index).expectValue(valueText);
};

export const expectExists = async (index) => {
  await key(index).expectExists();
  await value(index).expectExists();
};

export const expectNotExists = async (index) => {
  await key(index).expectNotExists();
  await value(index).expectNotExists();
};

export const expectError = async (index) => {
  await key(index).expectError();
  await value(index).expectError();
};

export const expectNoError = async (index) => {
  await key(index).expectNoError();
  await value(index).expectNoError();
}; 