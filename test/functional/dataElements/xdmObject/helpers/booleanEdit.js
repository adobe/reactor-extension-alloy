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

/**
 * Provides methods for managing form fields when editing a boolean node.
 */
export default {
  selectDataElementInputMethod: async () => {
    await spectrum.radio("dataElementInputMethodField").click();
  },
  selectConstantInputMethod: async () => {
    await spectrum.radio("valueInputMethodField").click();
  },
  selectConstantValue: async label => {
    await spectrum.select("constantValueField").selectOption(label);
  },
  expectConstantValue: async label => {
    await spectrum
      .select("constantValueField")
      .expectSelectedOptionLabel(label);
  },
  enterDataElementValue: async text => {
    await spectrum.textfield("dataElementValueField").typeText(text);
  },
  expectDataElementValue: async label => {
    await spectrum.textfield("dataElementValueField").expectValue(label);
  }
};
