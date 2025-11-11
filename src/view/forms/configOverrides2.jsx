import overrideSection from "./overrideSection";
import { ENVIRONMENTS } from "../configuration/constants/environmentType";
import fillButton from "./fillButton";
import form from "./form";
import nestedObject from "./nestedObject";
import textField from "./textField";
import numberField from "./numberField";
import fieldArray from "./fieldArray";
import instancePicker from "./instancePicker";
import tabs from "./tabs";
import withContext from "./withContext";
import createRequestCache from "../components/overrides/createRequestCache";
import { runFromConfiguration, getConfigurationDependencies, runFromAction, getActionDependencies } from "../components/overrides/withConfigContext";
import comboBox from "./comboBox";
import FormikTextOrComboBox from "../components/formikReactSpectrum3/formikTextOrComboBox";

const envOverride = ({isAction, name}) => {

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

    const experiencePlatform = overrideSection({
      name: "com_adobe_experience_platform",
      label: "Adobe Experience Platform",
      isAction,
    }, [
      comboBox({
        name: "datasetId",
        label: "Dataset ID",
        description: "Provide a dataset ID to override.",
        dataElementDescription: "Provide a data element that resolves to a dataset ID.",
        disabledText: "No event datasets are configured on this datastream",
        items: (context) => context?.eventDatasets,
        Component: FormikTextOrComboBox,
      }),
      overrideSection({
        name: "com_adobe_edge_ode",
        label: "Adobe Edge ODE",
        wrapInWell: false,
        isAction,
      }),
      overrideSection({
        name: "com_adobe_edge_segmentation",
        label: "Adobe Edge Segmentation",
        wrapInWell: false,
        isAction,
      }),
      overrideSection({
        name: "com_adobe_edge_destinations",
        label: "Adobe Edge Destinations",
        wrapInWell: false,
        isAction,
      }),
      overrideSection({
        name: "com_adobe_edge_ajo",
        label: "Adobe Edge AJO",
        wrapInWell: false,
        isAction,
      }),
    ]);

  const analytics = overrideSection({
    name: "com_adobe_analytics",
    label: "Adobe Analytics",
    isAction,
  }, [
    fieldArray({
      name: "reportSuites",
      label: "Report suites",
      singularLabel: "Report suite",
      dataElementDescription: "Provide a data element that resolves to a list of report suites.",
      description: "Provide a list of report suites to override.",
    }),
  ]);

  const identity = overrideSection({
    name: "com_adobe_identity",
    label: "Adobe Identity",
    isAction,
    allowsDisable: false,
  }, [
    numberField({
      name: "idSyncContainerId",
      label: "Third-party ID sync container",
      description: "Provide an ID sync container ID to override.",
      dataElementDescription: "Provide a data element that resolves to an ID sync container ID as a number.",
    }),
  ]);

  const target = overrideSection({
    name: "com_adobe_target",
    label: "Adobe Target",
    isAction,
  }, [
    textField({
      name: "propertyToken",
      label: "Property token",
      description: "Provide a property token to override.",
      dataElementDescription: "Provide a data element that resolves to a property token.",
    }),
  ]);


  const audienceManager = overrideSection({
    name: "com_adobe_audiencemanager",
    label: "Adobe Audience Manager",
    isAction,
  });

  const launchSSF = overrideSection({
    name: "com_adobe_launch_ssf",
    label: "Adobe Launch SSF",
    isAction,
  });

  return form({}, [
    form({ horizontal: true }, copyButtons),
    overrideSection({ name, wrapInWell: false, allowsDisable: false, isAction, isTopLevel: true }, [
      experiencePlatform,
      analytics,
      identity,
      target,
      audienceManager,
      launchSSF,
    ])
  ]);
}

export default ({isAction = true}) => {
  const runFrom = isAction ? runFromAction: runFromConfiguration;
  const getDependencies = isAction ? getActionDependencies : getConfigurationDependencies;
  const requestCache = createRequestCache();

  const contexts = ENVIRONMENTS.map(env => {
    return withContext({
      updateContext: runFrom(env, requestCache),
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
        ENVIRONMENTS.map(name => envOverride({isAction, name}))
      )
    ])
  ];
};
