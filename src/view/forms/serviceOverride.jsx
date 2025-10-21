/*
Copyright 2025 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
*/
import nestedObject from "./nestedObject";
import comboBox from "./comboBox";
import fieldArray from "./fieldArray";
import textField from "./textField";
import numberField from "./numberField";
import conditional from "./conditional";
import tabs from "./tabs";
import { string } from "yup";
import fillButton from "./fillButton";
import form from "./form";
import withContext from "./withContext";
import { ENVIRONMENTS } from "../configuration/constants/environmentType";
import { runFromConfiguration, runFromAction, getConfigurationDependencies, getActionDependencies } from "../components/overrides/withConfigContext";
import createRequestCache from "../components/overrides/createRequestCache";
import instancePicker from "./instancePicker";

const extensionServiceItems = [
  {value: "enable", label: "Enable service"},
  {value: "disable", label: "Disable service"},
];

const actionServiceItems = [
  {value: "enable", label: "Enable service"},
  {value: "disable", label: "Disable service"},
  {value: "match", label: "Use extension configuration"}
];

const actionServiceItemsNoDisable = actionServiceItems.filter(item => item.value !== "disable");

const extensionServiceOverride = ({
  name,
  label,
  subsection = true,
  disableAllowed = true,
}, children = []) => {
  const topLevelChildren = [];
  if (disableAllowed) {
    topLevelChildren.push(comboBox({
      name: "enabled",
      label: subsection ? "Enable" : label,
      items: extensionServiceItems,
      allowsCustomValue: false,
      dataElementSupported: true,
      description: "Select whether to enable or disable the service.",
      dataElementDescription: "The data element should resolve to true or false to enable or disable the service.",
      validationSchemaBase: string().required("Please select an option."),
      defaultValue: "enable",
    }));
  } else {
    topLevelChildren.push(comboBox({
      name: "enabled",
      label: subsection ? "Enable" : label,
      items: extensionServiceItems,
      allowsCustomValue: false,
      dataElementSupported: false,
      description: "You cannot disable this service",
      validationSchemaBase: string().required("Please select an option."),
      defaultValue: "enable",
      isDisabled: true,
    }));
  }
  if (children.length > 0) {
    // If there are children, we need to conditionally render them based on the enabled state.
    topLevelChildren.push(conditional({
      args: "enabled",
      condition: (enabled) => enabled !== "disable" && enabled !== "match",
    }, children));
  }

  return nestedObject({
    name,
    label: subsection ? label : "",
    wrapGetInitialValues: (getInitialValues) => ({ initInfo }) => {
      const {enabled, ...rest } = initInfo.settings || {};
      return getInitialValues({
        initInfo: {
          ...initInfo,
          settings: {
            enabled: enabled === false ? "disable" : "enable",
            ...rest,
          }
        }
      });
    },
    wrapGetSettings: (getSettings) => ({ values }) => {
      console.log("extensionOverride getSettings", name, values, getSettings({ values }));
      const { enabled, ...otherSettings } = getSettings({ values }) || {};
      if (enabled === "disable") {
        return {
          enabled: false,
          ...otherSettings,
        }
      } else {
        return otherSettings;
      }
    },
  }, topLevelChildren);
};

const actionServiceOverride = ({
  name,
  label,
  subsection = true,
  disableAllowed = true,
}, children = []) => {

  const topLevelChildren = [];
  if (disableAllowed) {
    topLevelChildren.push(comboBox({
      name: "enabled",
      label: subsection ? "Enable" : label,
      items: actionServiceItems,
      allowsCustomValue: false,
      dataElementSupported: true,
      description: "Select whether to match an existing configuration or disable the service.",
      dataElementDescription: "The data element should resolve to true or false to enable or disable the service, or undefined to match the exisiting extension configuration.",
      validationSchemaBase: string().required("Please select an option."),
      defaultValue: "match",
    }));
  } else {
    topLevelChildren.push(comboBox({
      name: "enabled",
      label: subsection ? "Enable" : label,
      items: actionServiceItemsNoDisable,
      allowsCustomValue: false,
      dataElementSupported: true,
      description: "Select whether to match an existing configuration or enable the service. You cannot disable this service.",
      dataElementDescription: "The data element should resolve to false to disable the service, or undefined to match the exisiting extension configuration.",
      validationSchemaBase: string().required("Please select an option."),
      defaultValue: "match",
    }));
  }
  if (children.length > 0) {
    topLevelChildren.push(conditional({
      args: "enabled",
      condition: (enabled) => enabled !== "disable" && enabled !== "match",
    }, children));
  }

  return nestedObject({
    name,
    label: subsection ? label : "",
    wrapGetInitialValues: (getInitialValues) => ({ initInfo }) => {
      const {enabled, ...rest } = initInfo.settings || {};
      return getInitialValues({
        initInfo: {
          ...initInfo,
          settings: {
            enabled: enabled === false ? "disable" : enabled === undefined ? "match" : "enable",
            ...rest,
          }
        }
      });
    },
    wrapGetSettings: (getSettings) => ({ values }) => {
      console.log("serviceOverridegetSettings", values, getSettings({ values }));
      const { enabled, ...otherSettings } = getSettings({ values }) || {};
      if (enabled === undefined) { // match
        return undefined;
      }
      if (enabled === "disable") {
        return {
          enabled: false,
          ...otherSettings,
        }
      }
      if (enabled === "enable") {
        return otherSettings;
      }
    },
  }, topLevelChildren);
}


