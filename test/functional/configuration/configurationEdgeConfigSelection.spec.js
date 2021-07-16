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

import initializeExtensionView from "../dataElements/xdmObject/helpers/initializeExtensionView";
import createFixture from "../helpers/createFixture";
import * as edgeConfigsMocks from "../helpers/endpointMocks/edgeConfigsMocks";

createFixture({
  title: "Extension Configuration View Edge Configuration Selection",
  viewPath: "configuration/configuration.html"
});

test.only.requestHooks(edgeConfigsMocks.single)(
  "auto-selects edge configuration and environment if a single edge configuration and single environment exists",
  async () => {
    await initializeExtensionView();
  }
);

// test("does not auto-select environment if more than one environment exists", () => {});
//
// test("does not auto-select edge configuration if multiple edge configurations exist", () => {});
//
// test("shows an alert if no edge configurations exist", () => {});
//
// test("shows alerts if no environments don't exist for a each type", () => {});
//
// test("allows the user to search for and select an edge config", () => {});
//
// test("allows the user to search for and select environment if more than one environment exists", () => {});
//
// test("provides only freeform input method on instances other than the first", () => {});
//
// // Loading existing installation
//
// test("auto-selects configured edge config and environments", () => {});
//
// test("auto-switches to freeform input if configured edge config is not found", () => {});
//
// test("auto-switches to freeform input if configured production environment is not found", () => {});
//
// test("auto-switches to freeform input if configured staging environment is not found", () => {});
//
// test("auto-switches to freeform input if configured development environment is not found", () => {});
//
// // also test failure scenarios
