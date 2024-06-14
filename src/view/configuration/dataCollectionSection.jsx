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
import { ActionButton, Checkbox, Flex, Radio } from "@adobe/react-spectrum";
import PropTypes from "prop-types";
import SectionHeader from "../components/sectionHeader";
import CodeField from "../components/codeField";
import FormikCheckbox from "../components/formikReactSpectrum3/formikCheckbox";
import FormikCheckboxGroup from "../components/formikReactSpectrum3/formikCheckboxGroup";
import FormikRadioGroup from "../components/formikReactSpectrum3/formikRadioGroup";
import FormikTextField from "../components/formikReactSpectrum3/formikTextField";
import FieldSubset from "../components/fieldSubset";
import RestoreDefaultValueButton from "../components/restoreDefaultValueButton";
import copyPropertiesIfValueDifferentThanDefault from "./utils/copyPropertiesIfValueDifferentThanDefault";
import copyPropertiesWithDefaultFallback from "./utils/copyPropertiesWithDefaultFallback";
import FormElementContainer from "../components/formElementContainer";
import FieldDescriptionAndError from "../components/fieldDescriptionAndError";
import BetaBadge from "../components/betaBadge";
import Alert from "../components/alert";

const CONTEXT_GRANULARITY = {
  ALL: "all",
  SPECIFIC: "specific",
};

const contextOptions = [
  {
    label: "Web (information about the current page)",
    value: "web",
    testId: "contextWebField",
    default: true,
  },
  {
    label: "Device (information about the user's device)",
    value: "device",
    testId: "contextDeviceField",
    default: true,
  },
  {
    label: "Environment (information about the user's browser)",
    value: "environment",
    testId: "contextEnvironmentField",
    default: true,
  },
  {
    label: "Place context (information about the user's location)",
    value: "placeContext",
    testId: "contextPlaceContextField",
    default: true,
  },
  {
    label: "High entropy user-agent hints",
    value: "highEntropyUserAgentHints",
    testId: "contextHighEntropyUserAgentHintsField",
    description:
      "Provides more detailed information about the client device, such as platform version, architecture, model, bitness (64 bit or 32 bit platforms), or full operating system version",
    default: false,
  },
];