const envOverride = ({isExtension = false, name}) => {

  const copyButtons = ENVIRONMENTS
    .filter(env => env !== name)
    .map(env =>
      fillButton({
        destName: name,
        sourceName: env,
        label: `Copy settings from ${env}`,
        fieldHasLabel: false,
      })
    );

    const serviceOverride = isExtension ? extensionServiceOverride : actionServiceOverride;

    const experiencePlatform = serviceOverride({
    name: "com_adobe_experience_platform",
    label: "Adobe Experience Platform",
  }, [
    textField({
      name: "datasetId",
      label: "Dataset ID",
      description: "Provide a dataset ID to override.",
      dataElementDescription: "Provide a data element that resolves to a dataset ID.",
    }),
    serviceOverride({
      name: "com_adobe_edge_ode",
      label: "Adobe Edge ODE",
      subsection: false,
    }),
    serviceOverride({
      name: "com_adobe_edge_segmentation",
      label: "Adobe Edge Segmentation",
      subsection: false,
    }),
    serviceOverride({
      name: "com_adobe_edge_destinations",
      label: "Adobe Edge Destinations",
      subsection: false,
    }),
    serviceOverride({
      name: "com_adobe_edge_ajo",
      label: "Adobe Edge AJO",
      subsection: false,
    }),
  ]);

  const analytics = serviceOverride({
    name: "com_adobe_analytics",
    label: "Adobe Analytics",
  }, [
    fieldArray({
      name: "reportSuites",
      label: "Report suites",
      singularLabel: "Report suite",
      dataElementDescription: "Provide a data element that resolves to a list of report suites.",
      description: "Provide a list of report suites to override.",
    }),
  ]);

  const identity = serviceOverride({
    name: "com_adobe_identity",
    label: "Adobe Identity",
    disableAllowed: false,
  }, [
    numberField({
      name: "idSyncContainerId",
      label: "Third-party ID sync container",
      description: "Provide an ID sync container ID to override.",
      dataElementDescription: "Provide a data element that resolves to an ID sync container ID as a number.",
    }),
  ]);

  const target = serviceOverride({
    name: "com_adobe_target",
    label: "Adobe Target",
  }, [
    textField({
      name: "propertyToken",
      label: "Property token",
      description: "Provide a property token to override.",
      dataElementDescription: "Provide a data element that resolves to a property token.",
    }),
  ]);

  const audienceManager = serviceOverride({
    name: "com_adobe_audiencemanager",
    label: "Adobe Audience Manager",
  });

  const launchSSF = serviceOverride({
    name: "com_adobe_launch_ssf",
    label: "Adobe Launch SSF",
  });

  return form({}, [
    form({ horizontal: true }, copyButtons),
    nestedObject({ name }, [
      experiencePlatform,
      analytics,
      identity,
      target,
      audienceManager,
      launchSSF,
    ])
  ]);
}

export default ({isExtension = false}) => {
  const runFrom = isExtension ? runFromConfiguration : runFromAction;
  const getDependencies = isExtension ? getConfigurationDependencies : getActionDependencies;
  const requestCache = createRequestCache();

  const contexts = ENVIRONMENTS.map(env => {
    return withContext({
      fetchContext: runFrom(env, requestCache),
      dependencies: getDependencies(env),
    });
  });
  return [
    instancePicker({
      name: "instanceName",
      label: "Instance",
      description: "Select an instance",
      dataElementDescription: "Provide a data element that resolves to an instance name.",
    }),
    ...contexts,
    nestedObject({name: "edgeConfigOverrides"}, [
      tabs({
        label: "Configuration overrides environment",
        tabLabels: ENVIRONMENTS.map(name => name.charAt(0).toUpperCase() + name.slice(1)),
        },
        ENVIRONMENTS.map(name => envOverride({isExtension, name}))
      )
    ])
  ];
};
