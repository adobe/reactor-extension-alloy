/*
Copyright 2023 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
*/
import spectrumWrappers from "./spectrum";

const overrideViewSelectors = {
  envTabs: {
    production: spectrumWrappers.tab("productionOverridesTab"),
    staging: spectrumWrappers.tab("stagingOverridesTab"),
    development: spectrumWrappers.tab("developmentOverridesTab")
  },
  textFields: {
    eventDatasetOverride: spectrumWrappers.textField("eventDatasetOverride"),
    idSyncContainerOverride: spectrumWrappers.textField(
      "idSyncContainerOverride"
    ),
    targetPropertyTokenOverride: spectrumWrappers.textField(
      "targetPropertyTokenOverride"
    ),
    reportSuiteOverrides: [0, 1, 2].map(index =>
      spectrumWrappers.textField(`reportSuitesOverride.${index}`)
    )
  },
  comboBoxes: {
    eventDatasetOverride: spectrumWrappers.comboBox("eventDatasetOverride"),
    idSyncContainerOverride: spectrumWrappers.comboBox(
      "idSyncContainerOverride"
    ),
    targetPropertyTokenOverride: spectrumWrappers.comboBox(
      "targetPropertyTokenOverride"
    ),
    reportSuiteOverrides: [0, 1, 2].map(index =>
      spectrumWrappers.comboBox(`reportSuitesOverride.${index}`)
    )
  },
  addReportSuiteButton: spectrumWrappers.button("addReportSuite"),
  removeReportSuitesButtons: [0, 1, 2].map(index =>
    spectrumWrappers.textField(`removeReportSuite.${index}`)
  ),
  copyButtons: {
    production: spectrumWrappers.button("copyFromProductionButton"),
    staging: spectrumWrappers.button("copyFromStagingButton"),
    development: spectrumWrappers.button("copyFromDevelopmentButton")
  },
  sandbox: spectrumWrappers.picker("sandbox"),
  datastreamInputMethod: {
    freeform: spectrumWrappers.radio(
      "datastreamOverrideInputMethodFreeformRadio"
    ),
    select: spectrumWrappers.radio("datastreamOverrideInputMethodSelectRadio")
  },
  datastreamIdDropdown: spectrumWrappers.picker("datastreamId"),
  datastreamIdFreeform: spectrumWrappers.textField("datastreamId")
};

export default overrideViewSelectors;