export const bridge = {
  getInstanceDefaults: () => {
    const defaults = {
      onBeforeEventSend: "",
      onBeforeLinkClickSend: "",
      clickCollectionEnabled: true,
      clickCollection: {
        internalLinkEnabled: true,
        externalLinkEnabled: true,
        downloadLinkEnabled: true,
        sessionStorageEnabled: false,
        eventGroupingEnabled: false,
        filterClickDetails: "",
      },
      downloadLinkQualifier:
        "\\.(exe|zip|wav|mp3|mov|mpg|avi|wmv|pdf|doc|docx|xls|xlsx|ppt|pptx)$",
      contextGranularity: CONTEXT_GRANULARITY.ALL,
      context: contextOptions
        .filter((option) => option.default)
        .map((option) => option.value),
    };
    return defaults;
  },
  getInitialInstanceValues: ({ instanceSettings }) => {
    const instanceValues = {};

    copyPropertiesWithDefaultFallback({
      toObj: instanceValues,
      fromObj: instanceSettings,
      defaultsObj: bridge.getInstanceDefaults(),
      keys: [
        "onBeforeEventSend",
        "onBeforeLinkClickSend",
        "clickCollectionEnabled",
        "clickCollection",
        "downloadLinkQualifier",
        "context",
      ],
    });

    instanceValues.contextGranularity = instanceSettings.context
      ? CONTEXT_GRANULARITY.SPECIFIC
      : CONTEXT_GRANULARITY.ALL;

    return instanceValues;
  },
  getInstanceSettings: ({ instanceValues }) => {
    const instanceSettings = {};
    const propertyKeysToCopy = [
      "onBeforeEventSend",
      "onBeforeLinkClickSend",
      "clickCollectionEnabled",
    ];
    if (instanceValues.clickCollectionEnabled) {
      propertyKeysToCopy.push("downloadLinkQualifier");
      propertyKeysToCopy.push("clickCollection");
    }
    copyPropertiesIfValueDifferentThanDefault({
      toObj: instanceSettings,
      fromObj: instanceValues,
      defaultsObj: bridge.getInstanceDefaults(),
      keys: propertyKeysToCopy,
    });
    if (instanceValues.contextGranularity === CONTEXT_GRANULARITY.SPECIFIC) {
      instanceSettings.context = instanceValues.context;
    }
    return instanceSettings;
  },
  instanceValidationSchema: object().shape({
    downloadLinkQualifier: string().when("clickCollectionEnabled", {
      is: true,
      then: (schema) =>
        schema.required("Please provide a regular expression.").test({
          name: "invalidDownloadLinkQualifier",
          message: "Please provide a valid regular expression.",
          test(value) {
            try {
              return new RegExp(value) !== null;
            } catch (e) {
              return false;
            }
          },
        }),
    }),
  }),
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
          label="On before event send callback"
          buttonLabelSuffix="on before event send callback code"
          name={`${instanceFieldName}.onBeforeEventSend`}
          description='Callback function for modifying data before each event is sent to the server. A variable named "content" will be available for use within your custom code. Modify "content.xdm" as needed to transform data before it is sent to the server.'
          language="javascript"
          placeholder={
            '// Modify content.xdm or content.data as necessary. There is no need to wrap the\n// code in a function or return a value. For example:\n// content.xdm.web.webPageDetails.name = "Checkout";'
          }
        />
        <div>
          <FormikCheckbox
            data-test-id="clickCollectionEnabledField"
            name={`${instanceFieldName}.clickCollectionEnabled`}
            description="Indicates whether data associated with clicks on navigational links, download links, or personalized content should be automatically collected."
            width="size-5000"
          >
            Enable click data collection
          </FormikCheckbox>
          {instanceValues.clickCollectionEnabled && (
            <FieldSubset>
              <FormikCheckbox
                data-test-id="internalLinkEnabledField"
                name={`${instanceFieldName}.clickCollection.internalLinkEnabled`}
                description="Collect data on link clicks within the current domain."
                width="size-5000"
              >
                Internal links
              </FormikCheckbox>
              {instanceValues.clickCollection.internalLinkEnabled && (
                <FieldSubset>
                  <FormikCheckbox
                    data-test-id="eventGroupingEnabledField"
                    name={`${instanceFieldName}.clickCollection.eventGroupingEnabled`}
                    description="Send link data with subsequent page view event instead of a separate event on the current page."
                    width="size-5000"
                  >
                    Enable event grouping <BetaBadge />
                  </FormikCheckbox>
                  <FormikCheckbox
                    data-test-id="sessionStorageEnabledField"
                    name={`${instanceFieldName}.clickCollection.sessionStorageEnabled`}
                    description="Use session storage to store click-related properties."
                    width="size-5000"
                  >
                    Enable session storage <BetaBadge />
                  </FormikCheckbox>
                </FieldSubset>
              )}
              <FormikCheckbox
                data-test-id="externalLinkEnabledField"
                name={`${instanceFieldName}.clickCollection.externalLinkEnabled`}
                description="Collect data on link clicks to external domains."
                width="size-5000"
              >
                External links
              </FormikCheckbox>
              <FormikCheckbox
                data-test-id="downloadLinkEnabledField"
                name={`${instanceFieldName}.clickCollection.downloadLinkEnabled`}
                description="Collect data on link clicks that qualify as downloads."
                width="size-5000"
              >
                Download links
              </FormikCheckbox>

              <Flex gap="size-100">
                <FormikTextField
                  data-test-id="downloadLinkQualifierField"
                  label="Download link qualifier"
                  name={`${instanceFieldName}.downloadLinkQualifier`}
                  description="Regular expression that qualifies a link URL as a download link."
                  width="size-5000"
                  isRequired
                />
                <ActionButton
                  data-test-id="downloadLinkQualifierTestButton"
                  onPress={async () => {
                    const currentPattern = instanceValues.downloadLinkQualifier;
                    const newPattern =
                      await window.extensionBridge.openRegexTester({
                        pattern: currentPattern,
                      });
                    setFieldValue(
                      `${instanceFieldName}.downloadLinkQualifier`,
                      newPattern,
                    );
                  }}
                  marginTop="size-300"
                >
                  Test regex
                </ActionButton>
                <RestoreDefaultValueButton
                  data-test-id="downloadLinkQualifierRestoreButton"
                  name={`${instanceFieldName}.downloadLinkQualifier`}
                  defaultValue={instanceDefaults.downloadLinkQualifier}
                />
              </Flex>

              <Flex gap="size-100">
                <CodeField
                  data-test-id="filterClickDetailsEditButton"
                  label="Filter click properties"
                  buttonLabelSuffix="filter click properties callback code"
                  name={`${instanceFieldName}.clickCollection.filterClickDetails`}
                  description="Callback function to evaluate and modify click-related properties before collection."
                  language="javascript"
                  placeholder={
                    "// Use this custom code block to adjust or filter click data. You can use the following variables:\n// content.clickedElement: The DOM element that was clicked\n// content.pageName: The page name when the click happened\n// content.linkName: The name of the clicked link\n// content.linkRegion: The region of the clicked link\n// content.linkType: The type of link (typically exit, download, or other)\n// content.linkUrl: The destination URL of the clicked link\n// Return false to omit link data."
                  }
                  beta
                />
              </Flex>
              <Flex gap="size-100">
                <CodeField
                  data-test-id="onBeforeLinkClickSendEditButton"
                  label="On before link click send callback (deprecated, use filter click properties instead)"
                  buttonLabelSuffix="on before link click event send callback code"
                  name={`${instanceFieldName}.onBeforeLinkClickSend`}
                  description="Callback function to modify the event payload when a link is clicked."
                  language="javascript"
                  placeholder={
                    "// Use this custom code block to adjust or filter the payload sent to Adobe. You can use the following variables:\n// content.clickedElement: The DOM element that was clicked\n// content.xdm: The XDM payload for the event\n// content.data: The data object payload for the event\n// Return false to abort sending data."
                  }
                />
              </Flex>
              {instanceValues.onBeforeLinkClickSend &&
                instanceValues.clickCollection.filterClickDetails && (
                  <Alert variant="notice" title="Warning">
                    Both filter-click-properties and on-before-link-click-send
                    callbacks have been defined. On-before-link-click-send has
                    been deprecated and will not be used if
                    filter-click-properties is available.
                  </Alert>
                )}
            </FieldSubset>
          )}
        </div>
        <div>
          <FormikRadioGroup
            label="When sending event data, automatically include:"
            name={`${instanceFieldName}.contextGranularity`}
          >
            <Radio
              data-test-id="contextGranularityAllField"
              value={CONTEXT_GRANULARITY.ALL}
            >
              All default context information
            </Radio>
            <Radio
              data-test-id="contextGranularitySpecificField"
              value={CONTEXT_GRANULARITY.SPECIFIC}
            >
              Specific context information
            </Radio>
          </FormikRadioGroup>

          {instanceValues.contextGranularity ===
            CONTEXT_GRANULARITY.SPECIFIC && (
            <FieldSubset>
              <FormikCheckboxGroup
                aria-label="Context data categories"
                name={`${instanceFieldName}.context`}
              >
                {contextOptions.map((contextOption) => {
                  return (
                    <FieldDescriptionAndError
                      description={contextOption.description}
                      messagePaddingTop="size-0"
                      messagePaddingStart="size-300"
                      key={contextOption.value}
                    >
                      <Checkbox
                        key={contextOption.value}
                        data-test-id={contextOption.testId}
                        value={contextOption.value}
                        width="size-5000"
                      >
                        {contextOption.label}
                      </Checkbox>
                    </FieldDescriptionAndError>
                  );
                })}
              </FormikCheckboxGroup>
            </FieldSubset>
          )}
        </div>
      </FormElementContainer>
    </>
  );
};

DataCollectionSection.propTypes = {
  instanceFieldName: PropTypes.string.isRequired,
};

export default DataCollectionSection;
