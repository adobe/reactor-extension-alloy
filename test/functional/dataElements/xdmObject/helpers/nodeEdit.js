/*
Copyright 2020 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
*/

import spectrum from "../../../helpers/spectrum";
import { createTestIdSelector } from "../../../helpers/dataTestIdSelectors";

/**
 * Provides methods for managing form fields when editing a node.
 */
export default {
  selectPartsPopulationStrategy: async () => {
    await spectrum
      .radio(createTestIdSelector("partsPopulationStrategyField"))
      .click();
  },
  selectWholePopulationStrategy: async () => {
    await spectrum
      .radio(createTestIdSelector("wholePopulationStrategyField"))
      .click();
  },
  enterWholeValue: async text => {
    await spectrum
      .textfield(createTestIdSelector("wholeValueField"))
      .typeText(text);
  },
  expectWholeValue: async text => {
    await spectrum
      .textfield(createTestIdSelector("wholeValueField"))
      .expectValue(text);
  }
};
