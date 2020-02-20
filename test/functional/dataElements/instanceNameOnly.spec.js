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

import createExtensionViewController from "../helpers/createExtensionViewController";
import testInstanceNameOnlyView from "../helpers/testInstanceNameOnlyView";

const extensionViewController = createExtensionViewController(
  "dataElements/instanceNameOnly.html"
);

// disablePageReloads is not a publicized feature, but it sure helps speed up tests.
// https://github.com/DevExpress/testcafe/issues/1770
fixture("ECID and Event Merge ID View").disablePageReloads.page(
  "http://localhost:3000/viewSandbox.html"
);

testInstanceNameOnlyView(extensionViewController);
