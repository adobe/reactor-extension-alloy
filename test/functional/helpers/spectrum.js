/*
Copyright 2019 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
*/

import { Selector, t } from "testcafe";
import switchToIframe from "./switchToIframe";
import {
  createTestIdSelector,
  createTestIdSelectorString
} from "./dataTestIdSelectors";

const popoverSelector = Selector(".spectrum-Popover");
const menuItemLabelCssSelector = ".spectrum-Menu-itemLabel";
const isInvalidClassName = "is-invalid";
const invalidAttribute = "aria-invalid";

const selectMenuItem = async (container, label) => {
  await t.click(container.find(menuItemLabelCssSelector).withText(label));
};

const createExpectError = selector => async () => {
  await switchToIframe();
  await t
    .expect(selector.hasClass(isInvalidClassName))
    .ok("Expected field to have error when it did not");
};

const createExpectNoError = selector => async () => {
  await switchToIframe();
  await t
    .expect(selector.hasClass(isInvalidClassName))
    .notOk("Expected field to have no error when it did");
};

const createExpectErrorByAttribute = selector => async () => {
  await switchToIframe();
  await t.expect(selector.getAttribute(invalidAttribute)).eql("true");
};

const createExpectValue = selector => async value => {
  await switchToIframe();
  // We need to use the value attribute instead of property
  // because some react-spectrum components, like Select,
  // don't set the value property on the primary DOM element
  // but instead use an attribute.
  await t.expect(selector.getAttribute("value")).eql(value);
};

const createExpectMatch = selector => async value => {
  await switchToIframe();
  // We need to use the value attribute instead of property
  // because some react-spectrum components, like Select,
  // don't set the value property on the primary DOM element
  // but instead use an attribute.
  await t.expect(selector.getAttribute("value")).match(value);
};

const createClick = selector => async () => {
  await switchToIframe();
  await t.click(selector);
};

const createExpectChecked = selector => async () => {
  await switchToIframe();
  await t.expect(selector.checked).ok();
};

const createExpectUnchecked = selector => async () => {
  await switchToIframe();
  await t.expect(selector.checked).notOk();
};

const createExpectExists = selector => async () => {
  await switchToIframe();
  await t.expect(selector.exists).ok();
};

const createExpectNotExists = selector => async () => {
  await switchToIframe();
  await t.expect(selector.exists).notOk();
};

const createExpectEnabled = selector => async () => {
  await switchToIframe();
  await t.expect(selector.hasAttribute("disabled")).notOk();
};

const createExpectDisabled = selector => async () => {
  await switchToIframe();
  await t.expect(selector.hasAttribute("disabled")).ok();
};

