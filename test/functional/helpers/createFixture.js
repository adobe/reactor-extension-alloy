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

import path from "path";
import fs from "fs";
import { RequestMock } from "testcafe";

const extensionBridgeMockContent = fs.readFileSync(
  path.join(__dirname, "../helpers/extensionBridgeMock.js")
);

const extensionBridgeRequestMock = RequestMock()
  .onRequestTo(
    "https://assets.adobedtm.com/activation/reactor/extensionbridge/extensionbridge.min.js"
  )
  .respond(extensionBridgeMockContent);

const createFixture = ({
  title,
  viewPath,
  requiresAdobeIOIntegration = false,
  requestHooks = [],
  only = false
}) => {
  let fixt;
  if (only) {
    fixt = fixture.only(title);
  } else {
    fixt = fixture(title);
  }

  fixt = fixt
    .page(path.join(__dirname, "../../../dist/view", viewPath))
    .requestHooks(extensionBridgeRequestMock, ...requestHooks);

  if (requiresAdobeIOIntegration) {
    fixt = fixt.meta("requiresAdobeIOIntegration", true);
  }

  return fixt;
};

createFixture.only = args => {
  return createFixture({
    only: true,
    ...args
  });
};

export default createFixture;
