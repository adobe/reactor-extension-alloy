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
import { Radio } from "@adobe/react-spectrum";
import SectionHeader from "../components/sectionHeader";
import CodeField from "../components/codeField";
import CodePreview from "../components/codePreview";
import prehidingSnippet from "./constants/prehidingSnippet";
import copyPropertiesIfValueDifferentThanDefault from "./utils/copyPropertiesIfValueDifferentThanDefault";
import copyPropertiesWithDefaultFallback from "./utils/copyPropertiesWithDefaultFallback";
import FormElementContainer from "../components/formElementContainer";
import FormikCheckbox from "../components/formikReactSpectrum3/formikCheckbox";
import BetaBadge from "../components/betaBadge";
import FormikRadioGroup from "../components/formikReactSpectrum3/formikRadioGroup";

export const bridge = {
  getInstanceDefaults: () => ({
    prehidingStyle: "",
    targetMigrationEnabled: false,
    personalizationStorageEnabled: false,
    autoCollectPropositionInteractions: "always"
  }),
  getInitialInstanceValues: ({ instanceSettings }) => {
    const instanceValues = {};

    if (instanceSettings.autoCollectPropositionInteractions?.AJO) {
      instanceSettings.autoCollectPropositionInteractions =
        instanceSettings.autoCollectPropositionInteractions.AJO;
    } else {
      delete instanceSettings.autoCollectPropositionInteractions;
    }

    copyPropertiesWithDefaultFallback({
      toObj: instanceValues,
      fromObj: instanceSettings,
      defaultsObj: bridge.getInstanceDefaults(),
      keys: [
        "prehidingStyle",
        "targetMigrationEnabled",
        "personalizationStorageEnabled",
        "autoCollectPropositionInteractions"
      ]
    });

    return instanceValues;
  },
  getInstanceSettings: ({ instanceValues }) => {
    const instanceSettings = {};

    copyPropertiesIfValueDifferentThanDefault({
      toObj: instanceSettings,
      fromObj: instanceValues,
      defaultsObj: bridge.getInstanceDefaults(),
      keys: [
        "prehidingStyle",
        "targetMigrationEnabled",
        "personalizationStorageEnabled",
        "autoCollectPropositionInteractions"
      ]
    });

    if (instanceSettings.autoCollectPropositionInteractions) {
      instanceSettings.autoCollectPropositionInteractions = {
        AJO: instanceValues.autoCollectPropositionInteractions
      };
    }

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
        <FormikCheckbox
          data-test-id="targetMigrationEnabledField"
          name={`${instanceFieldName}.targetMigrationEnabled`}
          description="Use this option to enable the Web SDK to read and write the legacy
          mbox and mboxEdgeCluster cookies that are used by at.js 1.x or 2.x libraries. This helps you keep the visitor profile while moving from a page that uses the Web SDK to a page that uses the at.js 1.x or 2.x libraries and vice-versa."
          width="size-5000"
        >
          Migrate Target from at.js to the Web SDK
        </FormikCheckbox>
        <CodeField
          data-test-id="prehidingStyleEditButton"
          label="Prehiding style"
          buttonLabelSuffix="prehiding style"
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
          label="Prehiding snippet"
          buttonLabel="Copy prehiding snippet to clipboard"
          description="To avoid flicker from occurring while the Launch library is being loaded, place this prehiding snippet within the <head> tag of your HTML page."
          onPress={() => {
            copyToClipboard(prehidingSnippet);
          }}
        />
        <FormikCheckbox
          data-test-id="personalizationStorageEnabledField"
          name={`${instanceFieldName}.personalizationStorageEnabled`}
          description="Use this option to store personalization events in the browser's local storage. This allows the Web SDK to keep track of which experiences have been seen by the user across page loads."
          width="size-5000"
        >
          Enable personalization storage <BetaBadge />
        </FormikCheckbox>
        <FormikRadioGroup
          name={`${instanceFieldName}.autoCollectPropositionInteractions`}
          label="Automatically collect proposition interactions for Adobe Journey Optimizer"
          description="This controls whether the Web SDK automatically tracks interactions with propositions from Adobe Journey Optimizer."
          width="size-5000"
        >
          <Radio value="always" data-test-id="alwaysOption">
            Always - Collect all interactions with propositions.
          </Radio>
          <Radio
            value="decoratedElementsOnly"
            data-test-id="decoratedElementsOnlyOption"
          >
            Decorated elements only - Only collect interactions on elements with
            data-aep-click-label or data-aep-click-token attributes.
          </Radio>
          <Radio value="never" data-test-id="neverOption">
            Never - Do not collect interactions with propositions.
          </Radio>
        </FormikRadioGroup>
      </FormElementContainer>
    </>
  );
};

PersonalizationSection.propTypes = {
  instanceFieldName: PropTypes.string.isRequired
};

export default PersonalizationSection;
