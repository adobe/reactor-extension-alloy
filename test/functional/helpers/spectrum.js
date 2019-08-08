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

const createExpectValue = selector => async (t, value) => {
  await switchToIframe(t);
  // We need to use the value attribute instead of property
  // because some react-spectrum components, like Select,
  // don't set the value property on the primary DOM element
  // but instead use an attribute.
  await t.expect(selector.getAttribute("value")).eql(value);
};

module.exports = {
  select(selector) {
    return {
      expectError: createExpectError(selector),
      expectValue: createExpectValue(selector),
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
      async typeText(t, text) {
        await switchToIframe(t);
        await t.typeText(selector, text);
      }
    };
  }
};
