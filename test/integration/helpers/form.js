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

import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

/**
 * Click on an accordion/disclosure button to expand it
 * @param {string} name - The accessible name of the button (text or regex)
 */
export const clickAccordion = async (name) => {
  const button = await screen.findByRole("button", { name });
  await userEvent.click(button);
};

/**
 * Helper to interact with Spectrum TextField components
 * @param {string} testId - The data-test-id attribute value
 * @returns {Object} Helper methods for TextField interaction
 */
export const spectrumTextField = (testId) => {
  const getInput = () => screen.getByTestId(testId);

  return {
    /**
     * Type text into the text field
     * @param {string} text - Text to type
     */
    type: async (text) => {
      const input = getInput();
      await userEvent.type(input, text);
    },

    /**
     * Clear the text field and type new text
     * @param {string} text - Text to type
     */
    fill: async (text) => {
      const input = getInput();
      await userEvent.clear(input);
      await userEvent.type(input, text);
      // Tab away to trigger blur and ensure all handlers complete
      await userEvent.tab();
    },

    /**
     * Clear the text field
     */
    clear: async () => {
      const input = getInput();
      await userEvent.clear(input);
    },

    /**
     * Get the current value of the text field
     * @returns {string} The current value
     */
    getValue: () => {
      const input = getInput();
      return input.value;
    },

    /**
     * Check if the text field has an error
     * @returns {boolean} True if field has error
     */
    hasError: () => {
      const input = getInput();
      return input.getAttribute("aria-invalid") === "true";
    },

    /**
     * Get the error message if present
     * @returns {string|null} The error message or null
     */
    getErrorMessage: () => {
      const input = getInput();
      const errorId = input.getAttribute("aria-describedby");
      if (!errorId) return null;
      const errorElement = screen.queryByText((content, element) => {
        return element.id === errorId;
      });
      return errorElement ? errorElement.textContent : null;
    },

    /**
     * Check if the text field is disabled
     * @returns {boolean} True if field is disabled
     */
    isDisabled: () => {
      const input = getInput();
      return input.disabled;
    },

    /**
     * Get the raw input element
     * @returns {HTMLElement} The input element
     */
    getElement: () => getInput(),
  };
};

/**
 * Helper to interact with Spectrum NumberField components
 * @param {string} testId - The data-test-id attribute value
 * @returns {Object} Helper methods for NumberField interaction
 */
export const spectrumNumberField = (testId) => {
  const getInput = () => screen.getByTestId(testId);

  return {
    /**
     * Type a number into the number field
     * @param {string|number} value - Number to type
     */
    type: async (value) => {
      const input = getInput();
      await userEvent.type(input, String(value));
    },

    /**
     * Clear the number field and type a new number
     * @param {string|number} value - Number to type
     */
    fill: async (value) => {
      const input = getInput();
      await userEvent.clear(input);
      await userEvent.type(input, String(value));
      // Tab away to trigger blur and ensure all handlers complete
      await userEvent.tab();
    },

    /**
     * Clear the number field
     */
    clear: async () => {
      const input = getInput();
      await userEvent.clear(input);
    },

    /**
     * Get the current value of the number field
     * @returns {string} The current value
     */
    getValue: () => {
      const input = getInput();
      return input.value;
    },

    /**
     * Get the current value as a number
     * @returns {number|null} The current value as a number, or null if empty
     */
    getNumericValue: () => {
      const input = getInput();
      const value = input.value;
      return value === "" ? null : Number(value);
    },

    /**
     * Increment the value using the up arrow button
     */
    increment: async () => {
      const input = getInput();
      // Find the stepper buttons by their accessible names
      // The buttons are siblings of the input within the number field
      const incrementButton = screen
        .getAllByRole("button", {
          name: /increase/i,
        })
        .find((button) => {
          // Use Testing Library's within to check if this button is related to our input
          const container = button.parentElement;
          return container && container.contains(input);
        });
      if (incrementButton) {
        await userEvent.click(incrementButton);
      }
    },

    /**
     * Decrement the value using the down arrow button
     */
    decrement: async () => {
      const input = getInput();
      // Find the stepper buttons by their accessible names
      // The buttons are siblings of the input within the number field
      const decrementButton = screen
        .getAllByRole("button", {
          name: /decrease/i,
        })
        .find((button) => {
          // Use Testing Library's within to check if this button is related to our input
          const container = button.parentElement;
          return container && container.contains(input);
        });
      if (decrementButton) {
        await userEvent.click(decrementButton);
      }
    },

    /**
     * Check if the number field has an error
     * @returns {boolean} True if field has error
     */
    hasError: () => {
      const input = getInput();
      return input.getAttribute("aria-invalid") === "true";
    },

    /**
     * Get the error message if present
     * @returns {string|null} The error message or null
     */
    getErrorMessage: () => {
      const input = getInput();
      const errorId = input.getAttribute("aria-describedby");
      if (!errorId) return null;
      const errorElement = screen.queryByText((content, element) => {
        return element.id === errorId;
      });
      return errorElement ? errorElement.textContent : null;
    },

    /**
     * Check if the number field is disabled
     * @returns {boolean} True if field is disabled
     */
    isDisabled: () => {
      const input = getInput();
      return input.disabled;
    },

    /**
     * Get the raw input element
     * @returns {HTMLElement} The input element
     */
    getElement: () => getInput(),
  };
};
