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

const convertToWrappedFormPart = element => {
  const {
    type,
    props: { children, ...props } = {},
    _source: { fileName, lineNumber }
  } = element;
  if (typeof type !== "function") {
    throw new Error(`Unresolved type ${type} at ${fileName}:${lineNumber}`);
  }
  const parts =
    children &&
    (Array.isArray(children) ? children : [children]).map(
      convertToWrappedFormPart
    );
  const finalProps = { ...props, children: parts };
  return {
    ...type(finalProps),
    accept(visitor) {
      visitor[`visit${type.name}`](finalProps);
    }
  };
};

export default (element, visitor) => {
  const wrappedFormPart = convertToWrappedFormPart(element);
  wrappedFormPart.accept(visitor);
};
