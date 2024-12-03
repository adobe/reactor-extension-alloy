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
import userEvent from '@testing-library/user-event';
import { createTestIdSelector, createTestIdSelectorString } from './selectors';

const user = userEvent.setup();

// Constants
const popoverMenuSelector = '[role="listbox"]';
const tabSelector = '[role="tab"]';
const menuItemCssSelector = '[role="option"], [role="option"] span';
const menuItemSimpleCssSelector = '[role="option"]';
const invalidAttribute = 'aria-invalid';
const invalidCssSelector = '[class*="--invalid"]';

// Helper functions
const compatibleClick = async (element) => {
  if (!element) return;
  element.scrollIntoView();
  await user.click(element);
};

const createExpectError = (element) => async () => {
  expect(element.getAttribute(invalidAttribute)).toBe('true');
};

const createExpectInvalidCssClass = (element) => async () => {
  expect(element.closest(invalidCssSelector)).toBeTruthy();
};

const createExpectHidden = (element) => async () => {
  expect(element.hasAttribute('hidden')).toBe(true);
};

const createExpectNoError = (element) => async () => {
  expect(element.getAttribute(invalidAttribute)).not.toBe('true');
};

const createExpectValue = (element) => async (value) => {
  expect(element.getAttribute('value')).toBe(value);
};

const createExpectText = (element) => async (text) => {
  const hasText = Array.from(element.querySelectorAll('*'))
    .some(el => el.textContent.trim() === text);
  expect(hasText).toBe(true);
};

const createExpectMatch = (element) => async (value) => {
  expect(element.getAttribute('value')).toMatch(value);
};

const createClick = (element) => async () => {
  expect(element).toBeTruthy();
  await user.click(element);
};

const createExpectChecked = (element) => async () => {
  expect(element.checked).toBe(true);
};

const createExpectUnchecked = (element) => async () => {
  expect(element.checked).toBe(false);
};

const createExpectExists = (element) => async () => {
  expect(element).toBeTruthy();
};

const createExpectNotExists = (element) => async () => {
  expect(element).toBeFalsy();
};

const createExpectEnabled = (element) => async () => {
  expect(element.hasAttribute('disabled')).toBe(false);
};

const createExpectDisabled = (element) => async () => {
  expect(element.hasAttribute('disabled')).toBe(true);
};

const createExpectHasRole = (element, expectedRole) => async () => {
  expect(element.getAttribute('role')).toBe(expectedRole);
};

const createExpectNotHasRole = (element, expectedRole) => async () => {
  expect(element.getAttribute('role')).not.toBe(expectedRole);
};

const createExpectMenuOptionLabels = (menuElement) => async (labels) => {
  const menuItems = within(menuElement).queryAllByRole('option');
  for (const label of labels) {
    const item = menuItems.find(el => el.textContent.trim() === label);
    expect(item).toBeTruthy();
  }
  expect(menuItems).toHaveLength(labels.length);
};

const createExpectMenuOptionsLabelsInclude = (menuElement) => async (labels) => {
  const menuItems = within(menuElement).queryAllByRole('option');
  for (const label of labels) {
    const item = menuItems.find(el => el.textContent.trim() === label);
    expect(item).toBeTruthy();
  }
};

const createExpectMenuOptionLabelsExclude = (menuElement) => async (labels) => {
  const menuItems = within(menuElement).queryAllByRole('option');
  for (const label of labels) {
    const item = menuItems.find(el => el.textContent.trim() === label);
    expect(item).toBeFalsy();
  }
};

const createExpectTabSelected = (element) => async () => {
  expect(element.getAttribute('aria-selected')).toBe('true');
};

const createSelectMenuOption = (menuElement) => async (label) => {
  const menuItems = within(menuElement).queryAllByRole('option');
  const option = menuItems.find(el => el.textContent.trim() === label);
  if (option) {
    await user.click(option);
  }
};

