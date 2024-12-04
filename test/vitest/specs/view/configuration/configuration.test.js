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

/* eslint-disable react/prop-types */
/* eslint-disable react/jsx-filename-extension */
/* eslint-disable react/button-has-type */
/* eslint-disable react/void-dom-elements-no-children */
/* eslint-disable no-shadow */
/* eslint-disable no-unused-vars */

import { describe, test, beforeEach, vi } from "vitest";
import { render as rtlRender } from "@testing-library/react";
import React from "react";
import { Provider, lightTheme } from "@adobe/react-spectrum";
import extensionViewController from "../../../helpers/view/extensionViewController";
import runCommonExtensionViewTests from "../../../helpers/view/runCommonExtensionViewTests";
import * as sandboxesMocks from "../../../helpers/endpointMocks/sandboxesMocks";
import * as datastreamsMocks from "../../../helpers/endpointMocks/datastreamsMocks";
import * as datastreamMocks from "../../../helpers/endpointMocks/datastreamMocks";
import spectrum from "../../../helpers/dom/spectrum";
import { server } from "../../../helpers/endpointMocks/setup";
import ConfigurationExtensionView from "../../../../../src/view/configuration/configuration";

// Mock FIELD_NAMES constant
vi.mock("../../../../../src/view/components/overrides/utils", () => ({
  FIELD_NAMES: {
    datastreamId: "datastreamId",
    enabled: "enabled",
    analyticsEnabled: "analyticsEnabled",
    ajoEnabled: "ajoEnabled",
    audienceManagerEnabled: "audienceManagerEnabled",
    edgeDestinationsEnabled: "edgeDestinationsEnabled",
    edgeSegmentationEnabled: "edgeSegmentationEnabled",
    experiencePlatformEnabled: "experiencePlatformEnabled",
    odeEnabled: "odeEnabled",
    ssefEnabled: "ssefEnabled",
    targetEnabled: "targetEnabled",
    eventDatasetOverride: "eventDatasetOverride",
    idSyncContainerOverride: "idSyncContainerOverride",
    targetPropertyTokenOverride: "targetPropertyTokenOverride",
    reportSuiteOverrides: "reportSuiteOverrides",
  },
}));

// Mock ExtensionView component
vi.mock("../../../../../src/view/components/extensionView", () => ({
  default: ({ render }) => {
    const [initInfo, setInitInfo] = React.useState(null);

    React.useEffect(() => {
      const init = async () => {
        const info = await window.initializeExtensionViewPromise;
        setInitInfo(info);
      };
      init();
    }, []);

    if (!initInfo) {
      return null;
    }

    return render({ initInfo });
  },
}));

// Mock Heading component
vi.mock("../../../../../src/view/components/typography/heading", () => ({
  default: ({ children }) => <h1>{children}</h1>,
}));

// Mock section bridges
vi.mock("../../../../../src/view/configuration/basicSection", () => ({
  bridge: {
    getInstanceDefaults: vi.fn(() => ({
      name: "alloy1",
    })),
    getInstanceSettings: vi.fn((values) => ({
      name: values.name,
    })),
    getInitialInstanceValues: vi.fn(),
    instanceValidationSchema: {},
  },
  default: ({ children }) => <div>{children}</div>,
}));

vi.mock(
  "../../../../../src/view/configuration/edgeConfigurationsSection",
  () => ({
    bridge: {
      getInstanceDefaults: vi.fn(() => ({
        edgeConfigId: "PR123",
        stagingEdgeConfigId: "PR123:stage",
        developmentEdgeConfigId: "PR123:dev1",
        orgId: "ORG456@OtherCompanyOrg",
        edgeDomain: "testedge.com",
        edgeBasePath: "ee-beta",
      })),
      getInstanceSettings: vi.fn((values) => ({
        edgeConfigId: values.edgeConfigId,
        stagingEdgeConfigId: values.stagingEdgeConfigId,
        developmentEdgeConfigId: values.developmentEdgeConfigId,
        orgId: values.orgId,
        edgeDomain: values.edgeDomain,
        edgeBasePath: values.edgeBasePath,
      })),
      getInitialInstanceValues: vi.fn(),
      instanceValidationSchema: {},
    },
    default: ({ children }) => <div>{children}</div>,
  }),
);

vi.mock("../../../../../src/view/configuration/privacySection", () => ({
  bridge: {
    getInstanceDefaults: vi.fn(() => ({
      defaultConsent: "pending",
    })),
    getInstanceSettings: vi.fn((values) => ({
      defaultConsent: values.defaultConsent,
    })),
    getInitialInstanceValues: vi.fn(),
    instanceValidationSchema: {},
  },
  default: ({ children }) => <div>{children}</div>,
}));

