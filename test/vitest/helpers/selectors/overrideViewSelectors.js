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

import spectrum from '../dom/spectrum';

const overrideViewSelectors = {
  envTabs: {
    production: spectrum.tab("productionOverridesTab"),
    staging: spectrum.tab("stagingOverridesTab"),
    development: spectrum.tab("developmentOverridesTab"),
  },
  textFields: {
    eventDatasetOverride: spectrum.textField("eventDatasetOverride"),
    idSyncContainerOverride: spectrum.textField("idSyncContainerOverride"),
    targetPropertyTokenOverride: spectrum.textField("targetPropertyTokenOverride"),
    reportSuiteOverrides: [0, 1, 2].map((index) =>
      spectrum.textField(`reportSuitesOverride.${index}`),
    ),
  },
  comboBoxes: {
    envEnabled: spectrum.comboBox("overridesEnabled"),
    analyticsEnabled: spectrum.comboBox("analyticsEnabled"),
    ajoEnabled: spectrum.comboBox("ajoEnabled"),
    audienceManagerEnabled: spectrum.comboBox("audienceManagerEnabled"),
    edgeDestinationsEnabled: spectrum.comboBox("edgeDestinationsEnabled"),
    edgeSegmentationEnabled: spectrum.comboBox("edgeSegmentationEnabled"),
    experiencePlatformEnabled: spectrum.comboBox("experiencePlatformEnabled"),
    odeEnabled: spectrum.comboBox("odeEnabled"),
    ssefEnabled: spectrum.comboBox("ssefEnabled"),
    targetEnabled: spectrum.comboBox("targetEnabled"),
    eventDatasetOverride: spectrum.comboBox("eventDatasetOverride"),
    idSyncContainerOverride: spectrum.comboBox("idSyncContainerOverride"),
    targetPropertyTokenOverride: spectrum.comboBox("targetPropertyTokenOverride"),
    reportSuiteOverrides: [0, 1, 2].map((index) =>
      spectrum.comboBox(`reportSuitesOverride.${index}`),
    ),
  },
  addReportSuiteButton: spectrum.button("addReportSuite"),
  removeReportSuitesButtons: [0, 1, 2].map((index) =>
    spectrum.textField(`removeReportSuite.${index}`),
  ),
  copyButtons: {
    production: spectrum.button("copyFromProductionButton"),
    staging: spectrum.button("copyFromStagingButton"),
    development: spectrum.button("copyFromDevelopmentButton"),
  },
  sandbox: spectrum.picker("sandbox"),
  datastreamInputMethod: {
    freeform: spectrum.radio("datastreamOverrideInputMethodFreeformRadio"),
    select: spectrum.radio("datastreamOverrideInputMethodSelectRadio"),
  },
  datastreamIdDropdown: spectrum.picker("datastreamId"),
  datastreamIdFreeform: spectrum.textField("datastreamId"),
};

export default overrideViewSelectors; 