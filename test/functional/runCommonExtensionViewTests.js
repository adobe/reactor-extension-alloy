/*
Copyright 2021 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
*/

import { t } from "testcafe";
import extensionViewController from "./helpers/extensionViewController";

export default additionalInitInfo => {
  test("loads Adobe Clean font", async () => {
    await extensionViewController.init(additionalInitInfo);
    const adobeCleanLoaded = await t.eval(() => {
      return document.fonts.check("12px Adobe Clean");
    });
    await t.expect(adobeCleanLoaded).ok("Adobe Clean font not loaded.");
  });
};
