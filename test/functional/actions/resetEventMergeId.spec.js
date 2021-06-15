/*
Copyright 2020 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
*/

import createExtensionViewController from "../helpers/createExtensionViewController";
import spectrum from "../helpers/spectrum2";
import createFixture from "../helpers/createFixture";

const extensionViewController = createExtensionViewController(
  "actions/resetEventMergeId.html"
);

const eventMergeIdField = spectrum.textfield("eventMergeIdField");

createFixture({
  title: "Reset Event Merge ID View",
  viewPath: "actions/resetEventMergeId.html"
});

test("initializes form fields with settings", async () => {
  await extensionViewController.init({
    settings: {
      eventMergeId: "%foo%"
    }
  });
  await eventMergeIdField.expectValue("%foo%");
});

test("returns valid settings", async () => {
  await extensionViewController.init();

  await eventMergeIdField.typeText("%foo%");
  await extensionViewController.expectIsValid();
  await extensionViewController.expectSettings({
    eventMergeId: "%foo%"
  });
});

test("shows error for empty event merge ID value", async () => {
  await extensionViewController.init();
  await extensionViewController.expectIsNotValid();
  await eventMergeIdField.expectError();
});

test("shows error for event merge ID value that is not a data element", async () => {
  await extensionViewController.init();
  await eventMergeIdField.typeText("foo");
  await extensionViewController.expectIsNotValid();
  await eventMergeIdField.expectError();
});

test("shows error for event merge ID value that is more than one data element", async () => {
  await extensionViewController.init();
  await eventMergeIdField.typeText("%foo%%bar%");
  await extensionViewController.expectIsNotValid();
  await eventMergeIdField.expectError();
});
