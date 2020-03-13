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

import { Selector, t } from "testcafe";

const iframe = Selector("#extensionViewIframe");

export default async () => {
  // We need to make sure we're inside the iframe.
  // However, if we were to call t.switchToIframe when
  // we're already in the iframe, testcafe will think we're
  // trying to go into a nested iframe. To prevent that,
  // we always go up to the main window, then down into
  // the iframe.
  await t.switchToMainWindow();
  await t.switchToIframe(iframe);
};
