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

/**
 * Provides methods for managing form fields when editing an array node.
 */
export default {
  async addItem() {
    await spectrum.button("addItemButton").click();
  },

  async removeItem(index) {
    await spectrum.button(`item${index}RemoveButton`).click();
  },

  async clickItem(index) {
    await spectrum.button(`item${index}SelectButton`).click();
  },

  async selectPartsPopulationStrategy() {
    await spectrum.radio("partsPopulationStrategyField").click();
  },

  async selectWholePopulationStrategy() {
    await spectrum.radio("wholePopulationStrategyField").click();
  },

  async enterValue(text) {
    await spectrum.textField("valueField").typeText(text);
  },

  async expectValue(text) {
    await spectrum.textField("valueField").expectValue(text);
  },

  async enterItemValue(index, text) {
    await spectrum.textField(`item${index}ValueField`).typeText(text);
  },

  async expectItemValue(index, text) {
    await spectrum.textField(`item${index}ValueField`).expectValue(text);
  },

  async expectItemExists(index) {
    await spectrum.textField(`item${index}ValueField`).expectExists();
  },

  async expectItemNotExists(index) {
    await spectrum.textField(`item${index}ValueField`).expectNotExists();
  }
}; 