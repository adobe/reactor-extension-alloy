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

const createCustomInstance = ({ name }) => {
  if (!window[name] || typeof window[name] !== "function") {
    throw new Error(
      `Alloy instance "${name}" not found on window. ` +
        `Make sure the instance is loaded before the Launch library.`,
    );
  }

  const instance = window[name];
  return (...args) => instance(...args);
};

const components = {};

const createEventMergeId = () => {
  throw new Error(
    "createEventMergeId should not be called directly in preinstalled mode",
  );
};

export { createCustomInstance, components, createEventMergeId };
export { default as deepAssign } from "@adobe/alloy/libEs6/utils/deepAssign";
