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
import { InlineAlert, Content, Flex } from "@adobe/react-spectrum";
import Heading from "../components/typography/heading";
import camelCaseToTitleCase from "../utils/camelCaseToTitleCase";
import FormikCheckbox from "../components/formikReactSpectrum3/formikCheckbox";
import BetaBadge from "../components/betaBadge";
import valueOrDefault from "../utils/valueOrDefault";
import alloyComponents, {
  isDefaultComponent,
} from "../utils/alloyComponents.mjs";

const webSdkComponents = Object.keys(alloyComponents)
  .map((v) => ({
    label: camelCaseToTitleCase(v),
    value: v,
    ...(alloyComponents[v] || {}),
  }))
  .sort((a, b) => a.label.localeCompare(b.label, undefined, { numeric: true }));

export const bridge = {
  getInitialValues: ({ initInfo }) => {
    const isNew = initInfo?.settings?.instances === undefined;
    let components;
    if (isNew) {
      // If this is a newly added extension, default to deprecated components being disabled.
      components = webSdkComponents
        .filter((value) => value.deprecated || isDefaultComponent(value))
        .reduce((acc, value) => {
          acc[value.value] = false;
          return acc;
        }, {});
    } else {
      components = initInfo?.settings?.components || {};
    }

    const initialValues = {
      components: webSdkComponents.reduce((acc, { value }) => {
        acc[value] = valueOrDefault(
          components[value],
          isDefaultComponent(value),
        );
        return acc;
      }, {}),
    };
    return initialValues;
  },
  getSettings: ({ values: { components } }) => {
    const nonDefaultComponents = webSdkComponents
      .map(({ value }) => value)
      .filter((v) => components[v] !== isDefaultComponent(v))
      .reduce((acc, v) => {
        acc[v] = components[v];
        return acc;
      }, {});

    if (Object.keys(nonDefaultComponents).length > 0) {
      return { components: nonDefaultComponents };
    }

    return {};
  },
};

const ComponentsSection = () => {
  return (
    <Flex gap="size-200" direction="column">
      <InlineAlert variant="notice" width="size-6000">
        <Heading>Warning, advanced settings</Heading>
        <Content>
          Modifying settings here can break your implementation. You can
          decrease the size of your Web SDK bundle by disabling components that
          you are not using. Each time you change the list of used components,
          please test your implementation thoroughly to verify that all
          functionalities are working as expected.
        </Content>
      </InlineAlert>

      <div>
        {webSdkComponents.map(({ label, value, description, beta }) => {
          return (
            <FormikCheckbox
              name={`components.${value}`}
              data-test-id={`${value}ComponentCheckbox`}
              width="size-5000"
              description={description}
              key={value}
            >
              {label}
              {beta && <BetaBadge />}
            </FormikCheckbox>
          );
        })}
      </div>
    </Flex>
  );
};

export default ComponentsSection;