// Component wrappers
const componentWrappers = {
  comboBox(selector) {
    const element = screen.getByTestId(selector);
    const menu = document.querySelector(popoverMenuSelector);

    return {
      element,
      expectIsComboBox: createExpectHasRole(element, 'combobox'),
      expectError: createExpectError(element),
      expectNoError: createExpectNoError(element),
      expectText: createExpectValue(element),
      expectValue: createExpectValue(element),
      async openMenu() {
        const button = element.closest('*').querySelector("button[aria-haspopup='listbox']");
        await user.click(button);
      },
      selectMenuOption: createSelectMenuOption(menu),
      expectMenuOptionLabels: createExpectMenuOptionLabels(menu),
      expectMenuOptionLabelsInclude: createExpectMenuOptionsLabelsInclude(menu),
      expectMenuOptionLabelsExclude: createExpectMenuOptionLabelsExclude(menu),
      async enterSearch(text) {
        await user.type(element, text);
      },
      async pressEnterKey() {
        await user.keyboard('{Enter}');
      },
      async clear() {
        await user.clear(element);
      },
      async scrollToTop() {
        if (menu) menu.scrollTo(0, 0);
      },
      async scrollDownToItem(label) {
        if (!menu) return;
        
        for (let i = 0; i < 10; i++) {
          const items = within(menu).queryAllByRole('option');
          const found = items.find(el => el.textContent.trim() === label);
          if (found) return;
          
          menu.scrollBy(0, 200);
          await new Promise(resolve => setTimeout(resolve, 100));
        }
      }
    };
  },

  picker(selector) {
    const element = screen.getByTestId(selector);
    const menu = document.querySelector(popoverMenuSelector);

    return {
      element,
      async expectIsPicker() {
        expect(element.getAttribute('aria-haspopup')).toBe('listbox');
        expect(element.tagName.toLowerCase()).toBe('button');
      },
      expectError: createExpectInvalidCssClass(element),
      expectNoError: createExpectNoError(element),
      expectText: createExpectText(element),
      async selectOption(label) {
        await compatibleClick(element);
        await this.scrollDownToItem(label);
        await createSelectMenuOption(menu)(label);
      },
      async expectSelectedOptionLabel(label) {
        expect(element.innerText).toContain(label);
      },
      async expectMenuOptionLabels(labels) {
        await compatibleClick(element);
        await createExpectMenuOptionLabels(menu)(labels);
      },
      async expectMenuOptionLabelsInclude(labels) {
        await compatibleClick(element);
        await createExpectMenuOptionsLabelsInclude(menu)(labels);
      },
      async expectMenuOptionLabelsExclude(labels) {
        await compatibleClick(element);
        await createExpectMenuOptionLabelsExclude(menu)(labels);
      },
      expectDisabled: createExpectDisabled(element),
      expectEnabled: createExpectEnabled(element.querySelector('button')),
      expectHidden: createExpectHidden(element.closest('*').parentElement),
      openMenu: createClick(element),
      async scrollDownToItem(label) {
        if (!menu) return;
        
        for (let i = 0; i < 10; i++) {
          const items = within(menu).queryAllByRole('option');
          const found = items.find(el => el.textContent.trim() === label);
          if (found) return;
          
          menu.scrollBy(0, 200);
          await new Promise(resolve => setTimeout(resolve, 100));
        }
      }
    };
  },

  textField(selector) {
    const element = screen.getByTestId(selector);

    return {
      element,
      expectIsTextField: createExpectNotHasRole(element, 'combobox'),
      expectError: createExpectError(element),
      expectNoError: createExpectNoError(element),
      expectValue: createExpectValue(element),
      expectMatch: createExpectMatch(element),
      async typeText(text, options) {
        await user.type(element, text, options);
      },
      async clear() {
        await user.clear(element);
      },
      async click() {
        await user.click(element);
      }
    };
  },

  textArea(selector) {
    const element = screen.getByTestId(selector);

    return {
      element,
      expectError: createExpectError(element),
      expectNoError: createExpectNoError(element),
      async expectValue(text) {
        expect(element.value).toBe(text);
      },
      async typeText(text) {
        await user.type(element, text);
      },
      async clear() {
        await user.clear(element);
      }
    };
  },

  checkbox(selector) {
    const element = screen.getByTestId(selector);

    return {
      element,
      expectError: createExpectError(element),
      expectChecked: createExpectChecked(element),
      expectUnchecked: createExpectUnchecked(element),
      click: createClick(element)
    };
  },

  radio(selector) {
    const element = screen.getByTestId(selector);

    return {
      element,
      expectChecked: createExpectChecked(element),
      expectUnchecked: createExpectUnchecked(element),
      click: createClick(element)
    };
  },

  button(selector) {
    const element = screen.getByTestId(selector);

    return {
      element,
      click: createClick(element)
    };
  },

  illustratedMessage(selector) {
    const element = screen.getByTestId(selector);

    return {
      element,
      async expectMessage(message) {
        const section = element.querySelector('section');
        expect(section.textContent).toContain(message);
      }
    };
  },

  tab(selector) {
    const element = screen.getByTestId(selector);

    return {
      element,
      click: createClick(element),
      expectSelected: createExpectTabSelected(element)
    };
  },

  tabs() {
    return {
      async expectTabLabels(labels) {
        const tabs = screen.queryAllByRole('tab');
        for (let i = 0; i < labels.length; i++) {
          const tab = tabs[i];
          expect(tab.textContent.trim()).toBe(labels[i]);
        }
        expect(tabs).toHaveLength(labels.length);
      },
      async selectTab(label) {
        const tab = screen.getByRole('tab', { name: label });
        await user.click(tab);
      }
    };
  },

  dialog() {
    return {};
  },

  alert() {
    return {};
  },

  container(selector) {
    const element = screen.getByTestId(selector);
    const that = this;

    return Object.keys(this).reduce(
      (containerComponents, key) => ({
        ...containerComponents,
        [key]: function containerComponent(childTestId) {
          return that[key].call(
            this,
            within(element).getByTestId(childTestId)
          );
        }
      }),
      {}
    );
  }
};

// Add common properties to all component wrappers
Object.keys(componentWrappers).forEach((componentName) => {
  const componentWrapper = componentWrappers[componentName];
  componentWrappers[componentName] = function selectorizedComponent(testId) {
    const element = screen.getByTestId(testId);
    return {
      expectEnabled: createExpectEnabled(element),
      expectDisabled: createExpectDisabled(element),
      expectExists: createExpectExists(element),
      expectNotExists: createExpectNotExists(element),
      ...componentWrapper.call(this, testId),
      element
    };
  };
});

export default componentWrappers; 