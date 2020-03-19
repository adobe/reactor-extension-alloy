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
 * Provides methods for managing an array's items when on the array's edit view.
 */
export default {
  addItem: async () => {
    await spectrum.button(createTestIdSelector("addItemButton")).click();
  },
  removeItem: async index => {
    await spectrum
      .button(createTestIdSelector(`item${index}RemoveButton`))
      .click();
  },
  clickItem: async index => {
    await spectrum
      .button(createTestIdSelector(`item${index}SelectButton`))
      .click();
  }
};
