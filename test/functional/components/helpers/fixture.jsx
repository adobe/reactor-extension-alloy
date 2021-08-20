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

import React from "react";
import ReactDOM from "react-dom";
import { deserialize } from "react-serialize";
import { lightTheme, Provider } from "@adobe/react-spectrum";
import Heading from "../../../../src/view/components/typography/heading";
import Body from "../../../../src/view/components/typography/body";

// If you're adding tests for a component, be sure to add the component here.
const components = {
  Heading,
  Body
};

const isCustomElement = type => {
  return /[A-Z]/.test(type.charAt(0));
};

const assertElementSupported = serializedReactElement => {
  const { type } = serializedReactElement;
  if (isCustomElement(type) && !components[type]) {
    throw new Error(
      `You must add the ${type} component to fixture.jsx in order to render it in a test.`
    );
  }
};

window.renderSerializedReactElement = serializedReactElement => {
  // This only checks the top-level element to see if its component
  // has been imported and listed in the components object above. It
  // won't work for descendent elements unless we modify the deserialize
  // function.
  assertElementSupported(serializedReactElement);

  const deserializedReactElement = deserialize(serializedReactElement, {
    components
  });

  ReactDOM.render(
    <Provider
      theme={lightTheme}
      colorScheme="light"
      UNSAFE_className="react-spectrum-provider"
    >
      {deserializedReactElement}
    </Provider>,
    document.getElementById("root")
  );
};
