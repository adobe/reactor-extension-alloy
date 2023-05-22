import spectrumWrappers from "./spectrum";

const overrides = {
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
  copyDestinationCheckboxes: {
    production: spectrumWrappers.textField("copyOverrides.production"),
    staging: spectrumWrappers.textField("copyOverrides.staging"),
    development: spectrumWrappers.textField("copyOverrides.development")
  },
  copyButton: spectrumWrappers.button("copyOverrides")
};

export default overrides;