vi.mock("../../../../../src/view/configuration/identitySection", () => ({
  bridge: {
    getInstanceDefaults: vi.fn(() => ({
      idMigrationEnabled: true,
      thirdPartyCookiesEnabled: true,
    })),
    getInstanceSettings: vi.fn((values) => ({
      idMigrationEnabled: values.idMigrationEnabled,
      thirdPartyCookiesEnabled: values.thirdPartyCookiesEnabled,
    })),
    getInitialInstanceValues: vi.fn(),
    instanceValidationSchema: {},
  },
  default: ({ children }) => <div>{children}</div>,
}));

vi.mock("../../../../../src/view/configuration/personalizationSection", () => ({
  bridge: {
    getInstanceDefaults: vi.fn(() => ({
      prehidingStyle: "",
      targetMigrationEnabled: false,
      autoCollectPropositionInteractions: {
        AJO: "decoratedElementsOnly",
        TGT: "always",
      },
    })),
    getInstanceSettings: vi.fn((values) => ({
      prehidingStyle: values.prehidingStyle,
      targetMigrationEnabled: values.targetMigrationEnabled,
      autoCollectPropositionInteractions:
        values.autoCollectPropositionInteractions,
    })),
    getInitialInstanceValues: vi.fn(),
    instanceValidationSchema: {},
  },
  default: ({ children }) => <div>{children}</div>,
}));

vi.mock("../../../../../src/view/configuration/dataCollectionSection", () => ({
  bridge: {
    getInstanceDefaults: vi.fn(() => ({
      clickCollectionEnabled: false,
      downloadLinkQualifier: "",
      onBeforeEventSend: "",
    })),
    getInstanceSettings: vi.fn((values) => ({
      clickCollectionEnabled: values.clickCollectionEnabled,
      downloadLinkQualifier: values.downloadLinkQualifier,
      onBeforeEventSend: values.onBeforeEventSend,
    })),
    getInitialInstanceValues: vi.fn(),
    instanceValidationSchema: {},
  },
  default: ({ children }) => <div>{children}</div>,
}));

vi.mock("../../../../../src/view/components/overrides", () => ({
  bridge: {
    getInstanceDefaults: vi.fn(() => ({
      edgeConfigOverrides: {
        development: {},
        staging: {},
        production: {},
      },
    })),
    getInstanceSettings: vi.fn((values) => ({
      edgeConfigOverrides: values.edgeConfigOverrides,
    })),
    getInitialInstanceValues: vi.fn(),
    instanceValidationSchema: {},
  },
  default: ({ children }) => <div>{children}</div>,
}));

vi.mock("../../../../../src/view/configuration/advancedSection", () => ({
  bridge: {
    getInstanceDefaults: vi.fn(() => ({
      context: ["device", "placeContext"],
    })),
    getInstanceSettings: vi.fn((values) => ({
      context: values.context,
    })),
    getInitialInstanceValues: vi.fn(),
    instanceValidationSchema: {},
  },
  default: ({ children }) => <div>{children}</div>,
}));

vi.mock("../../../../../src/view/configuration/streamingMediaSection", () => ({
  bridge: {
    getInstanceDefaults: vi.fn(() => ({
      media: {
        trackingServer: "",
        channel: "",
        playerName: "",
        appVersion: "",
      },
    })),
    getInstanceSettings: vi.fn((values) => ({
      media: values.media,
    })),
    getInitialInstanceValues: vi.fn(),
    instanceValidationSchema: {},
  },
  default: ({ children }) => <div>{children}</div>,
}));

// Mock render function
vi.mock("../../../../../src/view/render", () => ({
  default: (Component) => Component,
}));

// Mock useNewlyValidatedFormSubmission hook
vi.mock(
  "../../../../../src/view/utils/useNewlyValidatedFormSubmission",
  () => ({
    default: () => ({
      getInstanceDefaults: vi.fn(),
      getInstanceSettings: vi.fn(),
      getInitialValues: vi.fn(),
      getSettings: vi.fn(),
    }),
  }),
);

// Mock getEdgeConfigIds
vi.mock("../../../../../src/view/utils/getEdgeConfigIds", () => ({
  default: vi.fn(() => ({})),
}));

