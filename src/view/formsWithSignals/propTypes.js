/*
Copyright 2026 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
*/
const wrapIsRequired = (validator) => {
  validator.isRequired = (props, propName, ...rest) => {
    const value = props[propName];
    if (value === undefined) {
      return new Error(`${propName} is required`);
    }
    return validator(props, propName, ...rest);
  };
  return validator;
};

const createModelValidator = (expectedType) =>
  wrapIsRequired((props, propName) => {
    const model = props[propName];
    if (typeof model !== "object" || !model.type) {
      return new Error(
        `Invalid ${propName}: expected object with type property`,
      );
    }
    if (model.type !== expectedType) {
      return new Error(
        `Invalid ${propName}: expected type "${expectedType}", got "${model.type}"`,
      );
    }
    return undefined;
  });

export const arrayModel = createModelValidator("arrayModel");
export const objectModel = createModelValidator("objectModel");
export const simpleModel = createModelValidator("simpleModel");
export const complexModel = createModelValidator("complexModel");

export const conditionalModel = wrapIsRequired((props, propName) => {
  const model = props[propName];
  if (typeof model !== "object" || !model.type) {
    return new Error(`Invalid ${propName}: expected object with type property`);
  }
  if (!model.signals?.visible) {
    return new Error(`${propName} must have a visible signal`);
  }
  return undefined;
});

export const allOf = wrapIsRequired((...types) => (...args) => {
  types.forEach((type) => type(...args));
});
