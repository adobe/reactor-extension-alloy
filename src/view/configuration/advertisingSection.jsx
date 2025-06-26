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
import PropTypes from "prop-types";
import { useField } from "formik";
import {
  Content,
  Flex,
  Heading,
  InlineAlert,
  Item,
  View,
} from "@adobe/react-spectrum";
import SectionHeader from "../components/sectionHeader";
import copyPropertiesIfValueDifferentThanDefault from "./utils/copyPropertiesIfValueDifferentThanDefault";
import copyPropertiesWithDefaultFallback from "./utils/copyPropertiesWithDefaultFallback";
import FormElementContainer from "../components/formElementContainer";
import DataElementSelector from "../components/dataElementSelector";
import FormikComboBox from "../components/formikReactSpectrum3/formikComboBox";
import SINGLE_DATA_ELEMENT_REGEX from "../constants/singleDataElementRegex";
import { object, lazy, string, mixed } from "yup";

const ENABLED = "Enabled";
const DISABLED = "Disabled";

export const bridge = {
  getInstanceDefaults: () => ({
    id5Enabled: DISABLED,
    rampIdEnabled: DISABLED,
  }),
  getInitialInstanceValues: ({
    instanceSettings: { id5Enabled, rampIdEnabled },
  }) => {
    const instanceValues = {};

    const copyFrom = { id5Enabled, rampIdEnabled };

    if (id5Enabled != null && typeof id5Enabled === "boolean") {
      copyFrom.id5Enabled = id5Enabled ? ENABLED : DISABLED;
    }
    if (rampIdEnabled != null && typeof rampIdEnabled === "boolean") {
      copyFrom.rampIdEnabled = rampIdEnabled ? ENABLED : DISABLED;
    }

    copyPropertiesWithDefaultFallback({
      toObj: instanceValues,
      fromObj: copyFrom,
      defaultsObj: bridge.getInstanceDefaults(),
      keys: ["id5Enabled", "rampIdEnabled"],
    });

    return instanceValues;
  },
  getInstanceSettings: ({ instanceValues, components }) => {
    const instanceSettings = {};

    if (components.advertising) {
      copyPropertiesIfValueDifferentThanDefault({
        toObj: instanceSettings,
        fromObj: instanceValues,
        defaultsObj: bridge.getInstanceDefaults(),
        keys: ["id5Enabled", "rampIdEnabled"],
      });

      if (instanceSettings.id5Enabled === ENABLED) {
        instanceSettings.id5Enabled = true;
      } else if (instanceSettings.id5Enabled === DISABLED) {
        instanceSettings.id5Enabled = false;
      }

      if (instanceSettings.rampIdEnabled === ENABLED) {
        instanceSettings.rampIdEnabled = true;
      } else if (instanceSettings.rampIdEnabled === DISABLED) {
        instanceSettings.rampIdEnabled = false;
      }
    }

    return instanceSettings;
  },
  instanceValidationSchema: object().shape({
    id5Enabled: lazy((value) =>
      typeof value === "string" && value.includes("%")
        ? string()
            .matches(SINGLE_DATA_ELEMENT_REGEX, {
              message: "Please enter a valid data element.",
              excludeEmptyString: true,
            })
            .nullable()
        : mixed()
            .oneOf(
              [ENABLED, DISABLED],
              "Please choose a value or specify a data element.",
            )
            .required("Please choose a value or specify a data element."),
    ),
    rampIdEnabled: lazy((value) =>
      typeof value === "string" && value.includes("%")
        ? string()
            .matches(SINGLE_DATA_ELEMENT_REGEX, {
              message: "Please enter a valid data element.",
              excludeEmptyString: true,
            })
            .nullable()
        : mixed()
            .oneOf(
              [ENABLED, DISABLED],
              "Please choose a value or specify a data element.",
            )
            .required("Please choose a value or specify a data element."),
    ),
  }),
};

const AdvertisingSection = ({ instanceFieldName }) => {
  const [{ value: advertisingComponentEnabled }] = useField(
    "components.advertising",
  );

  const disabledView = (
    <View width="size-6000">
      <InlineAlert variant="info">
        <Heading>Adobe Advertising component disabled</Heading>
        <Content>
          The Adobe Advertising custom build component is disabled. Enable it
          above to configure Adobe Advertising settings.
        </Content>
      </InlineAlert>
    </View>
  );

  return (
    <>
      <SectionHeader learnMoreUrl="https://experienceleague.adobe.com/docs/experience-platform/destinations/catalog/advertising/overview.html">
        AdobeAdvertising
      </SectionHeader>
      {advertisingComponentEnabled ? (
        <FormElementContainer>
          <Flex direction="row" gap="size-250">
            <DataElementSelector>
              <FormikComboBox
                data-test-id="id5EnabledField"
                label="Enable ID5"
                name={`${instanceFieldName}.id5Enabled`}
                description="Enables ID5 integration for advertising identity resolution."
                width="size-5000"
                isRequired
                allowsCustomValue
              >
                <Item key={ENABLED}>{ENABLED}</Item>
                <Item key={DISABLED}>{DISABLED}</Item>
              </FormikComboBox>
            </DataElementSelector>
          </Flex>
          <Flex direction="row" gap="size-250">
            <DataElementSelector>
              <FormikComboBox
                data-test-id="rampIdEnabledField"
                label="Enable RampID"
                name={`${instanceFieldName}.rampIdEnabled`}
                description="Enables RampID integration for cross-device identity resolution and advertising use cases."
                width="size-5000"
                isRequired
                allowsCustomValue
              >
                <Item key={ENABLED}>{ENABLED}</Item>
                <Item key={DISABLED}>{DISABLED}</Item>
              </FormikComboBox>
            </DataElementSelector>
          </Flex>
        </FormElementContainer>
      ) : (
        disabledView
      )}
    </>
  );
};

AdvertisingSection.propTypes = {
  instanceFieldName: PropTypes.string.isRequired,
};

export default AdvertisingSection;