// Mock Formik
vi.mock("formik", () => ({
  useFormik: vi.fn(() => ({
    values: {},
    errors: {},
    touched: {},
    handleSubmit: vi.fn(),
    handleChange: vi.fn(),
    handleBlur: vi.fn(),
    setFieldValue: vi.fn(),
    setFieldTouched: vi.fn(),
    validateForm: vi.fn(),
    submitForm: vi.fn(),
    setSubmitting: vi.fn(),
    resetForm: vi.fn(),
  })),
  FormikProvider: ({ children }) => children,
  useField: vi.fn(() => [{}, {}]),
  FieldArray: ({ children, render }) =>
    render
      ? render({
          push: vi.fn(),
          remove: vi.fn(),
          move: vi.fn(),
        })
      : children,
}));

// Mock Yup
vi.mock("yup", () => ({
  object: vi.fn(() => ({
    shape: vi.fn(),
    concat: vi.fn(),
  })),
  array: vi.fn(() => ({
    of: vi.fn(),
  })),
  string: vi.fn(),
}));

// Mock React Spectrum components
vi.mock("@adobe/react-spectrum", async () => {
  const actual = await vi.importActual("@adobe/react-spectrum");
  return {
    ...actual,
    Provider: ({ children }) => children,
    Button: ({ children, "data-test-id": testId, onPress }) => (
      <button data-test-id={testId} onClick={onPress}>
        {children}
      </button>
    ),
    Radio: ({ children, "data-test-id": testId, isSelected, onChange }) => (
      <input
        type="radio"
        data-test-id={testId}
        checked={isSelected}
        onChange={onChange}
      >
        {children}
      </input>
    ),
    Checkbox: ({ children, "data-test-id": testId, isSelected, onChange }) => (
      <input
        type="checkbox"
        data-test-id={testId}
        checked={isSelected}
        onChange={onChange}
      >
        {children}
      </input>
    ),
    Picker: ({
      children,
      "data-test-id": testId,
      selectedKey,
      onSelectionChange,
    }) => (
      <select
        data-test-id={testId}
        value={selectedKey}
        onChange={(e) => onSelectionChange(e.target.value)}
      >
        {children}
      </select>
    ),
    Item: ({ children, key }) => (
      <option key={key} value={key}>
        {children}
      </option>
    ),
    TabList: ({ children }) => <div role="tablist">{children}</div>,
    TabPanels: ({ children }) => <div>{children}</div>,
    Tabs: ({ children }) => <div>{children}</div>,
    View: ({ children }) => <div>{children}</div>,
    Flex: ({ children }) => <div>{children}</div>,
    Content: ({ children }) => <div>{children}</div>,
    Dialog: ({ children }) => <div role="dialog">{children}</div>,
    DialogTrigger: ({ children }) => <div>{children}</div>,
    Divider: () => <hr />,
    Text: ({ children }) => <span>{children}</span>,
    Heading: ({ children }) => <h2>{children}</h2>,
    ActionButton: ({ children, "data-test-id": testId, onPress }) => (
      <button data-test-id={testId} onClick={onPress}>
        {children}
      </button>
    ),
    TooltipTrigger: ({ children }) => <div>{children}</div>,
    Tooltip: ({ children }) => <div role="tooltip">{children}</div>,
    InlineAlert: ({ children }) => <div role="alert">{children}</div>,
  };
});

// Mock Spectrum icons
vi.mock("@spectrum-icons/workflow/Delete", () => ({
  default: () => <span>Delete</span>,
}));

vi.mock("@spectrum-icons/workflow/Copy", () => ({
  default: () => <span>Copy</span>,
}));

// Mock fetchConfigs and fetchConfig functions
vi.mock("../../../../../src/view/configuration/utils/fetchConfigs", () => ({
  default: vi.fn(() => Promise.resolve([])),
}));

vi.mock("../../../../../src/view/configuration/utils/fetchConfig", () => ({
  default: vi.fn(() => Promise.resolve({})),
}));

const defaultEdgeDomain = "edge.adobedc.net";
const defaultEdgeBasePath = "ee";

// Mock getInstanceDefaults and getInstanceSettings functions
const getInstanceDefaults = vi.fn(() => ({
  name: "alloy1",
  edgeConfigId: "PR123",
  stagingEdgeConfigId: "PR123:stage",
  developmentEdgeConfigId: "PR123:dev1",
  orgId: "ORG456@OtherCompanyOrg",
  edgeDomain: "testedge.com",
  edgeBasePath: "ee-beta",
  defaultConsent: "pending",
  idMigrationEnabled: true,
  thirdPartyCookiesEnabled: true,
  context: ["device", "placeContext"],
}));

