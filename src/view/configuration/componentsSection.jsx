/*
Copyright 2024 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
*/

import React from "react";
import {
  Checkbox,
  InlineAlert,
  Content,
  Flex,
  View,
} from "@adobe/react-spectrum";
import * as webSdkComponentsExports from "@adobe/alloy/libEs6/core/componentCreators";
import Heading from "../components/typography/heading";
import camelCaseToTitleCase from "../utils/camelCaseToTitleCase";
import FormikCheckboxGroup from "../components/formikReactSpectrum3/formikCheckboxGroup";

const webSdkComponents = Object.keys(webSdkComponentsExports).map((v) => ({
  label: camelCaseToTitleCase(v),
  value: v,
}));
export const bridge = {
  getInitialValues: ({ initInfo }) => {
    const components = initInfo?.settings?.components || {};
    return {
      components: webSdkComponents.reduce((acc, { value }) => {
        if (components[value] !== false) {
          acc.push(value);
        }

        return acc;
      }, []),
    };
  },
  getSettings: ({ values: { components } }) => {
    const excludedComponents = webSdkComponents
      .map(({ value }) => value)
      .filter((v) => !components.includes(v))
      .reduce((acc, v) => {
        acc[v] = false;
        return acc;
      }, {});

    if (Object.keys(excludedComponents).length > 0) {
      return { components: excludedComponents };
    }

    return {};
  },
};

const ComponentsSection = () => {
  return (
    <Flex gap="size-200" direction="column">
      <Heading size="M">Components</Heading>
      <View width="size-6000">
        <InlineAlert variant="notice">
          <Heading>Warning</Heading>
          <Content>
            You can decrease the size of your Web SDK bundle by disabling
            components that you are not using. Each time you change the list of
            used components, please test your implementation thoroughly to
            verify that all functionalities are working as expected.
          </Content>
        </InlineAlert>
      </View>
      <FormikCheckboxGroup
        aria-label="Context data categories"
        name="components"
        orientation="horizontal"
      >
        {webSdkComponents.map(({ label, value }) => {
          return (
            <Checkbox
              key={value}
              data-test-id={`${value}ComponentCheckbox`}
              value={value}
              width="size-5000"
            >
              {label}
            </Checkbox>
          );
        })}
      </FormikCheckboxGroup>
    </Flex>
  );
};

export default ComponentsSection;
