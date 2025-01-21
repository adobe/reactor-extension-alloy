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

import { Radio } from "@adobe/react-spectrum";
import React from "react";
import PropTypes from "prop-types";
import { object } from "yup";
import SectionHeader from "../components/sectionHeader";
import FormikRadioGroupWithDataElement, {
  createRadioGroupWithDataElementValidationSchema,
} from "../components/formikReactSpectrum3/formikRadioGroupWithDataElement";
import FormElementContainer from "../components/formElementContainer";
import copyPropertiesWithDefaultFallback from "./utils/copyPropertiesWithDefaultFallback";
import copyPropertiesIfValueDifferentThanDefault from "./utils/copyPropertiesIfValueDifferentThanDefault";
import { useField } from "formik";

const CONSENT_LEVEL = {
  IN: "in",
  OUT: "out",
  PENDING: "pending",
};

export const bridge = {
  getInstanceDefaults: () => ({
    defaultConsent: CONSENT_LEVEL.IN,
  }),
  getInitialInstanceValues: ({ instanceSettings }) => {
    const instanceValues = {};

    copyPropertiesWithDefaultFallback({
      toObj: instanceValues,
      fromObj: instanceSettings,
      defaultsObj: bridge.getInstanceDefaults(),
      keys: ["defaultConsent"],
    });

    return instanceValues;
  },
  getInstanceSettings: ({ instanceValues, components }) => {
    const instanceSettings = {};

    if (instanceValues.privacy) {
      copyPropertiesIfValueDifferentThanDefault({
        toObj: instanceSettings,
        fromObj: instanceValues,
        defaultsObj: bridge.getInstanceDefaults(),
        keys: ["defaultConsent"],
      });
    }

    return instanceSettings;
  },
  instanceValidationSchema: object().shape({
    defaultConsent:
      createRadioGroupWithDataElementValidationSchema("defaultConsent"),
  }),
};

const PrivacySection = ({ instanceFieldName }) => {
  const [{ value: privacyComponentEnabled }] = useField("components.privacy");
  if (!privacyComponentEnabled) {
    return null;
  }
  return (
    <>
      <SectionHeader learnMoreUrl="https://adobe.ly/2WSngEh">
        Privacy
      </SectionHeader>
      <FormElementContainer>
        <FormikRadioGroupWithDataElement
          dataTestIdPrefix="defaultConsent"
          name={`${instanceFieldName}.defaultConsent`}
          label="Default consent (not persisted to user's profile)"
          dataElementDescription={
            'This data element should resolve to "in", "out", or "pending".'
          }
        >
          <Radio data-test-id="defaultConsentInRadio" value={CONSENT_LEVEL.IN}>
            In - Collect events that occur before the user provides consent
            preferences.
          </Radio>
          <Radio
            data-test-id="defaultConsentOutRadio"
            value={CONSENT_LEVEL.OUT}
          >
            Out - Drop events that occur before the user provides consent
            preferences.
          </Radio>
          <Radio
            data-test-id="defaultConsentPendingRadio"
            value={CONSENT_LEVEL.PENDING}
          >
            Pending - Queue events that occur before the user provides consent
            preferences.
          </Radio>
        </FormikRadioGroupWithDataElement>
      </FormElementContainer>
    </>
  );
};

PrivacySection.propTypes = {
  instanceFieldName: PropTypes.string.isRequired,
};

export default PrivacySection;