const getInstanceSettings = vi.fn(() => ({
  name: "alloy1",
  edgeConfigId: "PR123",
  stagingEdgeConfigId: "PR123:stage",
  developmentEdgeConfigId: "PR123:dev1",
  orgId: "ORG456@OtherCompanyOrg",
  edgeDomain: "testedge.com",
  edgeBasePath: "ee-beta",
  defaultConsent: "pending",
  idMigrationEnabled: true,
  thirdPartyCookiesEnabled: true,
  context: ["device", "placeContext"],
}));

// Mock useNewlyValidatedFormSubmission hook
vi.mock(
  "../../../../../src/view/utils/useNewlyValidatedFormSubmission",
  () => ({
    default: () => ({
      getInstanceDefaults,
      getInstanceSettings,
      getInitialValues: vi.fn(() => ({
        instances: [getInstanceDefaults()],
      })),
      getSettings: vi.fn(() => ({
        instances: [getInstanceSettings()],
      })),
    }),
  }),
);
describe("Extension Configuration View", () => {
  beforeEach(() => {
    server.resetHandlers();
    // Reset the document body
    document.body.innerHTML = '<div id="root"></div>';

    // Mock window.extensionBridge
    window.extensionBridge = {
      register: vi.fn(),
      init: vi.fn(),
      getSettings: vi.fn(),
      validate: vi.fn(),
    };

    // Mock window.initializeExtensionView
    window.initializeExtensionView = vi
      .fn()
      .mockImplementation(({ initInfo }) => {
        return Promise.resolve({
          init: vi.fn().mockResolvedValue(initInfo),
          validate: vi.fn().mockResolvedValue(true),
          getSettings: vi.fn().mockResolvedValue(initInfo.settings),
        });
      });

    // Initialize extension view promise
    window.initializeExtensionViewPromise = window.initializeExtensionView({
      initInfo: {
        settings: null,
        extensionSettings: {},
        company: {
          orgId: "TEST123@AdobeOrg",
        },
        tokens: { imsAccess: "test-token" },
      },
    });

    // Render the configuration view component using React.createElement
    rtlRender(
      React.createElement(
        Provider,
        { theme: lightTheme, colorScheme: "light" },
        React.createElement(ConfigurationExtensionView),
      ),
      { container: document.getElementById("root") },
    );
  });

  runCommonExtensionViewTests();

  test("initializes with default settings", async () => {
    await extensionViewController.init();

    // Check instance name
    await spectrum[0].nameField.expectValue("alloy1");

    // Check edge config
    await spectrum[0].edgeConfig.inputMethodSelectRadio.expectUnchecked();
    await spectrum[0].edgeConfig.inputMethodFreeformRadio.expectChecked();
    await spectrum[0].edgeConfig.inputMethodFreeform.productionEnvironmentField.expectValue(
      "PR123",
    );
    await spectrum[0].edgeConfig.inputMethodFreeform.stagingEnvironmentField.expectValue(
      "PR123:stage",
    );
    await spectrum[0].edgeConfig.inputMethodFreeform.developmentEnvironmentField.expectValue(
      "PR123:dev1",
    );

    // Check org ID and edge settings
    await spectrum[0].orgIdField.expectValue("ORG456@OtherCompanyOrg");
    await spectrum[0].edgeDomainField.expectValue("testedge.com");
    await spectrum[0].edgeBasePathField.expectValue("ee-beta");

    // Check consent settings
    await spectrum[0].defaultConsent.inRadio.expectUnchecked();
    await spectrum[0].defaultConsent.outRadio.expectUnchecked();
    await spectrum[0].defaultConsent.pendingRadio.expectChecked();
    await spectrum[0].defaultConsent.dataElementRadio.expectUnchecked();
    await spectrum[0].defaultConsent.dataElementField.expectNotExists();

    // Check feature flags
    await spectrum[0].idMigrationEnabled.expectChecked();
    await spectrum[0].thirdPartyCookiesEnabled.expectChecked();
    await spectrum[0].internalLinkEnabledField.expectUnchecked();
    await spectrum[0].externalLinkEnabledField.expectUnchecked();
    await spectrum[0].downloadLinkEnabledField.expectUnchecked();

    // Check context settings
    await spectrum[0].contextGranularity.specificField.expectChecked();
    await spectrum[0].specificContext.webField.expectUnchecked();
    await spectrum[0].specificContext.deviceField.expectChecked();
    await spectrum[0].specificContext.environmentField.expectUnchecked();
    await spectrum[0].specificContext.placeContextField.expectChecked();
    await spectrum[0].specificContext.highEntropyUserAgentHintsContextField.expectUnchecked();

    // Check overrides
    await spectrum[0].overrides.envTabs.development.expectExists();
    await spectrum[0].overrides.envTabs.development.expectSelected();
    await spectrum[0].overrides.copyButtons.development.expectNotExists();
    await spectrum[0].overrides.copyButtons.staging.expectExists();
    await spectrum[0].overrides.copyButtons.production.expectExists();
  });

  test("initializes with sandbox selection", async () => {
    sandboxesMocks.single();
    datastreamsMocks.empty();

    await extensionViewController.init();

    await spectrum[0].nameField.expectValue("alloy");
    await spectrum[0].edgeConfig.inputMethodSelectRadio.expectChecked();
    await spectrum[0].edgeConfig.inputMethodFreeformRadio.expectUnchecked();
    await spectrum[0].edgeConfig.inputMethodSelect.production.sandboxField.expectSelectedOptionLabel(
      "Test Sandbox 1",
    );
    await spectrum[0].edgeConfig.inputMethodSelect.production.sandboxField.expectDisabled();
    await spectrum[0].edgeConfig.inputMethodSelect.production.datastreamField.expectSelectedOptionLabel(
      "Select a datastream",
    );
    await spectrum[0].edgeConfig.inputMethodSelect.staging.sandboxField.expectHidden();
    await spectrum[0].edgeConfig.inputMethodSelect.staging.datastreamField.expectSelectedOptionLabel(
      "Select a datastream",
    );
    await spectrum[0].edgeConfig.inputMethodSelect.development.sandboxField.expectHidden();
    await spectrum[0].edgeConfig.inputMethodSelect.development.datastreamField.expectSelectedOptionLabel(
      "Select a datastream",
    );
    await spectrum[0].orgIdField.expectValue(
      "5BFE274A5F6980A50A495C08@AdobeOrg",
    );
    await spectrum[0].edgeDomainField.expectValue(defaultEdgeDomain);
    await spectrum[0].edgeBasePathField.expectValue(defaultEdgeBasePath);
    await spectrum[0].defaultConsent.inRadio.expectChecked();
    await spectrum[0].defaultConsent.outRadio.expectUnchecked();
    await spectrum[0].defaultConsent.pendingRadio.expectUnchecked();
    await spectrum[0].defaultConsent.dataElementRadio.expectUnchecked();
    await spectrum[0].defaultConsent.dataElementField.expectNotExists();
    await spectrum[0].idMigrationEnabled.expectChecked();
    await spectrum[0].thirdPartyCookiesEnabled.expectChecked();
    await spectrum[0].internalLinkEnabledField.expectChecked();
    await spectrum[0].contextGranularity.allField.expectChecked();
  });

  test("initializes with datastream selection", async () => {
    sandboxesMocks.single();
    datastreamsMocks.single();
    datastreamMocks.basic();

    await extensionViewController.init();

    await spectrum[0].nameField.expectValue("alloy");
    await spectrum[0].edgeConfig.inputMethodSelectRadio.expectChecked();
    await spectrum[0].edgeConfig.inputMethodFreeformRadio.expectUnchecked();
    await spectrum[0].edgeConfig.inputMethodSelect.development.datastreamField.selectOption(
      "Test Config Overrides",
    );
    await spectrum[0].edgeConfig.inputMethodSelect.production.sandboxField.expectDisabled();
    await spectrum[0].edgeConfig.inputMethodSelect.production.datastreamField.expectExists();
    await spectrum[0].overrides.comboBoxes.envEnabled.clear();
    await spectrum[0].overrides.comboBoxes.envEnabled.enterSearch("Enabled");
    await spectrum[0].overrides.comboBoxes.eventDatasetOverride.expectExists();
    await spectrum[0].overrides.comboBoxes.eventDatasetOverride.expectIsComboBox();
    await spectrum[0].overrides.comboBoxes.idSyncContainerOverride.expectExists();
    await spectrum[0].overrides.comboBoxes.idSyncContainerOverride.expectIsComboBox();
    await spectrum[0].overrides.comboBoxes.targetPropertyTokenOverride.expectExists();
    await spectrum[0].overrides.comboBoxes.targetPropertyTokenOverride.expectIsComboBox();
    await spectrum[0].overrides.comboBoxes.reportSuiteOverrides[0].expectExists();
    await spectrum[0].overrides.comboBoxes.reportSuiteOverrides[0].expectIsComboBox();
  });
});
