/*
Copyright 2025 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
*/

// eslint-disable-next-line import/no-unresolved
import { page, userEvent } from "vitest/browser";

/**
 * Click on an accordion/disclosure button to expand it
 * @param {string} name - The accessible name of the button (text or regex)
 */
export const clickAccordion = async (name) => {
  await page.getByRole("button", { name }).click();
};

/**
 * Helper to interact with Spectrum TextField components
 * @param {string} testId - The data-test-id attribute value
 * @returns {Object} Helper methods for TextField interaction
 */
export const spectrumTextField = (testId) => {
  return {
    /**
     * Type text into the text field
     * @param {string} text - Text to type
     */
    type: async (text) => {
      await page.getByTestId(testId).type(text);
    },

    /**
     * Clear the text field and type new text
     * @param {string} text - Text to type
     */
    fill: async (text) => {
      await page.getByTestId(testId).clear();
      await page.getByTestId(testId).fill(text);
      // Tab away to trigger blur and ensure all handlers complete
      await userEvent.keyboard("{Tab}");
    },

    /**
     * Clear the text field
     */
    clear: async () => {
      await page.getByTestId(testId).clear();
    },

    /**
     * Get the current value of the text field
     * @returns {string} The current value
     */
    getValue: async () => {
      return page.getByTestId(testId).element().value;
    },

    /**
     * Check if the text field has an error
     * @returns {boolean} True if field has error
     */
    hasError: async () => {
      return (
        page.getByTestId(testId).element().getAttribute("aria-invalid") ===
        "true"
      );
    },

    /**
     * Get the error message if present
     * @returns {string|null} The error message or null
     */
    getErrorMessage: async () => {
      const element = page.getByTestId(testId).element();
      const errorId = element.getAttribute("aria-describedby");
      if (!errorId) return null;
      const errorElement = document.getElementById(errorId);
      return errorElement ? errorElement.textContent : null;
    },

    /**
     * Check if the text field is disabled
     * @returns {boolean} True if field is disabled
     */
    isDisabled: async () => {
      return page.getByTestId(testId).element().disabled;
    },

    /**
     * Get the raw input element
     * @returns {HTMLElement} The input element
     */
    getElement: async () => {
      return page.getByTestId(testId).element();
    },
  };
};

/**
 * Helper to interact with Spectrum NumberField components
 * @param {string} testId - The data-test-id attribute value
 * @returns {Object} Helper methods for NumberField interaction
 */
export const spectrumNumberField = (testId) => {
  return {
    /**
     * Type a number into the number field
     * @param {string|number} value - Number to type
     */
    type: async (value) => {
      await page.getByTestId(testId).type(String(value));
    },

    /**
     * Clear the number field and type a new number
     * @param {string|number} value - Number to type
     */
    fill: async (value) => {
      await page.getByTestId(testId).clear();
      await page.getByTestId(testId).fill(String(value));
      // Tab away to trigger blur and ensure all handlers complete
      await userEvent.keyboard("{Tab}");
    },

    /**
     * Clear the number field
     */
    clear: async () => {
      await page.getByTestId(testId).clear();
    },

    /**
     * Get the current value of the number field
     * @returns {string} The current value
     */
    getValue: async () => {
      return page.getByTestId(testId).element().value;
    },

    /**
     * Get the current value as a number
     * @returns {number|null} The current value as a number, or null if empty
     */
    getNumericValue: async () => {
      const element = page.getByTestId(testId).element();
      const value = element.value;
      return value === "" ? null : Number(value);
    },

    /**
     * Increment the value using the up arrow key
     */
    increment: async () => {
      await page.getByTestId(testId).click();
      await userEvent.keyboard("{ArrowUp}");
      // Tab away to trigger blur and ensure all handlers complete
      await userEvent.keyboard("{Tab}");
    },

    /**
     * Decrement the value using the down arrow key
     */
    decrement: async () => {
      await page.getByTestId(testId).click();
      await userEvent.keyboard("{ArrowDown}");
      // Tab away to trigger blur and ensure all handlers complete
      await userEvent.keyboard("{Tab}");
    },

    /**
     * Check if the number field has an error
     * @returns {boolean} True if field has error
     */
    hasError: async () => {
      return (
        page.getByTestId(testId).element().getAttribute("aria-invalid") ===
        "true"
      );
    },

    /**
     * Get the error message if present
     * @returns {string|null} The error message or null
     */
    getErrorMessage: async () => {
      const element = page.getByTestId(testId).element();
      const errorId = element.getAttribute("aria-describedby");
      if (!errorId) return null;
      const errorElement = document.getElementById(errorId);
      return errorElement ? errorElement.textContent : null;
    },

    /**
     * Check if the number field is disabled
     * @returns {boolean} True if field is disabled
     */
    isDisabled: async () => {
      return page.getByTestId(testId).element().disabled;
    },

    /**
     * Get the raw input element
     * @returns {HTMLElement} The input element
     */
    getElement: async () => {
      return page.getByTestId(testId).element();
    },
  };
};

/**
 * Helper to interact with Spectrum Checkbox components
 * @param {string} testId - The data-test-id attribute value
 * @returns {Object} Helper methods for Checkbox interaction
 */
export const spectrumCheckbox = (testId) => {
  return {
    /**
     * Click the checkbox to toggle its state
     */
    click: async () => {
      await page.getByTestId(testId).click();
    },

    /**
     * Check (select) the checkbox if it's not already checked
     */
    check: async () => {
      const element = page.getByTestId(testId).element();
      if (!element.checked) {
        await page.getByTestId(testId).click();
      }
    },

    /**
     * Uncheck (deselect) the checkbox if it's currently checked
     */
    uncheck: async () => {
      const element = page.getByTestId(testId).element();
      if (element.checked) {
        await page.getByTestId(testId).click();
      }
    },

    /**
     * Check if the checkbox is checked
     * @returns {boolean} True if checkbox is checked
     */
    isChecked: async () => {
      return page.getByTestId(testId).element().checked;
    },

    /**
     * Check if the checkbox has an error
     * @returns {boolean} True if checkbox has error
     */
    hasError: async () => {
      return (
        page.getByTestId(testId).element().getAttribute("aria-invalid") ===
        "true"
      );
    },

    /**
     * Get the error message if present
     * @returns {string|null} The error message or null
     */
    getErrorMessage: async () => {
      const element = page.getByTestId(testId).element();
      const errorId = element.getAttribute("aria-describedby");
      if (!errorId) return null;
      const errorElement = document.getElementById(errorId);
      return errorElement ? errorElement.textContent : null;
    },

    /**
     * Check if the checkbox is disabled
     * @returns {boolean} True if checkbox is disabled
     */
    isDisabled: async () => {
      return page.getByTestId(testId).element().disabled;
    },

    /**
     * Get the raw input element
     * @returns {HTMLElement} The input element
     */
    getElement: async () => {
      return page.getByTestId(testId).element();
    },
  };
};
