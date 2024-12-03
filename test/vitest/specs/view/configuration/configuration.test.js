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

import { describe, test, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import extensionViewController from '../../../helpers/view/extensionViewController';
import runCommonExtensionViewTests from '../../../helpers/view/runCommonExtensionViewTests';
import * as sandboxesMocks from '../../../helpers/endpointMocks/sandboxesMocks';
import * as datastreamsMocks from '../../../helpers/endpointMocks/datastreamsMocks';
import * as datastreamMocks from '../../../helpers/endpointMocks/datastreamMocks';
import { instances } from '../../../helpers/dom/spectrum';

const user = userEvent.setup();

const defaultEdgeDomain = 'edge.adobedc.net';
const defaultEdgeBasePath = 'ee';
const defaultDownloadLinkQualifier = '\\.(?:doc|docx|eps|jpg|png|svg|xls|ppt|pptx|pdf|xlsx|tab|csv|zip|txt|vsd|vxd|xml|js|css|rar|exe|wma|mov|avi|wmv|mp3|wav|m4v)($|\\&)';

describe('Extension Configuration View', () => {
  // Run common extension view tests
  runCommonExtensionViewTests();

  beforeEach(() => {
    // Reset mocks before each test
    sandboxesMocks.reset();
    datastreamsMocks.reset();
    datastreamMocks.reset();
  });

  test('initializes with default settings', async () => {
    await extensionViewController.init();

    // Check instance name
    await instances[0].nameField.expectValue('alloy1');
    
    // Check edge config
    await instances[0].edgeConfig.inputMethodSelectRadio.expectUnchecked();
    await instances[0].edgeConfig.inputMethodFreeformRadio.expectChecked();
    await instances[0].edgeConfig.inputMethodFreeform.productionEnvironmentField.expectValue('PR123');
    await instances[0].edgeConfig.inputMethodFreeform.stagingEnvironmentField.expectValue('PR123:stage');
    await instances[0].edgeConfig.inputMethodFreeform.developmentEnvironmentField.expectValue('PR123:dev1');

    // Check org ID and edge settings
    await instances[0].orgIdField.expectValue('ORG456@OtherCompanyOrg');
    await instances[0].edgeDomainField.expectValue('testedge.com');
    await instances[0].edgeBasePathField.expectValue('ee-beta');

    // Check consent settings
    await instances[0].defaultConsent.inRadio.expectUnchecked();
    await instances[0].defaultConsent.outRadio.expectUnchecked();
    await instances[0].defaultConsent.pendingRadio.expectChecked();
    await instances[0].defaultConsent.dataElementRadio.expectUnchecked();
    await instances[0].defaultConsent.dataElementField.expectNotExists();

    // Check feature flags
    await instances[0].idMigrationEnabled.expectChecked();
    await instances[0].thirdPartyCookiesEnabled.expectChecked();
    await instances[0].internalLinkEnabledField.expectUnchecked();
    await instances[0].externalLinkEnabledField.expectUnchecked();
    await instances[0].downloadLinkEnabledField.expectUnchecked();

    // Check context settings
    await instances[0].contextGranularity.specificField.expectChecked();
    await instances[0].specificContext.webField.expectUnchecked();
    await instances[0].specificContext.deviceField.expectChecked();
    await instances[0].specificContext.environmentField.expectUnchecked();
    await instances[0].specificContext.placeContextField.expectChecked();
    await instances[0].specificContext.highEntropyUserAgentHintsContextField.expectUnchecked();

    // Check overrides
    await instances[0].overrides.envTabs.development.expectExists();
    await instances[0].overrides.envTabs.development.expectSelected();
    await instances[0].overrides.copyButtons.development.expectNotExists();
    await instances[0].overrides.copyButtons.staging.expectExists();
    await instances[0].overrides.copyButtons.production.expectExists();

    // Configure development environment overrides
    await instances[0].overrides.comboBoxes.envEnabled.clear();
    await instances[0].overrides.comboBoxes.envEnabled.enterSearch('Enabled');
    await instances[0].overrides.textFields.eventDatasetOverride.typeText('6336ff95ba16ca1c07b4c0db');
    await instances[0].overrides.textFields.idSyncContainerOverride.typeText('23512312');
    await instances[0].overrides.textFields.targetPropertyTokenOverride.typeText('01dbc634-07c1-d8f9-ca69-b489a5ac5e94');
    await instances[0].overrides.textFields.reportSuiteOverrides[0].typeText('unifiedjsqeonly2');
    await instances[0].overrides.addReportSuiteButton.click();
    await instances[0].overrides.textFields.reportSuiteOverrides[1].typeText('unifiedjsqeonly3');

    // Check staging environment overrides
    await instances[0].overrides.envTabs.staging.click();
    await instances[0].overrides.envTabs.staging.expectSelected();
    await instances[0].overrides.copyButtons.production.expectExists();
    await instances[0].overrides.copyButtons.staging.expectNotExists();
    await instances[0].overrides.copyButtons.development.expectExists();
    await instances[0].overrides.copyButtons.development.click();

    await instances[0].overrides.comboBoxes.envEnabled.expectText('Enabled');
    await instances[0].overrides.textFields.eventDatasetOverride.expectValue('6336ff95ba16ca1c07b4c0db');
    await instances[0].overrides.textFields.idSyncContainerOverride.expectValue('23512312');
    await instances[0].overrides.textFields.targetPropertyTokenOverride.expectValue('01dbc634-07c1-d8f9-ca69-b489a5ac5e94');
    await instances[0].overrides.textFields.reportSuiteOverrides[0].expectValue('unifiedjsqeonly2');
    await instances[0].overrides.textFields.reportSuiteOverrides[1].expectValue('unifiedjsqeonly3');

    // Check production environment overrides
    await instances[0].overrides.envTabs.production.click();
    await instances[0].overrides.envTabs.production.expectSelected();
    await instances[0].overrides.copyButtons.development.expectExists();
    await instances[0].overrides.copyButtons.staging.expectExists();
    await instances[0].overrides.copyButtons.production.expectNotExists();
    await instances[0].overrides.copyButtons.staging.click();

    await instances[0].overrides.comboBoxes.envEnabled.expectText('Enabled');
    await instances[0].overrides.textFields.eventDatasetOverride.expectValue('6336ff95ba16ca1c07b4c0db');
    await instances[0].overrides.textFields.idSyncContainerOverride.expectValue('23512312');
    await instances[0].overrides.textFields.targetPropertyTokenOverride.expectValue('01dbc634-07c1-d8f9-ca69-b489a5ac5e94');
    await instances[0].overrides.textFields.reportSuiteOverrides[0].expectValue('unifiedjsqeonly2');
    await instances[0].overrides.textFields.reportSuiteOverrides[1].expectValue('unifiedjsqeonly3');
  });

  test('shows error for empty default consent data element', async () => {
    await extensionViewController.init();
    await instances[0].defaultConsent.dataElementRadio.click();
    await extensionViewController.expectIsNotValid();
    await instances[0].defaultConsent.dataElementField.expectError();
  });

  test('shows error for empty download link qualifier', async () => {
    await extensionViewController.init();
    await instances[0].downloadLinkQualifierField.click();
    await instances[0].downloadLinkQualifierField.clear();
    await extensionViewController.expectIsNotValid();
    await instances[0].downloadLinkQualifierField.expectError();
  });

  test('shows error for invalid download link qualifier', async () => {
    await extensionViewController.init();
    await instances[0].downloadLinkQualifierField.click();
    await instances[0].downloadLinkQualifierField.clear();
    await instances[0].downloadLinkQualifierField.typeText('[');
    await extensionViewController.expectIsNotValid();
    await instances[0].downloadLinkQualifierField.expectError();
  });

  test('copies overrides between environments', async () => {
    await extensionViewController.init();

    // Configure development environment overrides
    await instances[0].overrides.envTabs.development.click();
    await instances[0].overrides.comboBoxes.envEnabled.clear();
    await instances[0].overrides.comboBoxes.envEnabled.enterSearch('Enabled');
    await instances[0].overrides.comboBoxes.experiencePlatformEnabled.clear();
    await instances[0].overrides.comboBoxes.experiencePlatformEnabled.enterSearch('Enabled');
    await instances[0].overrides.textFields.eventDatasetOverride.typeText('6336ff95ba16ca1c07b4c0db');
    await instances[0].overrides.comboBoxes.edgeSegmentationEnabled.clear();
    await instances[0].overrides.comboBoxes.edgeSegmentationEnabled.enterSearch('Enabled');
    await instances[0].overrides.comboBoxes.edgeDestinationsEnabled.clear();
    await instances[0].overrides.comboBoxes.edgeDestinationsEnabled.enterSearch('Enabled');
    await instances[0].overrides.comboBoxes.ajoEnabled.clear();
    await instances[0].overrides.comboBoxes.ajoEnabled.enterSearch('Enabled');
    await instances[0].overrides.comboBoxes.ssefEnabled.clear();
    await instances[0].overrides.comboBoxes.ssefEnabled.enterSearch('Enabled');
    await instances[0].overrides.comboBoxes.audienceManagerEnabled.clear();
    await instances[0].overrides.comboBoxes.audienceManagerEnabled.enterSearch('Enabled');
    await instances[0].overrides.textFields.idSyncContainerOverride.typeText('23512312');
    await instances[0].overrides.comboBoxes.targetEnabled.clear();
    await instances[0].overrides.comboBoxes.targetEnabled.enterSearch('Enabled');
    await instances[0].overrides.textFields.targetPropertyTokenOverride.typeText('01dbc634-07c1-d8f9-ca69-b489a5ac5e94');
    await instances[0].overrides.comboBoxes.analyticsEnabled.clear();
    await instances[0].overrides.comboBoxes.analyticsEnabled.enterSearch('Enabled');
    await instances[0].overrides.textFields.reportSuiteOverrides[0].typeText('unifiedjsqeonly2');

    // Copy development to staging
    await instances[0].overrides.envTabs.staging.click();
    await instances[0].overrides.copyButtons.development.click();

    // Verify staging environment overrides
    await instances[0].overrides.comboBoxes.envEnabled.expectValue('Enabled');
    await instances[0].overrides.comboBoxes.experiencePlatformEnabled.expectValue('Enabled');
    await instances[0].overrides.textFields.eventDatasetOverride.expectValue('6336ff95ba16ca1c07b4c0db');
    await instances[0].overrides.comboBoxes.edgeSegmentationEnabled.expectValue('Enabled');
    await instances[0].overrides.comboBoxes.edgeDestinationsEnabled.expectValue('Enabled');
    await instances[0].overrides.comboBoxes.ajoEnabled.expectValue('Enabled');
    await instances[0].overrides.comboBoxes.ssefEnabled.expectValue('Enabled');
    await instances[0].overrides.comboBoxes.audienceManagerEnabled.expectValue('Enabled');
    await instances[0].overrides.textFields.idSyncContainerOverride.expectValue('23512312');
    await instances[0].overrides.comboBoxes.targetEnabled.expectValue('Enabled');
    await instances[0].overrides.textFields.targetPropertyTokenOverride.expectValue('01dbc634-07c1-d8f9-ca69-b489a5ac5e94');
    await instances[0].overrides.comboBoxes.analyticsEnabled.expectValue('Enabled');
    await instances[0].overrides.textFields.reportSuiteOverrides[0].expectValue('unifiedjsqeonly2');

    // Copy staging to production
    await instances[0].overrides.envTabs.production.click();
    await instances[0].overrides.copyButtons.staging.click();

    // Verify production environment overrides
    await instances[0].overrides.comboBoxes.envEnabled.expectValue('Enabled');
    await instances[0].overrides.comboBoxes.experiencePlatformEnabled.expectValue('Enabled');
    await instances[0].overrides.textFields.eventDatasetOverride.expectValue('6336ff95ba16ca1c07b4c0db');
    await instances[0].overrides.comboBoxes.edgeSegmentationEnabled.expectValue('Enabled');
    await instances[0].overrides.comboBoxes.edgeDestinationsEnabled.expectValue('Enabled');
    await instances[0].overrides.comboBoxes.ajoEnabled.expectValue('Enabled');
    await instances[0].overrides.comboBoxes.ssefEnabled.expectValue('Enabled');
    await instances[0].overrides.comboBoxes.audienceManagerEnabled.expectValue('Enabled');
    await instances[0].overrides.textFields.idSyncContainerOverride.expectValue('23512312');
    await instances[0].overrides.comboBoxes.targetEnabled.expectValue('Enabled');
    await instances[0].overrides.textFields.targetPropertyTokenOverride.expectValue('01dbc634-07c1-d8f9-ca69-b489a5ac5e94');
    await instances[0].overrides.comboBoxes.analyticsEnabled.expectValue('Enabled');
    await instances[0].overrides.textFields.reportSuiteOverrides[0].expectValue('unifiedjsqeonly2');
  });

  test('initializes with sandbox selection', async () => {
    sandboxesMocks.single();
    datastreamsMocks.empty();

    await extensionViewController.init();

    await instances[0].nameField.expectValue('alloy');
    await instances[0].edgeConfig.inputMethodSelectRadio.expectChecked();
    await instances[0].edgeConfig.inputMethodFreeformRadio.expectUnchecked();
    await instances[0].edgeConfig.inputMethodSelect.production.sandboxField.expectSelectedOptionLabel('Test Sandbox 1');
    await instances[0].edgeConfig.inputMethodSelect.production.sandboxField.expectDisabled();
    await instances[0].edgeConfig.inputMethodSelect.production.datastreamField.expectSelectedOptionLabel('Select a datastream');
    await instances[0].edgeConfig.inputMethodSelect.staging.sandboxField.expectHidden();
    await instances[0].edgeConfig.inputMethodSelect.staging.datastreamField.expectSelectedOptionLabel('Select a datastream');
    await instances[0].edgeConfig.inputMethodSelect.development.sandboxField.expectHidden();
    await instances[0].edgeConfig.inputMethodSelect.development.datastreamField.expectSelectedOptionLabel('Select a datastream');
    await instances[0].orgIdField.expectValue('5BFE274A5F6980A50A495C08@AdobeOrg');
    await instances[0].edgeDomainField.expectValue(defaultEdgeDomain);
    await instances[0].edgeBasePathField.expectValue(defaultEdgeBasePath);
    await instances[0].defaultConsent.inRadio.expectChecked();
    await instances[0].defaultConsent.outRadio.expectUnchecked();
    await instances[0].defaultConsent.pendingRadio.expectUnchecked();
    await instances[0].defaultConsent.dataElementRadio.expectUnchecked();
    await instances[0].defaultConsent.dataElementField.expectNotExists();
    await instances[0].idMigrationEnabled.expectChecked();
    await instances[0].targetMigrationEnabled.expectUnchecked();
    await instances[0].thirdPartyCookiesEnabled.expectChecked();
    await instances[0].internalLinkEnabledField.expectChecked();
    await instances[0].eventGrouping.noneField.expectChecked();
    await instances[0].externalLinkEnabledField.expectChecked();
    await instances[0].downloadLinkEnabledField.expectChecked();
    await instances[0].downloadLinkQualifierField.expectValue(defaultDownloadLinkQualifier);
    await instances[0].contextGranularity.allField.expectChecked();
  });

  test('initializes with datastream selection', async () => {
    sandboxesMocks.single();
    datastreamsMocks.single();
    datastreamMocks.basic();

    await extensionViewController.init();

    await instances[0].nameField.expectValue('alloy');
    await instances[0].edgeConfig.inputMethodSelectRadio.expectChecked();
    await instances[0].edgeConfig.inputMethodFreeformRadio.expectUnchecked();
    await instances[0].edgeConfig.inputMethodSelect.development.datastreamField.selectOption('Test Config Overrides');
    await instances[0].edgeConfig.inputMethodSelect.production.sandboxField.expectDisabled();
    await instances[0].edgeConfig.inputMethodSelect.production.datastreamField.expectExists();
    await instances[0].overrides.comboBoxes.envEnabled.clear();
    await instances[0].overrides.comboBoxes.envEnabled.enterSearch('Enabled');
    await instances[0].overrides.comboBoxes.eventDatasetOverride.expectExists();
    await instances[0].overrides.comboBoxes.eventDatasetOverride.expectIsComboBox();
    await instances[0].overrides.comboBoxes.idSyncContainerOverride.expectExists();
    await instances[0].overrides.comboBoxes.idSyncContainerOverride.expectIsComboBox();
    await instances[0].overrides.comboBoxes.targetPropertyTokenOverride.expectExists();
    await instances[0].overrides.comboBoxes.targetPropertyTokenOverride.expectIsComboBox();
    await instances[0].overrides.comboBoxes.reportSuiteOverrides[0].expectExists();
    await instances[0].overrides.comboBoxes.reportSuiteOverrides[0].expectIsComboBox();
  });
}); 