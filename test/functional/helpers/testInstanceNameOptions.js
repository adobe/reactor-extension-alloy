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

export default (extensionViewController, instanceNameField) => {
  test("shows instance options including option for instance that no longer exists", async t => {
    await extensionViewController.init(t, {
      extensionSettings: {
        instances: [
          {
            name: "alloy1",
            propertyId: "PR123"
          },
          {
            name: "alloy2",
            propertyId: "PR456"
          }
        ]
      },
      settings: {
        instanceName: "alloydeleted"
      }
    });
    await instanceNameField.expectSelectedOptionLabel(
      t,
      "alloydeleted (Deleted)"
    );
    await instanceNameField.expectOptionLabels(t, [
      "alloydeleted (Deleted)",
      "alloy1",
      "alloy2"
    ]);
  });
};
