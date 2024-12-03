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
 * Provides methods for managing form fields when editing a boolean node.
 */
export default {
  async selectDataElementInputMethod() {
    await spectrum.radio("dataElementInputMethodField").click();
  },

  async selectConstantInputMethod() {
    await spectrum.radio("valueInputMethodField").click();
  },

  async selectConstantNoValueField() {
    await spectrum.radio("constantNoValueField").click();
  },

  async selectConstantTrueValueField() {
    await spectrum.radio("constantTrueField").click();
  },

  async selectConstantFalseValueField() {
    await spectrum.radio("constantFalseField").click();
  },

  async expectConstantNoValue() {
    await spectrum.radio("constantNoValueField").expectChecked();
  },

  async expectConstantTrueValue() {
    await spectrum.radio("constantTrueField").expectChecked();
  },

  async expectConstantFalseValue() {
    await spectrum.radio("constantFalseField").expectChecked();
  },

  async enterDataElementValue(text) {
    await spectrum.textField("dataElementValueField").typeText(text);
  },

  async expectDataElementValue(label) {
    await spectrum.textField("dataElementValueField").expectValue(label);
  },

  async check() {
    await spectrum.checkbox("valueField").click();
  },

  async uncheck() {
    await spectrum.checkbox("valueField").click();
  },

  async expectChecked() {
    await spectrum.checkbox("valueField").expectChecked();
  },

  async expectUnchecked() {
    await spectrum.checkbox("valueField").expectUnchecked();
  }
}; 