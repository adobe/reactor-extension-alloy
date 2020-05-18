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

import getAdobeIOAccessToken from "../../../helpers/getAdobeIOAccessToken";
import createExtensionViewController from "../../../helpers/createExtensionViewController";
import { t } from "testcafe";

export default async additionalInitInfo => {
  const extensionViewController = createExtensionViewController(
    "dataElements/xdmObject.html"
  );

  /**
   * Asserts that the extension view returns settings whose data
   * matches the expected data. It also asserts that the schema is
   * correct with fuzzy matching for the schema version.
   */
  extensionViewController.expectSettingsToContainData = async data => {
    const actualSettings = await extensionViewController.getSettings();
    await t.expect(actualSettings.schema.id).eql(schema.id);
    // We use a regex here because as changes are made to the schema (to support
    // new tests), the schema version in Platform changes, which would make our
    // tests fail if the version we were asserting were hard-coded in the test.
    await t.expect(actualSettings.schema.version).match(/^\d+\.\d+$/);
    await t
      .expect(actualSettings.data)
      .eql(
        data,
        `Expected data: ${JSON.stringify(data)} Actual data: ${JSON.stringify(
          actualSettings.data
        )}`
      );
  };

  const accessToken = await getAdobeIOAccessToken();
  const initInfo = {
    extensionSettings: {
      instances: [
        {
          edgeConfigId: "74580452-647b-4797-99af-6d0e042435ec"
        }
      ]
    },
    company: {
      orgId: "334F60F35E1597910A495EC2@AdobeOrg"
    },
    tokens: { imsAccess: accessToken },
    ...additionalInitInfo
  };
  await extensionViewController.init(initInfo);
  return extensionViewController;
};
