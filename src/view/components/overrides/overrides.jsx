/*
Copyright 2023 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
*/ import {
  ActionButton,
  Button,
  Flex,
  Heading
} from "@adobe/react-spectrum";
import Delete from "@spectrum-icons/workflow/Delete";
import { FieldArray, useField } from "formik";
import PropTypes from "prop-types";
import React from "react";

import FormElementContainer from "../formElementContainer";
import FormikTextField from "../formikReactSpectrum3/formikTextField";
import SectionHeader from "../sectionHeader";
import DataElementSelector from "../dataElementSelector";

/**
 * The names of the different fields that can appear in the form. Used to pass
 * to the `showFields` prop of the `Overrides` component.
 */
export const FIELD_NAMES = {
  eventDatasetOverride: "eventDatasetOverride",
  idSyncContainerOverride: "idSyncContainerOverride",
  targetPropertyTokenOverride: "targetPropertyTokenOverride",
  reportSuitesOverride: "reportSuitesOverride"
};

const ReportSuitesOverride = ({ prefix }) => {
  const fieldName = `${prefix}.com_adobe_analytics.reportSuites`;
  const [{ value: rsids }] = useField(fieldName);
  return (
    <FieldArray name={fieldName}>
      {({ remove, push }) => (
        <>
          <Flex direction="column" gap="size-100">
            {rsids.map((rsid, index) => (
              <Flex key={index} direction="row">
                <DataElementSelector>
                  <FormikTextField
                    data-test-id={`${
                      FIELD_NAMES.reportSuitesOverride
                    }.${index}`}
                    label={index === 0 && "Report suites"}
                    name={`${fieldName}.${index}`}
                    description={
                      index === rsids.length - 1 &&
                      "The IDs for the destination report suites in Adobe Analytics. The value must be a preconfigured override report suite from your datastream configuration and overrides the primary report suites."
                    }
                    width="size-5000"
                    key={index}
                  />
                </DataElementSelector>
                <ActionButton
                  isQuiet
                  isDisabled={rsids.length < 2}
                  marginTop={index === 0 && "size-300"}
                  data-test-id={`removeReportSuite.${index}`}
                  aria-label={`Remove report suite #${index + 1}`}
                  onPress={() => remove(index)}
                >
                  <Delete />
                </ActionButton>
              </Flex>
            ))}
          </Flex>
          <Button
            data-test-id="addReportSuite"
            variant="secondary"
            marginTop="size-100"
            onPress={() => push("")}
            UNSAFE_style={{ maxWidth: "fit-content" }}
          >
            Add Report Suite
          </Button>
        </>
      )}
    </FieldArray>
  );
};

ReportSuitesOverride.propTypes = {
  prefix: PropTypes.string.isRequired
};

const HeaderContainer = ({ largeHeader, children, ...props }) => {
  if (largeHeader) {
    return <SectionHeader {...props}>{children}</SectionHeader>;
  }
  return (
    <Heading
      {...props}
      level={5}
      margin="0"
      UNSAFE_style={{
        fontWeight: "normal",
        color:
          "var(--spectrum-fieldlabel-text-color, var(--spectrum-alias-label-text-color) )"
      }}
    >
      {children}
    </Heading>
  );
};

HeaderContainer.propTypes = {
  largeHeader: PropTypes.bool.isRequired,
  children: PropTypes.node.isRequired
};

/**
 * A section of a form that allows the user to override datastream configuration
 *
 * @typedef {Object} OverridesProps
 * @property {string} options.instanceFieldName
 * The name of the Formik parent form. State will be stored as a nested object under the "edgeConfigOverrides" key.
 * @property {boolean} options.largeHeader Whether to use the large header. Defaults to false.
 * @property {Array<"eventDatasetOverride" | "idSyncContainerOverride" | "targetPropertyTokenOverride" | "targetPropertyTokenOverride" | "reportSuitesOverride">} options.showFields
 * Which fields to show. Defaults to showing all fields
 * @param {OverridesProps} options
 * @returns {React.Element}
 */
const Overrides = ({
  instanceFieldName,
  largeHeader = false,
  showFields = [...Object.values(FIELD_NAMES)]
}) => {
  const prefix = instanceFieldName
    ? `${instanceFieldName}.edgeConfigOverrides`
    : "edgeConfigOverrides";
  const showFieldsSet = new Set(showFields);

  return (
    <>
      <HeaderContainer largeHeader={largeHeader}>
        Datastream Configuration Overrides
      </HeaderContainer>
      <FormElementContainer>
        <Flex direction="column" marginX={largeHeader ? "" : "size-300"}>
          {showFieldsSet.has(FIELD_NAMES.eventDatasetOverride) && (
            <DataElementSelector>
              <FormikTextField
                data-test-id={FIELD_NAMES.eventDatasetOverride}
                label="Event dataset"
                name={`${prefix}.com_adobe_experience_platform.datasets.event.datasetId`}
                description="The ID for the destination event dataset in the Adobe Experience Platform. The value must be a preconfigured secondary dataset from your datastream configuration and overrides the primary dataset."
                width="size-5000"
              />
            </DataElementSelector>
          )}
          {showFieldsSet.has(FIELD_NAMES.idSyncContainerOverride) && (
            <DataElementSelector>
              <FormikTextField
                data-test-id={FIELD_NAMES.idSyncContainerOverride}
                label="Third-party ID sync container"
                name={`${prefix}.com_adobe_identity.idSyncContainerId`}
                inputMode="numeric"
                width="size-5000"
                pattern={/\d+/}
                description="The ID for the destination third-party ID sync container in Adobe Audience Manager. The value must be a preconfigured secondary container from your datastream configuration and overrides the primary container."
              />
            </DataElementSelector>
          )}
          {showFieldsSet.has(FIELD_NAMES.targetPropertyTokenOverride) && (
            <DataElementSelector>
              <FormikTextField
                data-test-id={FIELD_NAMES.targetPropertyTokenOverride}
                label="Target property token"
                name={`${prefix}.com_adobe_target.propertyToken`}
                description="The token for the destination property in Adobe Target. The value must be a preconfigured property override from your datastream configuration and overrides the primary property."
                width="size-5000"
              />
            </DataElementSelector>
          )}
          {showFieldsSet.has(FIELD_NAMES.reportSuitesOverride) && (
            <ReportSuitesOverride prefix={prefix} />
          )}
        </Flex>
      </FormElementContainer>
    </>
  );
};

Overrides.propTypes = {
  instanceFieldName: PropTypes.string,
  largeHeader: PropTypes.bool,
  showFields: PropTypes.arrayOf(PropTypes.oneOf(Object.values(FIELD_NAMES)))
};

export default Overrides;
