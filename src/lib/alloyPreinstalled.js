/*
Copyright 2023 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
*/

import { createPreinstalledProxy } from "./utils/createPreinstalledProxy";

// This is a generated file for preinstalled library mode.
// It provides a proxy implementation that waits for external alloy instances.

// Create the createCustomInstance implementation for preinstalled mode
const createCustomInstance = ({ name }) => {
  return createPreinstalledProxy(name, {
    timeout: 1000,
    interval: 100,
    configTimeout: 5000,
    onError: console.error,
  });
};

// Empty components object for preinstalled mode
const components = {};

// Stub utilities - not used in preinstalled mode but required for API compatibility
const createEventMergeId = () => {
  throw new Error(
    "createEventMergeId should not be called directly in preinstalled mode",
  );
};

export { createCustomInstance, components, createEventMergeId };
export { default as deepAssign } from "@adobe/alloy/libEs6/utils/deepAssign";
