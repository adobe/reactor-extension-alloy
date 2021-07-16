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
import PropTypes from "prop-types";
import SectionHeader from "../components/sectionHeader";
import FormikCheckbox from "../components/formikReactSpectrum3/formikCheckbox";
import copyPropertiesIfValueDifferentThanDefault from "./utils/copyPropertiesIfValueDifferentThanDefault";
import copyPropertiesWithDefaultFallback from "./utils/copyPropertiesWithDefaultFallback";
import FormElementContainer from "../components/formElementContainer";

export const bridge = {
  getInstanceDefaults: () => ({
    idMigrationEnabled: true,
    thirdPartyCookiesEnabled: true
  }),
  getInitialInstanceValues: ({ instanceSettings }) => {
    const instanceValues = {};

    copyPropertiesWithDefaultFallback({
      toObj: instanceValues,
      fromObj: instanceSettings,
      defaultsObj: bridge.getInstanceDefaults(),
      keys: ["idMigrationEnabled", "thirdPartyCookiesEnabled"]
    });

    return instanceValues;
  },
  getInstanceSettings: ({ instanceValues }) => {
    const instanceSettings = {};

    copyPropertiesIfValueDifferentThanDefault({
      toObj: instanceSettings,
      fromObj: instanceValues,
      defaultsObj: bridge.getInstanceDefaults(),
      keys: ["idMigrationEnabled", "thirdPartyCookiesEnabled"]
    });

    return instanceSettings;
  }
};

const IdentitySection = ({ instanceFieldName }) => {
  return (
    <>
      <SectionHeader learnMoreUrl="https://adobe.ly/39ouRzA">
        Identity
      </SectionHeader>
      <FormElementContainer>
        <FormikCheckbox
          data-test-id="idMigrationEnabledField"
          name={`${instanceFieldName}.idMigrationEnabled`}
          description="Enables the web SDK to preserve existing ECIDs by reading and writing the AMCV cookie. If your website was or is still using VisitorAPI, enable this option until users are fully migrated to the web SDK's identity cookie. This will prevent visitor cliffing."
          width="size-5000"
        >
          Migrate ECID from VisitorAPI to the web SDK
        </FormikCheckbox>
        <FormikCheckbox
          data-test-id="thirdPartyCookiesEnabledField"
          name={`${instanceFieldName}.thirdPartyCookiesEnabled`}
          description="Enables the setting of Adobe third-party cookies. The SDK has the ability to persist the visitor ID in a third-party context to enable the same visitor ID to be used across site. This is useful if you have multiple sites or you want to share data with partners; however, sometimes this is not desired for privacy reasons."
          width="size-5000"
        >
          Use third-party cookies
        </FormikCheckbox>
      </FormElementContainer>
    </>
  );
};

IdentitySection.propTypes = {
  instanceFieldName: PropTypes.string.isRequired
};

export default IdentitySection;
