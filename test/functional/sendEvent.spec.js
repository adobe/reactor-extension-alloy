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
import createExtensionViewController from "./helpers/createExtensionViewController";

const extensionViewController = createExtensionViewController("sendEvent.html");
const iframe = Selector("#extensionViewIframe");
const dataTextfield = Selector("[name=data]");

// disablePageReloads is not a publicized feature, but it sure helps speed up tests.
// https://github.com/DevExpress/testcafe/issues/1770
fixture("Extension view sandbox").disablePageReloads.page(
  "http://localhost:3000/viewSandbox.html"
);

test("initializes form fields", async t => {
  await extensionViewController.init(t, {
    data: "%myDataLayer%"
  });
  await t.switchToIframe(iframe);
  await t.expect(dataTextfield.value).eql("%myDataLayer%");
});

test("returns valid settings", async t => {
  await extensionViewController.init(t);
  await t.switchToIframe(iframe).typeText(dataTextfield, "%myDataLayer%");
  const settings = await extensionViewController.getSettings(t);
  await t.expect(settings).eql({
    data: "%myDataLayer%"
  });
});

test("returns valid for valid input", async t => {
  await extensionViewController.init(t);
  await t.switchToIframe(iframe).typeText(dataTextfield, "%myDataLayer%");
  const valid = await extensionViewController.validate(t);
  await t.expect(valid).ok();
});

test("returns invalid for data value that is not a data element", async t => {
  await extensionViewController.init(t);
  await t.switchToIframe(iframe).typeText(dataTextfield, "myDataLayer");
  const valid = await extensionViewController.validate(t);
  await t.expect(valid).notOk();
});

test("returns invalid for data value that is more than one data element", async t => {
  await extensionViewController.init(t);
  await t.switchToIframe(iframe).typeText(dataTextfield, "%a%%b%");
  const valid = await extensionViewController.validate(t);
  await t.expect(valid).notOk();
});
