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

const iframe = Selector("#extensionViewPane iframe");
const dataTextfield = Selector("[name=data]");

const init = async (t, settings) => {
  await t.switchToMainWindow();
  return t.eval(
    () => {
      return window.extensionBridgePromise.then(extensionView => {
        return extensionView.init({
          settings
        });
      });
    },
    {
      dependencies: {
        settings
      }
    }
  );
};

const getSettings = async t => {
  await t.switchToMainWindow();
  return t.eval(() => {
    return window.extensionBridgePromise.then(extensionView => {
      return extensionView.getSettings();
    });
  });
};

const validate = async t => {
  await t.switchToMainWindow();
  return t.eval(() => {
    return window.extensionBridgePromise.then(extensionView => {
      return extensionView.validate();
    });
  });
};

fixture("Extension view sandbox").page(
  "http://localhost:3000/viewSandbox.html"
);

test("initializes form fields", async t => {
  await init(t, {
    data: "%myDataLayer%"
  });
  await t.switchToIframe(iframe);
  await t.expect(dataTextfield.value).eql("%myDataLayer%");
});

// Start the sandbox react server first
test("returns valid settings", async t => {
  await t.switchToIframe(iframe).typeText(dataTextfield, "%myDataLayer%");
  const settings = await getSettings(t);
  await t.expect(settings).eql({
    data: "%myDataLayer%"
  });
});

test("returns valid for valid input", async t => {
  await t.switchToIframe(iframe).typeText(dataTextfield, "%myDataLayer%");
  const valid = await validate(t);
  await t.expect(valid).ok();
});

test("returns invalid for data value that is not a data element", async t => {
  await t.switchToIframe(iframe).typeText(dataTextfield, "myDataLayer");
  const valid = await validate(t);
  await t.expect(valid).notOk();
});

test("returns invalid for data value that is more than one data element", async t => {
  await t.switchToIframe(iframe).typeText(dataTextfield, "%a%%b%");
  const valid = await validate(t);
  await t.expect(valid).notOk();
});
