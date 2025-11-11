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
  const button = page.getByRole("button", { name });
  await button.click();
};

/**
 * Helper to interact with Spectrum TextField components
 * @param {string} testId - The data-test-id attribute value
 * @returns {Object} Helper methods for TextField interaction
 */
export const spectrumTextField = (testId) => {
  const getInput = () => page.getByTestId(testId);

  return {
    /**
     * Type text into the text field
     * @param {string} text - Text to type
     */
    type: async (text) => {
      const input = getInput();
      await input.type(text);
    },

    /**
     * Clear the text field and type new text
     * @param {string} text - Text to type
     */
    fill: async (text) => {
      const input = getInput();
      await input.clear();
      await input.fill(text);
      // Tab away to trigger blur and ensure all handlers complete
      await userEvent.keyboard("{Tab}");
    },

    /**
     * Clear the text field
     */
    clear: async () => {
      const input = getInput();
      await input.clear();
    },

    /**
     * Get the current value of the text field
     * @returns {string} The current value
     */
    getValue: async () => {
      const input = getInput();
      const element = await input.element();
      return element.value;
    },

    /**
     * Check if the text field has an error
     * @returns {boolean} True if field has error
     */
    hasError: async () => {
      const input = getInput();
      const element = await input.element();
      return element.getAttribute("aria-invalid") === "true";
    },

    /**
     * Get the error message if present
     * @returns {string|null} The error message or null
     */
    getErrorMessage: async () => {
      const input = getInput();
      const element = await input.element();
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
      const input = getInput();
      const element = await input.element();
      return element.disabled;
    },

    /**
     * Get the raw input element
     * @returns {HTMLElement} The input element
     */
    getElement: async () => {
      const input = getInput();
      return input.element();
    },
  };
};

/**
 * Helper to interact with Spectrum NumberField components
 * @param {string} testId - The data-test-id attribute value
 * @returns {Object} Helper methods for NumberField interaction
 */
export const spectrumNumberField = (testId) => {
  const getInput = () => page.getByTestId(testId);

  return {
    /**
     * Type a number into the number field
     * @param {string|number} value - Number to type
     */
    type: async (value) => {
      const input = getInput();
      await input.type(String(value));
    },

    /**
     * Clear the number field and type a new number
     * @param {string|number} value - Number to type
     */
    fill: async (value) => {
      const input = getInput();
      await input.clear();
      await input.fill(String(value));
      // Tab away to trigger blur and ensure all handlers complete
      await userEvent.keyboard("{Tab}");
    },

    /**
     * Clear the number field
     */
    clear: async () => {
      const input = getInput();
      await input.clear();
    },

    /**
     * Get the current value of the number field
     * @returns {string} The current value
     */
    getValue: async () => {
      const input = getInput();
      const element = await input.element();
      return element.value;
    },

    /**
     * Get the current value as a number
     * @returns {number|null} The current value as a number, or null if empty
     */
    getNumericValue: async () => {
      const input = getInput();
      const element = await input.element();
      const value = element.value;
      return value === "" ? null : Number(value);
    },

    /**
     * Increment the value using the up arrow button
     */
    increment: async () => {
      const input = getInput();
      const element = await input.element();
      // Find the stepper buttons by their accessible names
      const buttons = document.querySelectorAll(
        'button[aria-label*="increase"]',
      );
      for (const button of buttons) {
        const container = button.parentElement;
        if (container && container.contains(element)) {
          await button.click();
          break;
        }
      }
    },

    /**
     * Decrement the value using the down arrow button
     */
    decrement: async () => {
      const input = getInput();
      const element = await input.element();
      // Find the stepper buttons by their accessible names
      const buttons = document.querySelectorAll(
        'button[aria-label*="decrease"]',
      );
      for (const button of buttons) {
        const container = button.parentElement;
        if (container && container.contains(element)) {
          await button.click();
          break;
        }
      }
    },

    /**
     * Check if the number field has an error
     * @returns {boolean} True if field has error
     */
    hasError: async () => {
      const input = getInput();
      const element = await input.element();
      return element.getAttribute("aria-invalid") === "true";
    },

    /**
     * Get the error message if present
     * @returns {string|null} The error message or null
     */
    getErrorMessage: async () => {
      const input = getInput();
      const element = await input.element();
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
      const input = getInput();
      const element = await input.element();
      return element.disabled;
    },

    /**
     * Get the raw input element
     * @returns {HTMLElement} The input element
     */
    getElement: async () => {
      const input = getInput();
      return input.element();
    },
  };
};
