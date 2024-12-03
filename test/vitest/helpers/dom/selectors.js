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

import { screen, within } from '@testing-library/dom';

/**
 * Creates a CSS selector string for elements with a data-test-id attribute
 * with a given value.
 * @param {string} dataTestId The value of the data-test-id attribute.
 * @returns {string}
 */
export const createTestIdSelectorString = (dataTestId) =>
  `[data-test-id='${dataTestId}']`;

/**
 * Creates a Testing Library query for elements with a data-test-id attribute
 * with a given value.
 * @param {string} dataTestId The value of the data-test-id attribute.
 * @returns {HTMLElement}
 */
export const createTestIdSelector = (dataTestId) => {
  const element = screen.getByTestId(dataTestId);
  
  // Add helper methods to match TestCafe's Selector functionality
  return Object.assign(element, {
    find: (selector) => within(element).getByTestId(selector.replace(/[[\]']/g, '')),
    parent: (selector) => element.closest(selector),
    child: (selector) => element.querySelector(selector),
    withText: (text) => {
      const elements = Array.from(element.querySelectorAll('*'));
      return elements.find(el => el.textContent === text) || null;
    },
    withExactText: (text) => {
      const elements = Array.from(element.querySelectorAll('*'));
      return elements.find(el => el.textContent.trim() === text.trim()) || null;
    },
    nth: (index) => {
      const elements = Array.from(document.querySelectorAll(createTestIdSelectorString(dataTestId)));
      return elements[index] || null;
    },
    count: () => document.querySelectorAll(createTestIdSelectorString(dataTestId)).length,
    exists: element !== null,
    hasClass: (className) => element.classList.contains(className),
    getAttribute: (attr) => element.getAttribute(attr),
    hasAttribute: (attr) => element.hasAttribute(attr),
    textContent: element.textContent,
    value: element.value,
    innerText: element.innerText,
    innerHTML: element.innerHTML,
    nextSibling: () => element.nextElementSibling,
    prevSibling: () => element.previousElementSibling,
    sibling: (selector) => {
      const siblings = Array.from(element.parentElement.children);
      return siblings.find(el => el.matches(selector) && el !== element) || null;
    }
  });
};

/**
 * Creates a Testing Library query that returns all elements with a data-test-id attribute
 * with a given value.
 * @param {string} dataTestId The value of the data-test-id attribute.
 * @returns {HTMLElement[]}
 */
export const createTestIdSelectorAll = (dataTestId) => {
  const elements = screen.getAllByTestId(dataTestId);
  return elements.map(element => createTestIdSelector(element.getAttribute('data-test-id')));
};

/**
 * Creates a Testing Library query that returns an element with a data-test-id attribute
 * if it exists, or null if it doesn't.
 * @param {string} dataTestId The value of the data-test-id attribute.
 * @returns {HTMLElement | null}
 */
export const createTestIdSelectorOptional = (dataTestId) => {
  const element = screen.queryByTestId(dataTestId);
  return element ? createTestIdSelector(dataTestId) : null;
};

/**
 * Creates a Testing Library query that waits for and returns an element with a data-test-id attribute.
 * @param {string} dataTestId The value of the data-test-id attribute.
 * @returns {Promise<HTMLElement>}
 */
export const createTestIdSelectorAsync = async (dataTestId) => {
  const element = await screen.findByTestId(dataTestId);
  return createTestIdSelector(dataTestId);
}; 