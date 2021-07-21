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

import spectrum from "../../../helpers/spectrum3";

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
  selectConstantNoValueField: async () => {
    await spectrum.radio("constantNoValueField").click();
  },
  selectConstantTrueValueField: async () => {
    await spectrum.radio("constantTrueField").click();
  },
  selectConstantFalseValueField: async () => {
    await spectrum.radio("constantFalseField").click();
  },
  expectConstantNoValue: async () => {
    await spectrum.radio("constantNoValueField").expectChecked();
  },
  expectConstantTrueValue: async () => {
    await spectrum.radio("constantTrueField").expectChecked();
  },
  expectConstantFalseValue: async () => {
    await spectrum.radio("constantFalseField").expectChecked();
  },
  enterDataElementValue: async text => {
    await spectrum.textField("dataElementValueField").typeText(text);
  },
  expectDataElementValue: async label => {
    await spectrum.textField("dataElementValueField").expectValue(label);
  }
};
