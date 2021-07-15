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

import copyToClipboard from "clipboard-copy";
import React from "react";
import PropTypes from "prop-types";
import SectionHeader from "../components/sectionHeader";
import CodeField from "../components/codeField";
import CodePreview from "../components/codePreview";
import prehidingSnippet from "./constants/prehidingSnippet";
import copyPropertiesIfValueDifferentThanDefault from "./utils/copyPropertiesIfValueDifferentThanDefault";
import copyPropertiesWithDefaultFallback from "./utils/copyPropertiesWithDefaultFallback";
import FormElementContainer from "../components/formElementContainer";

export const bridge = {
  getInstanceDefaults: () => ({
    prehidingStyle: ""
  }),
  getInitialInstanceValues: ({ instanceSettings }) => {
    const instanceValues = {};

    copyPropertiesWithDefaultFallback({
      toObj: instanceValues,
      fromObj: instanceSettings,
      defaultsObj: bridge.getInstanceDefaults(),
      keys: ["prehidingStyle"]
    });

    return instanceValues;
  },
  getInstanceSettings: ({ instanceValues }) => {
    const instanceSettings = {};

    copyPropertiesIfValueDifferentThanDefault({
      toObj: instanceSettings,
      fromObj: instanceValues,
      defaultsObj: bridge.getInstanceDefaults(),
      keys: ["prehidingStyle"]
    });

    return instanceSettings;
  }
};

const PersonalizationSection = ({ instanceFieldName }) => {
  return (
    <>
      <SectionHeader learnMoreUrl="https://adobe.ly/3fYDkfh">
        Personalization
      </SectionHeader>
      <FormElementContainer>
        <CodeField
          data-test-id="prehidingStyleEditButton"
          label="Prehiding Style"
          name={`${instanceFieldName}.prehidingStyle`}
          description="A CSS style definition that will be used to hide content areas of your web page while personalized content is being loaded from the server."
          language="css"
          placeholder={
            "/*\nHide elements as necessary. For example:\n#container { opacity: 0 !important }\n*/"
          }
        />
        <CodePreview
          data-test-id="copyToClipboardPrehidingSnippetButton"
          value={prehidingSnippet}
          label="Prehiding Snippet"
          buttonLabel="Copy Prehiding Snippet To Clipboard"
          description="To avoid flicker from occurring while the Launch library is being loaded, place this prehiding snippet within the <head> tag of your HTML page."
          onPress={() => {
            copyToClipboard(prehidingSnippet);
          }}
        />
      </FormElementContainer>
    </>
  );
};

PersonalizationSection.propTypes = {
  instanceFieldName: PropTypes.string.isRequired
};

export default PersonalizationSection;
