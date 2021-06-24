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
import { useField, useFormikContext } from "formik";
import { object, string } from "yup";
import {
  ActionButton,
  Checkbox as ReactSpectrumCheckbox,
  Flex,
  Radio
} from "@adobe/react-spectrum";
import PropTypes from "prop-types";
import SectionHeader from "../components/sectionHeader";
import CodeField from "../components/codeField";
import {
  Checkbox,
  CheckboxGroup,
  RadioGroup,
  TextField
} from "../components/formikReactSpectrum3";
import FieldSubset from "../components/fieldSubset";
import RestoreDefaultValueButton from "../components/restoreDefaultValueButton";
import copyPropertiesIfValueDifferentThanDefault from "./utils/copyPropertiesIfValueDifferentThanDefault";
import copyPropertiesWithDefaultFallback from "./utils/copyPropertiesWithDefaultFallback";
import FormElementContainer from "../components/formElementContainer";

const CONTEXT_GRANULARITY = {
  ALL: "all",
  SPECIFIC: "specific"
};

const contextOptions = [
  {
    label: "Web (information about the current page)",
    value: "web",
    testId: "contextWebField"
  },
  {
    label: "Device (information about the user's device)",
    value: "device",
    testId: "contextDeviceField"
  },
  {
    label: "Environment (information about the user's browser)",
    value: "environment",
    testId: "contextEnvironmentField"
  },
  {
    label: "Place Context (information about the user's location)",
    value: "placeContext",
    testId: "contextPlaceContextField"
  }
];

export const bridge = {
  getInstanceDefaults: () => ({
    onBeforeEventSend: "",
    clickCollectionEnabled: true,
    downloadLinkQualifier:
      "\\.(exe|zip|wav|mp3|mov|mpg|avi|wmv|pdf|doc|docx|xls|xlsx|ppt|pptx)$",
    contextGranularity: CONTEXT_GRANULARITY.ALL,
    context: contextOptions.map(option => option.value)
  }),
  getInitialInstanceValues: ({ instanceSettings }) => {
    const instanceValues = {};

    copyPropertiesWithDefaultFallback({
      toObj: instanceValues,
      fromObj: instanceSettings,
      defaultsObj: bridge.getInstanceDefaults(),
      keys: [
        "onBeforeEventSend",
        "clickCollectionEnabled",
        "downloadLinkQualifier",
        "context"
      ]
    });

    instanceValues.contextGranularity = instanceSettings.context
      ? CONTEXT_GRANULARITY.SPECIFIC
      : CONTEXT_GRANULARITY.ALL;

    return instanceValues;
  },
  getInstanceSettings: ({ instanceValues }) => {
    const instanceSettings = {};
    const propertyKeysToCopy = ["onBeforeEventSend", "clickCollectionEnabled"];

    if (instanceValues.clickCollectionEnabled) {
      propertyKeysToCopy.push("downloadLinkQualifier");
    }

    copyPropertiesIfValueDifferentThanDefault({
      toObj: instanceSettings,
      fromObj: instanceValues,
      defaultsObj: bridge.getInstanceDefaults(),
      keys: propertyKeysToCopy
    });

    if (instanceValues.contextGranularity === CONTEXT_GRANULARITY.SPECIFIC) {
      instanceSettings.context = instanceValues.context;
    }

    return instanceSettings;
  },
  instanceValidationSchema: object().shape({
    downloadLinkQualifier: string().when("clickCollectionEnabled", {
      is: true,
      then: string()
        .min(1)
        .test({
          name: "invalidDownloadLinkQualifier",
          message: "Please provide a valid regular expression.",
          test(value) {
            try {
              return new RegExp(value) !== null;
            } catch (e) {
              return false;
            }
          }
        })
    })
  })
};

const DataCollectionSection = ({ instanceFieldName }) => {
  const { setFieldValue } = useFormikContext();
  const [{ value: instanceValues }] = useField(instanceFieldName);
  const instanceDefaults = bridge.getInstanceDefaults();

  return (
    <>
      <SectionHeader learnMoreUrl="https://adobe.ly/2CYnq65">
        Data Collection
      </SectionHeader>
      <FormElementContainer>
        <CodeField
          data-test-id="onBeforeEventSendEditButton"
          label="onBeforeEventSend"
          buttonLabelSuffix="onBeforeEventSend Code"
          name={`${instanceFieldName}.onBeforeEventSend`}
          description='Callback function for modifying data before each event is sent to the server. A variable named "content" will be available for use within your custom code. Modify "content.xdm" as needed to transform data before it is sent to the server.'
          language="javascript"
          placeholder={
            '// Modify content.xdm or content.data as necessary. There is no need to wrap the\n// code in a function or return a value. For example:\n// content.xdm.web.webPageDetails.name = "Checkout";'
          }
        />
        <Checkbox
          data-test-id="clickCollectionEnabledField"
          name={`${instanceFieldName}.clickCollectionEnabled`}
          description="Indicates whether data associated with clicks on navigational links, download links, or personalized content should be automatically collected."
          width="size-5000"
        >
          Enable click data collection
        </Checkbox>
        {instanceValues.clickCollectionEnabled && (
          <FieldSubset>
            <Flex>
              <TextField
                data-test-id="downloadLinkQualifierField"
                label="Download Link Qualifier"
                name={`${instanceFieldName}.downloadLinkQualifier`}
                description="Regular expression that qualifies a link URL as a download link."
                width="size-5000"
              />
              <ActionButton
                data-test-id="downloadLinkQualifierTestButton"
                isQuiet
                onPress={async () => {
                  const currentPattern = instanceValues.downloadLinkQualifier;
                  const newPattern = await window.extensionBridge.openRegexTester(
                    {
                      pattern: currentPattern
                    }
                  );
                  setFieldValue(
                    `${instanceFieldName}.downloadLinkQualifier`,
                    newPattern
                  );
                }}
                marginTop="size-300"
              >
                Test Regex
              </ActionButton>
              <RestoreDefaultValueButton
                data-test-id="downloadLinkQualifierRestoreButton"
                name={`${instanceFieldName}.downloadLinkQualifier`}
                defaultValue={instanceDefaults.downloadLinkQualifier}
              />
            </Flex>
          </FieldSubset>
        )}
        <div>
          <RadioGroup
            label="When sending event data, automatically include:"
            name={`${instanceFieldName}.contextGranularity`}
          >
            <Radio
              data-test-id="contextGranularityAllField"
              value={CONTEXT_GRANULARITY.ALL}
            >
              All context information
            </Radio>
            <Radio
              data-test-id="contextGranularitySpecificField"
              value={CONTEXT_GRANULARITY.SPECIFIC}
            >
              Specific context information
            </Radio>
          </RadioGroup>

          {instanceValues.contextGranularity ===
            CONTEXT_GRANULARITY.SPECIFIC && (
            <FieldSubset>
              <CheckboxGroup
                aria-label="Context Data Categories"
                name={`${instanceFieldName}.context`}
              >
                {contextOptions.map(contextOption => {
                  return (
                    <ReactSpectrumCheckbox
                      key={contextOption.value}
                      data-test-id={contextOption.testId}
                      value={contextOption.value}
                    >
                      {contextOption.label}
                    </ReactSpectrumCheckbox>
                  );
                })}
              </CheckboxGroup>
            </FieldSubset>
          )}
        </div>
      </FormElementContainer>
    </>
  );
};

DataCollectionSection.propTypes = {
  instanceFieldName: PropTypes.string.isRequired
};

export default DataCollectionSection;
