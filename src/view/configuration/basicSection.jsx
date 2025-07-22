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
import { useField } from "formik";
import { object, string, boolean } from "yup";
import { Flex, InlineAlert, Heading, Content } from "@adobe/react-spectrum";
import PropTypes from "prop-types";
import DataElementSelector from "../components/dataElementSelector";
import FormikTextField from "../components/formikReactSpectrum3/formikTextField";
import FormikCheckbox from "../components/formikReactSpectrum3/formikCheckbox";
import RestoreDefaultValueButton from "../components/restoreDefaultValueButton";
import copyPropertiesIfValueDifferentThanDefault from "./utils/copyPropertiesIfValueDifferentThanDefault";
import copyPropertiesWithDefaultFallback from "./utils/copyPropertiesWithDefaultFallback";
import validateDuplicateValue from "./utils/validateDuplicateValue";
import FormElementContainer from "../components/formElementContainer";

export const bridge = {
  getInstanceDefaults: ({ initInfo }) => ({
    name: "alloy",
    persistedName: undefined,
    orgId: initInfo.company.orgId,
    edgeDomain: "edge.adobedc.net",
    useExistingAlloy: false,
  }),
  getInitialInstanceValues: ({ initInfo, instanceSettings }) => {
    const instanceValues = {};

    copyPropertiesWithDefaultFallback({
      toObj: instanceValues,
      fromObj: instanceSettings,
      defaultsObj: bridge.getInstanceDefaults({ initInfo }),
      keys: ["name", "orgId", "edgeDomain", "useExistingAlloy"],
    });

    instanceValues.persistedName = instanceValues.name;

    return instanceValues;
  },
  getInstanceSettings: ({ initInfo, instanceValues }) => {
    const { name } = instanceValues;
    const instanceSettings = {
      name,
    };

    // Note that orgId isn't saved to the settings object if it's the same
    // as the default, even though an orgId is required by the Alloy library.
    // This is doable because if no orgId is saved to the settings object, the library
    // portion of the extension will use the orgId listed on the Launch library (the Launch
    // library exposes it to extensions at runtime), which will match the default
    // org ID here.
    copyPropertiesIfValueDifferentThanDefault({
      toObj: instanceSettings,
      fromObj: instanceValues,
      defaultsObj: bridge.getInstanceDefaults({ initInfo }),
      keys: ["orgId", "edgeDomain", "useExistingAlloy"],
    });

    return instanceSettings;
  },
  instanceValidationSchema: object()
    .shape({
      name: string()
        .required("Please specify a name.")
        // Under strict mode, setting window["123"], where the key is all
        // digits, throws a "Failed to set an indexed property on 'Window'" error.
        // This regex ensure there's at least one non-digit.
        .matches(/\D+/, "Please provide a non-numeric name.")
        .test({
          name: "notWindowPropertyName",
          message:
            "Please provide a name that does not conflict with a property already found on the window object.",
          test(value) {
            return !(value in window);
          },
        }),
      orgId: string().when("useExistingAlloy", {
        is: false,
        then: (schema) =>
          schema.required("Please specify an IMS organization ID."),
      }),
      edgeDomain: string().when("useExistingAlloy", {
        is: false,
        then: (schema) => schema.required("Please specify an edge domain."),
      }),
      useExistingAlloy: boolean(),
    })
    // TestCafe doesn't allow this to be an arrow function because of
    // how it scopes "this".
    // eslint-disable-next-line func-names
    .test("uniqueName", function (instance, testContext) {
      const { path: instancePath, parent: instances } = testContext;
      return validateDuplicateValue({
        createError: this.createError,
        instances,
        instance,
        instancePath,
        key: "name",
        message:
          "Please provide a name unique from those used for other instances.",
      });
    })
    // TestCafe doesn't allow this to be an arrow function because of
    // how it scopes "this".
    // eslint-disable-next-line func-names
    .test("uniqueOrgId", function (instance, testContext) {
      const { path: instancePath, parent: instances } = testContext;
      return validateDuplicateValue({
        createError: this.createError,
        instances,
        instance,
        instancePath,
        key: "orgId",
        message:
          "Please provide an IMS Organization ID unique from those used for other instances.",
      });
    }),
};

const BasicSection = ({ instanceFieldName, initInfo }) => {
  const [{ value: instanceValues }] = useField(instanceFieldName);
  const instanceDefaults = bridge.getInstanceDefaults({ initInfo });

  return (
    <FormElementContainer>
      <FormikCheckbox
        data-test-id="useExistingAlloyField"
        name={`${instanceFieldName}.useExistingAlloy`}
        description="Check this box if alloy.js is already loaded on your site."
        width="size-5000"
      >
        Use existing alloy.js instance
      </FormikCheckbox>
      <DataElementSelector>
        <FormikTextField
          data-test-id="nameField"
          label="Name"
          name={`${instanceFieldName}.name`}
          description="A global method on the window object will be created with this name."
          isRequired
          width="size-5000"
        />
      </DataElementSelector>
      {instanceValues.persistedName &&
      instanceValues.name !== instanceValues.persistedName ? (
        <InlineAlert
          data-test-id="nameChangeAlert"
          variant="notice"
          width="size-5000"
        >
          <Heading size="XXS">Potential problems due to name change</Heading>
          <Content>
            Any rule components or data elements using this instance will no
            longer function as expected when running on your website. We
            recommend removing or updating those resources before publishing
            your next library.
          </Content>
        </InlineAlert>
      ) : null}
      {!instanceValues.useExistingAlloy && (
        <>
          <Flex>
            <DataElementSelector>
              <FormikTextField
                data-test-id="orgIdField"
                label="IMS organization ID"
                name={`${instanceFieldName}.orgId`}
                description="Your assigned Experience Cloud organization ID."
                isRequired
                width="size-5000"
              />
            </DataElementSelector>
            <RestoreDefaultValueButton
              data-test-id="orgIdRestoreButton"
              name={`${instanceFieldName}.orgId`}
              defaultValue={instanceDefaults.orgId}
            />
          </Flex>
          <Flex>
            <DataElementSelector>
              <FormikTextField
                data-test-id="edgeDomainField"
                label="Edge domain"
                name={`${instanceFieldName}.edgeDomain`}
                description="The domain that will be used to interact with
                        Adobe services. Update this setting if you have
                        mapped one of your first-party domains (using
                        CNAME) to an Adobe-provisioned domain."
                isRequired
                width="size-5000"
              />
            </DataElementSelector>
            <RestoreDefaultValueButton
              data-test-id="edgeDomainRestoreButton"
              name={`${instanceFieldName}.edgeDomain`}
              defaultValue={instanceDefaults.edgeDomain}
            />
          </Flex>
        </>
      )}
    </FormElementContainer>
  );
};

BasicSection.propTypes = {
  instanceFieldName: PropTypes.string.isRequired,
  initInfo: PropTypes.object.isRequired,
};

export default BasicSection;
