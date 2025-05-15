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
import SectionHeader from "../components/sectionHeader";
import FormikCheckbox from "../components/formikReactSpectrum3/formikCheckbox";
import copyPropertiesIfValueDifferentThanDefault from "./utils/copyPropertiesIfValueDifferentThanDefault";
import copyPropertiesWithDefaultFallback from "./utils/copyPropertiesWithDefaultFallback";
import FormElementContainer from "../components/formElementContainer";

export const bridge = {
  getInstanceDefaults: () => ({
    id5Enabled: false,
    rampIdEnabled: false,
  }),
  getInitialInstanceValues: ({ instanceSettings }) => {
    const instanceValues = {};

    copyPropertiesWithDefaultFallback({
      toObj: instanceValues,
      fromObj: instanceSettings,
      defaultsObj: bridge.getInstanceDefaults(),
      keys: ["id5Enabled", "rampIdEnabled"],
    });

    return instanceValues;
  },
  getInstanceSettings: ({ instanceValues }) => {
    const instanceSettings = {};

    copyPropertiesIfValueDifferentThanDefault({
      toObj: instanceSettings,
      fromObj: instanceValues,
      defaultsObj: bridge.getInstanceDefaults(),
      keys: ["id5Enabled", "rampIdEnabled"],
    });

    return instanceSettings;
  },
};

const AdvertisingSection = ({ instanceFieldName }) => {
  return (
    <>
      <SectionHeader learnMoreUrl="https://experienceleague.adobe.com/docs/experience-platform/destinations/catalog/advertising/overview.html">
        Advertising
      </SectionHeader>
      <FormElementContainer>
        <FormikCheckbox
          data-test-id="id5EnabledField"
          name={`${instanceFieldName}.id5Enabled`}
          description="Enables ID5 integration for advertising identity resolution."
          width="size-5000"
        >
          Enable ID5
        </FormikCheckbox>
        <FormikCheckbox
          data-test-id="rampIdEnabledField"
          name={`${instanceFieldName}.rampIdEnabled`}
          description="Enables RampID integration for cross-device identity resolution and advertising use cases."
          width="size-5000"
        >
          Enable RampID
        </FormikCheckbox>
      </FormElementContainer>
    </>
  );
};

AdvertisingSection.propTypes = {
  instanceFieldName: PropTypes.string.isRequired,
};

export default AdvertisingSection; 