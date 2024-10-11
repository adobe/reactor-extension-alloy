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
import FormikCheckbox from "../components/formikReactSpectrum3/formikCheckbox";

const componentProperties = {
  activityCollector: {
    description: "This component enables automatic link collection and ActivityMap tracking."
  },
  audiences: {
    description: "This component supports Audience Manager integration including running URL and cookie destination and id syncs."
  },
  context: {
    description: "This component enables the automatic collection of context data."
  },
  decisioningEngine: {
    description: "This component enables Adobe Journey Optimizer on device decisioning. You must include this component if you are using the Evaluate rulesets action or the Subcribe ruleset items event."
  },
  eventMerge: {
    deprecated: true,
    description: "This component is deprecated. You must include this component if you are using the Event merge ID data element or Reset event merge ID action."
  },
  legacyMediaAnalytics: {
    label: "Media Analytics Bridge",
    description: "This component enables Edge streaming media using the media analytics interface. You must include this component if you are using the Get media analytics tracker action."
  },
  machineLearning: {
    deprecated: true,
    description: "This component is deprecated. Including this component add the machineLearning key to send event responses."
  },
  personalization: {
    description: "This component enables Adobe Target and Adobe Journey Optimizer integrations."
  },
  privacy: {
    label: "Consent",
    description: "This component supports consent integrations. You must include this component if you are using the Set consent action."
  },
  streamingMedia: {
    description: "This component enables Edge streaming media. You must include this component if you are using the Send media event action."
  }
}
console.log(Object.keys(webSdkComponentsExports));
const webSdkComponents = Object.keys(webSdkComponentsExports).map((v) => ({
  label: camelCaseToTitleCase(v),
  value: v,
  ...(componentProperties[v] || {})
})).sort((a, b) => a.label.localeCompare(b.label, undefined, { numeric: true }));

export const bridge = {
  getInitialValues: ({ initInfo }) => {
    const isNew = initInfo?.settings?.instances === undefined;
    let components
    if (isNew) {
      // If this is a newly added extension, default to deprecated components being disabled.
      components = webSdkComponents.filter(value => value.deprecated).reduce((acc, value) => {
        acc[value.value] = false;
        return acc;
      }, {});
    } else {
      components = initInfo?.settings?.components || {};
    }

    const initialValues = {
      components: webSdkComponents.reduce((acc, { value }) => {
        acc[value] = components[value] !== false;
        return acc;
      }, {})
    };
    console.log(initialValues);
    return initialValues;
  },
  getSettings: ({ values: { components } }) => {
    console.log(components);

    const excludedComponents = webSdkComponents
      .map(({ value }) => value)
      .filter((v) => !components[v])
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

      {webSdkComponents.map(({ label, value, description }) => {
        return (
          <FormikCheckbox
            name={`components.${value}`}
            data-test-id={`${value}ComponentCheckbox`}
            width="size-5000"
            description={description}
            key={value}
          >
            {label}
          </FormikCheckbox>
        );
      })}
    </Flex >
  );
};

export default ComponentsSection;