// This provides an abstraction layer on top of react-spectrum
// in order to keep react-spectrum specifics outside of tests.
// This abstraction is more valuable for some components (Select, Accordion)
// than for others (Button), but should probably be used for all
// components for consistency. This also takes care of ensuring that
// TestCafe is looking within the iframe in our test environment when
// dealing with components, so that we don't have t.switchToIframe()
// statements littered through our test code. Feel free to add
// additional components and methods. We always include the original
// selector on the returned object, so if we need to do something
// a bit more custom inside the test, the test can use the selector
// and TestCafe APIs directly. A test ID string or a Selector can
// be passed into each component wrapper.
const componentWrappers = {
  combobox(selector) {
    return {
      async selectOption(label) {
        await switchToIframe();
        await t.click(selector.parent().find("button"));
        await selectMenuItem(popoverSelector, label);
      },
      expectDisabled: createExpectDisabled(selector.parent().find("button")),
      expectEnabled: createExpectEnabled(selector.parent().find("button"))
    };
  },
  select(selector) {
    return {
      expectError: createExpectError(selector),
      expectNoError: createExpectNoError(selector),
      expectValue: createExpectValue(selector),
      async expectSelectedOptionLabel(label) {
        await switchToIframe();
        await t
          .expect(selector.find(".spectrum-Dropdown-label").innerText)
          .eql(label);
      },
      async expectOptionLabels(labels) {
        await switchToIframe();
        await t.click(selector.find("button"));
        const optionLabels = popoverSelector.find(".spectrum-Menu-itemLabel");
        for (let i = 0; i < labels.length; i += 1) {
          // eslint-disable-next-line no-await-in-loop
          await t.expect(optionLabels.nth(i).withText(labels[i]).exists).ok();
        }
        await t.expect(optionLabels.count).eql(labels.length);
      },
      async selectOption(label) {
        await switchToIframe();
        await t.click(selector.find("button"));
        await selectMenuItem(popoverSelector, label);
      },
      expectDisabled: createExpectDisabled(selector.find("button")),
      expectEnabled: createExpectEnabled(selector.find("button"))
    };
  },
  textfield(selector) {
    return {
      expectError: createExpectError(selector),
      expectNoError: createExpectNoError(selector),
      expectValue: createExpectValue(selector),
      expectMatch: createExpectMatch(selector),
      async typeText(text) {
        await switchToIframe();
        await t.typeText(selector, text);
      },
      async clear() {
        await switchToIframe();
        await t.selectText(selector).pressKey("delete");
      }
    };
  },
  checkbox(selector) {
    return {
      expectError: createExpectErrorByAttribute(selector),
      expectChecked: createExpectChecked(selector),
      expectUnchecked: createExpectUnchecked(selector),
      click: createClick(selector)
    };
  },
  radio(selector) {
    return {
      expectChecked: createExpectChecked(selector),
      expectUnchecked: createExpectUnchecked(selector),
      click: createClick(selector)
    };
  },
  accordion(selector) {
    return {
      async clickHeader(label) {
        await switchToIframe();
        await t.click(
          selector.find(".spectrum-Accordion-itemHeader").withText(label)
        );
      }
    };
  },
  button(selector) {
    return {
      click: createClick(selector)
    };
  },
  dialog(selector) {
    return {
      async expectTitle(title) {
        await switchToIframe();
        await selector.find(".spectrum-Dialog-header").withText(title);
      },
      async clickConfirm() {
        await switchToIframe();
        await t.click(
          selector.find(".spectrum-Dialog-footer .spectrum-Button--cta")
        );
      },
      async clickCancel() {
        await switchToIframe();
        await t.click(
          selector.find(".spectrum-Dialog-footer .spectrum-Button--secondary")
        );
      }
    };
  },
  alert(selector) {
    return {
      async expectTitle(title) {
        await switchToIframe();
        await selector.find(".spectrum-Alert-header").withText(title);
      }
    };
  },
  // You can chain additional component methods after calling this method
  container(selector) {
    const that = this;
    return Object.keys(this).reduce(
      (containerComponents, key) => ({
        ...containerComponents,
        // Using the function keyword here so this is defined
        // eslint-disable-next-line object-shorthand
        [key]: function containerComponent(childTestId) {
          return that[key].call(
            this,
            selector.find(createTestIdSelectorString(childTestId))
          );
        }
      }),
      {}
    );
  }
};

/**
 * Given a test ID string or a selector, it returns a selector.
 * @param {string|Selector} testIdOrSelector
 * @returns {Selector}
 */
const selectorize = testIdOrSelector => {
  return typeof testIdOrSelector === "string"
    ? createTestIdSelector(testIdOrSelector)
    : testIdOrSelector;
};

// This adds certain properties to all component wrappers.
Object.keys(componentWrappers).forEach(componentName => {
  const componentWrapper = componentWrappers[componentName];
  componentWrappers[componentName] = function selectorizedComponent(
    testIdOrSelector
  ) {
    const selector = selectorize(testIdOrSelector);
    return {
      expectEnabled: createExpectEnabled(selector),
      expectDisabled: createExpectDisabled(selector),
      expectExists: createExpectExists(selector),
      expectNotExists: createExpectNotExists(selector),
      ...componentWrapper.call(this, selector),
      selector
    };
  };
});

module.exports = componentWrappers;
