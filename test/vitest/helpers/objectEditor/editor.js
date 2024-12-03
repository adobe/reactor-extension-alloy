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

import { screen } from '@testing-library/dom';
import userEvent from '@testing-library/user-event';
import spectrum from '../dom/spectrum';

const user = userEvent.setup();

/**
 * Base editor functionality shared across different editor types.
 */
export default {
  async expectIsValid() {
    const editor = screen.getByTestId('editor');
    expect(editor).not.toHaveClass('is-invalid');
  },

  async expectIsNotValid() {
    const editor = screen.getByTestId('editor');
    expect(editor).toHaveClass('is-invalid');
  },

  async expectExists() {
    const editor = screen.queryByTestId('editor');
    expect(editor).toBeTruthy();
  },

  async expectNotExists() {
    const editor = screen.queryByTestId('editor');
    expect(editor).toBeFalsy();
  },

  async expectSchemaFieldValue(value) {
    await spectrum.comboBox("schemaField").expectValue(value);
  },

  async selectSchemaField(value) {
    await spectrum.comboBox("schemaField").selectOption(value);
  },

  async expectSchemaFieldExists() {
    await spectrum.comboBox("schemaField").expectExists();
  },

  async expectSchemaFieldNotExists() {
    await spectrum.comboBox("schemaField").expectNotExists();
  },

  async expectSchemaFieldEnabled() {
    await spectrum.comboBox("schemaField").expectEnabled();
  },

  async expectSchemaFieldDisabled() {
    await spectrum.comboBox("schemaField").expectDisabled();
  },

  async expectSchemaFieldError() {
    await spectrum.comboBox("schemaField").expectError();
  },

  async expectSchemaFieldNoError() {
    await spectrum.comboBox("schemaField").expectNoError();
  }
}; 