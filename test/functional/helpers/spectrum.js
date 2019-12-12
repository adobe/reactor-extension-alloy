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

import { Selector } from "testcafe";

const iframe = Selector("#extensionViewIframe");
const popoverSelector = Selector(".spectrum-Popover");
const menuItemLabelCssSelector = ".spectrum-Menu-itemLabel";
const isInvalidClassName = "is-invalid";
const invalidAttribute = "aria-invalid";

const switchToIframe = async t => {
  // We need to make sure we're inside the iframe.
  // However, if we were to call t.switchToIframe when
  // we're already in the iframe, testcafe will think we're
  // trying to go into a nested iframe. To prevent that,
  // we always go up to the main window, then down into
  // the iframe.
  await t.switchToMainWindow();
  await t.switchToIframe(iframe);
};

const selectMenuItem = async (t, container, label) => {
  await t.click(container.find(menuItemLabelCssSelector).withText(label));
};

const createExpectError = selector => async t => {
  await switchToIframe(t);
  await t
    .expect(selector.hasClass(isInvalidClassName))
    .ok("Expected field to have error when it did not");
};

const createExpectErrorByAttribute = selector => async t => {
  await switchToIframe(t);
  await t.expect(selector.getAttribute(invalidAttribute)).eql("true");
};

const createExpectValue = selector => async (t, value) => {
  await switchToIframe(t);
  // We need to use the value attribute instead of property
  // because some react-spectrum components, like Select,
  // don't set the value property on the primary DOM element
  // but instead use an attribute.
  await t.expect(selector.getAttribute("value")).eql(value);
};

const createExpectMatch = selector => async (t, value) => {
  await switchToIframe(t);
  // We need to use the value attribute instead of property
  // because some react-spectrum components, like Select,
  // don't set the value property on the primary DOM element
  // but instead use an attribute.
  await t.expect(selector.getAttribute("value")).match(value);
};

const createClick = selector => async t => {
  await switchToIframe(t);
  await t.click(selector);
};

const createExpectChecked = selector => async t => {
  await switchToIframe(t);
  await t.expect(selector.checked).ok();
};

const createExpectUnchecked = selector => async t => {
  await switchToIframe(t);
  await t.expect(selector.checked).notOk();
};

const createExpectExists = selector => async t => {
  await switchToIframe(t);
  await t.expect(selector.exists).ok();
};

const createExpectNotExists = selector => async t => {
  await switchToIframe(t);
  await t.expect(selector.exists).notOk();
};

const createExpectEnabled = selector => async t => {
  await switchToIframe(t);
  await t.expect(selector.hasAttribute("disabled")).notOk();
};

const createExpectDisabled = selector => async t => {
  await switchToIframe(t);
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
// and TestCafe APIs directly.
const componentWrappers = {
  select(selector) {
    return {
      expectError: createExpectError(selector),
      expectValue: createExpectValue(selector),
      async expectSelectedOptionLabel(t, label) {
        await switchToIframe(t);
        await t
          .expect(selector.find(".spectrum-Dropdown-label").innerText)
          .eql(label);
      },
      async expectOptionLabels(t, labels) {
        await switchToIframe(t);
        await t.click(selector.find("button"));
        const optionLabels = popoverSelector.find(".spectrum-Menu-itemLabel");
        for (let i = 0; i < labels.length; i += 1) {
          // eslint-disable-next-line no-await-in-loop
          await t.expect(optionLabels.nth(i).withText(labels[i]).exists).ok();
        }
        await t.expect(optionLabels.count).eql(labels.length);
      },
      async selectOption(t, label) {
        await switchToIframe(t);
        await t.click(selector.find("button"));
        await selectMenuItem(t, popoverSelector, label);
      }
    };
  },
  textfield(selector) {
    return {
      expectError: createExpectError(selector),
      expectValue: createExpectValue(selector),
      expectMatch: createExpectMatch(selector),
      async typeText(t, text) {
        await switchToIframe(t);
        await t.typeText(selector, text);
      },
      async clear(t) {
        await switchToIframe(t);
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
      async clickHeader(t, label) {
        await switchToIframe(t);
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
      async expectTitle(t, title) {
        await switchToIframe(t);
        await selector.find(".spectrum-Dialog-header").withText(title);
      },
      async clickConfirm(t) {
        await switchToIframe(t);
        await t.click(
          selector.find(".spectrum-Dialog-footer .spectrum-Button--cta")
        );
      },
      async clickCancel(t) {
        await switchToIframe(t);
        await t.click(
          selector.find(".spectrum-Dialog-footer .spectrum-Button--secondary")
        );
      }
    };
  },
  alert(selector) {
    return {
      async expectTitle(t, title) {
        await switchToIframe(t);
        await selector.find(".spectrum-Alert-header").withText(title);
      }
    };
  }
};

// This adds certain properties to all component wrappers.
Object.keys(componentWrappers).forEach(componentName => {
  const componentWrapper = componentWrappers[componentName];
  componentWrappers[componentName] = selector => {
    return {
      ...componentWrapper(selector),
      selector,
      expectExists: createExpectExists(selector),
      expectNotExists: createExpectNotExists(selector),
      expectEnabled: createExpectEnabled(selector),
      expectDisabled: createExpectDisabled(selector)
    };
  };
});

module.exports = componentWrappers;
