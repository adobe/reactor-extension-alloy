/*
Copyright 2019 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
*/

import "regenerator-runtime"; // needed for some of react-spectrum
import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { object, array, string, mixed } from "yup";
import { FieldArray } from "formik";
import Textfield from "@react/react-spectrum/Textfield";
import RadioGroup from "@react/react-spectrum/RadioGroup";
import Radio from "@react/react-spectrum/Radio";
import Checkbox from "@react/react-spectrum/Checkbox";
import Button from "@react/react-spectrum/Button";
import Alert from "@react/react-spectrum/Alert";
import ModalTrigger from "@react/react-spectrum/ModalTrigger";
import Dialog from "@react/react-spectrum/Dialog";
import FieldLabel from "@react/react-spectrum/FieldLabel";
import Delete from "@react/react-spectrum/Icon/Delete";
import Select from "@react/react-spectrum/Select";
import { Accordion, AccordionItem } from "@react/react-spectrum/Accordion";
import Rule from "@react/react-spectrum/Rule";
import Link from "@react/react-spectrum/Link";
import { CopyToClipboard } from "react-copy-to-clipboard";
import CheckboxList from "../components/checkboxList";
import "@react/react-spectrum/Form"; // needed for spectrum form styles
import render from "../spectrum2Render";
import WrappedField from "../components/wrappedField";
import ExtensionView from "../components/spectrum2ExtensionView";
import EditorButton from "../components/editorButton";
import InfoTipLayout from "../components/infoTipLayout";

import copyPropertiesIfNotDefault from "./utils/copyPropertiesIfNotDefault";
import useNewlyValidatedFormSubmission from "../utils/useNewlyValidatedFormSubmission";
import fetchConfigs from "./utils/fetchConfigs";
import fetchEnvironments from "./utils/fetchEnvironments";
import prehidingSnippet from "./constants/prehidingSnippet";
import "./configuration.styl";
import EnvironmentSelector from "../components/environmentSelector";
import OptionsWithDataElement, {
  DATA_ELEMENT
} from "../components/optionsWithDataElement";
import singleDataElementRegex from "../constants/singleDataElementRegex";
import { DATA_ELEMENT_REQUIRED } from "../constants/validationErrorMessages";

const edgeConfigInputMethods = {
  SELECT: "select",
  TEXTFIELD: "textfield"
};
const contextGranularityEnum = {
  ALL: "all",
  SPECIFIC: "specific"
};
const consentLevels = {
  IN: "in",
  OUT: "out",
  PENDING: "pending"
};
const contextOptions = [
  {
    label: "Web",
    value: "web",
    testId: "contextWebField"
  },
  {
    label: "Device",
    value: "device",
    testId: "contextDeviceField"
  },
  {
    label: "Environment",
    value: "environment",
    testId: "contextEnvironmentField"
  },
  {
    label: "Place Context",
    value: "placeContext",
    testId: "contextPlaceContextField"
  }
];

const getInstanceDefaults = initInfo => ({
  name: "alloy",
  edgeConfigInputMethod: edgeConfigInputMethods.SELECT,
  edgeConfigId: "",
  stagingEdgeConfigId: "",
  developmentEdgeConfigId: "",
  orgId: initInfo.company.orgId,
  edgeDomain: "edge.adobedc.net",
  edgeBasePath: "ee",
  defaultConsent: { radio: consentLevels.IN, dataElement: "" },
  prehidingStyle: "",
  contextGranularity: contextGranularityEnum.ALL,
  context: contextOptions.map(contextOption => contextOption.value),
  idMigrationEnabled: true,
  thirdPartyCookiesEnabled: true,
  clickCollectionEnabled: true,
  onBeforeEventSend: "",
  downloadLinkQualifier:
    "\\.(exe|zip|wav|mp3|mov|mpg|avi|wmv|pdf|doc|docx|xls|xlsx|ppt|pptx)$"
});

const createDefaultInstance = initInfo =>
  JSON.parse(JSON.stringify(getInstanceDefaults(initInfo)));

const getInitialValues = ({ initInfo, setConfigs, setEnvironments }) => {
  const instanceDefaults = getInstanceDefaults(initInfo);
  let { instances } = initInfo.settings || {};

  return fetchConfigs({
    orgId: initInfo.company.orgId,
    imsAccess: initInfo.tokens.imsAccess
  })
    .then(fetchedConfigs => {
      setConfigs(fetchedConfigs);

      if (instances && instances.length > 0 && instances[0].edgeConfigId) {
        if (
          fetchedConfigs.find(
            config => config.value === instances[0].edgeConfigId
          )
        ) {
          return fetchEnvironments({
            orgId: initInfo.company.orgId,
            imsAccess: initInfo.tokens.imsAccess,
            edgeConfigId: instances[0].edgeConfigId
          });
        }
        // We don't know about that edgeConfigId so fallback to the textfield input method
        instances[0].edgeConfigInputMethod = edgeConfigInputMethods.TEXTFIELD;
      }
      return Promise.resolve({
        edgeConfigId: "",
        production: [],
        staging: [],
        development: []
      });
    })
    .then(fetchedEnvironments => {
      setEnvironments({ fetching: false, ...fetchedEnvironments });

      if (instances) {
        instances.forEach((instance, index) => {
          if (instance.context) {
            instance.contextGranularity = contextGranularityEnum.SPECIFIC;
          }
          if (singleDataElementRegex.test(instance.defaultConsent)) {
            instance.defaultConsent = {
              radio: DATA_ELEMENT,
              dataElement: instance.defaultConsent
            };
          } else {
            instance.defaultConsent = {
              radio: instance.defaultConsent || consentLevels.IN,
              dataElement: ""
            };
          }

          // if one environment is empty (and there are some), or not found, use the textfield input method.
          if (
            index === 0 &&
            ((!instance.stagingEdgeConfigId &&
              fetchedEnvironments.staging.length > 0) ||
              (!instance.developmentEdgeConfigId &&
                fetchedEnvironments.development.length > 0) ||
              (instance.stagingEdgeConfigId &&
                !fetchedEnvironments.staging.find(
                  env => env.value === instance.stagingEdgeConfigId
                )) ||
              (instance.developmentEdgeConfigId &&
                !fetchedEnvironments.development.find(
                  env => env.value === instance.developmentEdgeConfigId
                )))
          ) {
            instance.edgeConfigInputMethod = edgeConfigInputMethods.TEXTFIELD;
          }

          // Copy default values to the instance if the properties
          // aren't already defined on the instance. This is primarily
          // because Formik requires all fields to have initial values.
          Object.keys(instanceDefaults).forEach(key => {
            if (instance[key] === undefined) {
              instance[key] = instanceDefaults[key];
            }
          });
        });
      } else {
        instances = [createDefaultInstance(initInfo)];
      }

      return {
        instances
      };
    });
};

const getSettings = ({ values, initInfo }) => {
  const instanceDefaults = getInstanceDefaults(initInfo);
  return {
    instances: values.instances.map(instance => {
      const trimmedInstance = {
        name: instance.name
      };

      const copyPropertyKeys = [
        "edgeConfigId",
        "stagingEdgeConfigId",
        "developmentEdgeConfigId",
        "orgId",
        "edgeDomain",
        "edgeBasePath",
        "prehidingStyle",
        "idMigrationEnabled",
        "thirdPartyCookiesEnabled",
        "onBeforeEventSend",
        "clickCollectionEnabled"
      ];

      if (instance.clickCollectionEnabled) {
        copyPropertyKeys.push("downloadLinkQualifier");
      }

      copyPropertiesIfNotDefault(
        trimmedInstance,
        instance,
        instanceDefaults,
        copyPropertyKeys
      );

      if (instance.defaultConsent.radio === DATA_ELEMENT) {
        trimmedInstance.defaultConsent = instance.defaultConsent.dataElement;
      } else if (instance.defaultConsent.radio !== consentLevels.IN) {
        trimmedInstance.defaultConsent = instance.defaultConsent.radio;
      }

      if (instance.contextGranularity === contextGranularityEnum.SPECIFIC) {
        trimmedInstance.context = instance.context;
      }

      return trimmedInstance;
    })
  };
};

const validateDuplicateValue = (createError, instances, key, message) => {
  const values = instances.map(instance => instance[key]);
  const duplicateIndex = values.findIndex(
    (value, index) => values.indexOf(value) < index
  );

  return (
    duplicateIndex === -1 ||
    createError({
      path: `instances[${duplicateIndex}].${key}`,
      message
    })
  );
};

const validationSchema = object()
  .shape({
    instances: array().of(
      object().shape({
        name: string()
          .required("Please specify a name.")
          // Under strict mode, setting window["123"], where the key is all
          // digits, throws a "Failed to set an indexed property on 'Window'" error.
          // This regex ensure there's at least one non-digit.
          .matches(/\D+/, "Please provide a non-numeric name.")
          .test({
            name: "notWindowPropertyName",
            message:
              "Please provide a name that does not conflict with a property already found on the window object.",
            test(value) {
              return !(value in window);
            }
          }),
        edgeConfigId: string().required("Please specify an edge config ID."),
        orgId: string().required("Please specify an IMS organization ID."),
        edgeDomain: string().required("Please specify an edge domain."),
        edgeBasePath: string().required("Please specify an edge base path."),
        downloadLinkQualifier: string().when("clickCollectionEnabled", {
          is: true,
          then: string()
            .min(1)
            .test({
              name: "invalidDownloadLinkQualifier",
              message: "Please provide a valid regular expression.",
              test(value) {
                try {
                  return new RegExp(value) !== null;
                } catch (e) {
                  return false;
                }
              }
            })
        }),
        defaultConsent: object().shape({
          dataElement: mixed().when("radio", {
            is: DATA_ELEMENT,
            then: string()
              .required(DATA_ELEMENT_REQUIRED)
              .matches(singleDataElementRegex, DATA_ELEMENT_REQUIRED)
          })
        })
      })
    )
  })
  // TestCafe doesn't allow this to be an arrow function because of
  // how it scopes "this".
  // eslint-disable-next-line func-names
  .test("uniqueName", function(settings) {
    return validateDuplicateValue(
      this.createError.bind(this),
      settings.instances,
      "name",
      "Please provide a name unique from those used for other instances."
    );
  })
  // TestCafe doesn't allow this to be an arrow function because of
  // how it scopes "this".
  // eslint-disable-next-line func-names
  .test("uniqueConfigId", function(settings) {
    return validateDuplicateValue(
      this.createError.bind(this),
      settings.instances,
      "edgeConfigId",
      "Please provide an edge config ID unique from those used for other instances."
    );
  })
  // TestCafe doesn't allow this to be an arrow function because of
  // how it scopes "this".
  // eslint-disable-next-line func-names
  .test("uniqueOrgId", function(settings) {
    return validateDuplicateValue(
      this.createError.bind(this),
      settings.instances,
      "orgId",
      "Please provide an IMS Organization ID unique from those used for other instances."
    );
  });

const Configuration = ({
  formikProps,
  initInfo,
  configs,
  environments,
  setEnvironments
}) => {
  const {
    values,
    errors,
    isSubmitting,
    isValidating,
    setFieldValue,
    initialValues
  } = formikProps;
  // On the initial render, only expand the first accordion item
  // if there's one instance, because users may get disoriented if we
  // automatically expand the first item when there are multiple instances.
  const [selectedAccordionIndex, setSelectedAccordionIndex] = useState(
    values.instances.length === 1 ? 0 : undefined
  );

  const firstInstance = values.instances[0];

  const isFirstRenderRef = useRef(true);
  useEffect(() => {
    const isFirstRender = isFirstRenderRef.current;
    isFirstRenderRef.current = false;
    let isLatestRequest = true;
    if (
      firstInstance.edgeConfigInputMethod === edgeConfigInputMethods.SELECT &&
      !isFirstRender &&
      firstInstance.edgeConfigId
    ) {
      if (firstInstance.edgeConfigId !== environments.edgeConfigId) {
        setEnvironments({
          edgeConfigid: firstInstance.edgeConfigId,
          fetching: true
        });
        setFieldValue("instances.0.stagingEdgeConfigId", "");
        setFieldValue("instances.0.developmentEdgeConfigId", "");

        fetchEnvironments({
          orgId: initInfo.company.orgId,
          imsAccess: initInfo.tokens.imsAccess,
          edgeConfigId: firstInstance.edgeConfigId
        }).then(fetchedEnvironments => {
          if (isLatestRequest) {
            setEnvironments({ fetching: false, ...fetchedEnvironments });
            if (fetchedEnvironments.staging.length > 0) {
              setFieldValue(
                "instances.0.stagingEdgeConfigId",
                fetchedEnvironments.staging[0].value
              );
            }
            if (fetchedEnvironments.development.length === 1) {
              setFieldValue(
                "instances.0.developmentEdgeConfigId",
                fetchedEnvironments.development[0].value
              );
            }
          }
        });
      } else {
        // check to see if entered values are valid
        if (environments.staging.length > 0) {
          setFieldValue(
            "instances.0.stagingEdgeConfigId",
            environments.staging[0].value
          );
        } else {
          setFieldValue("instances.0.stagingEdgeConfigId", "");
        }
        if (environments.development.length === 1) {
          setFieldValue(
            "instances.0.developmentEdgeConfigId",
            environments.development[0].value
          );
        } else if (
          environments.development.length === 0 ||
          !environments.development.find(
            env => env.value === firstInstance.developmentEdgeConfigId
          )
        ) {
          setFieldValue("instances.0.developmentEdgeConfigId", "");
        }
      }
    }
    return () => {
      isLatestRequest = false;
    };
  }, [firstInstance.edgeConfigId, firstInstance.edgeConfigInputMethod]);

  useNewlyValidatedFormSubmission({
    callback: () => {
      // If the user just tried to save the configuration and there's
      // a validation error, make sure the first accordion item containing
      // an error is shown.
      if (isSubmitting && !isValidating && errors && errors.instances) {
        const instanceIndexContainingErrors = errors.instances.findIndex(
          instance => instance
        );
        setSelectedAccordionIndex(instanceIndexContainingErrors);
      }
    },
    formikProps
  });

  return (
    <div>
      <FieldArray
        name="instances"
        render={arrayHelpers => {
          return (
            <div>
              <div className="u-alignRight">
                <Button
                  data-test-id="addInstanceButton"
                  label="Add Instance"
                  onClick={() => {
                    const newInstance = createDefaultInstance(initInfo);
                    newInstance.edgeConfigInputMethod =
                      edgeConfigInputMethods.TEXTFIELD;
                    arrayHelpers.push(newInstance);
                    setSelectedAccordionIndex(values.instances.length);
                  }}
                />
              </div>
              <Accordion
                data-test-id="instancesAccordion"
                selectedIndex={selectedAccordionIndex}
                className="u-gapTop2x"
                onChange={setSelectedAccordionIndex}
              >
                {values.instances.map((instance, index) => (
                  <AccordionItem
                    key={index}
                    header={instance.name || "unnamed instance"}
                  >
                    <div>
                      <InfoTipLayout tip="A global method on the window object will be created with this name.">
                        <FieldLabel labelFor="nameField" label="Name" />
                      </InfoTipLayout>
                      <div>
                        <WrappedField
                          data-test-id="nameField"
                          id="nameField"
                          name={`instances.${index}.name`}
                          component={Textfield}
                          componentClassName="u-fieldLong"
                          supportDataElement="replace"
                        />
                      </div>
                      {// If we're editing an existing configuration and the name changes.
                      initInfo.settings &&
                      initialValues.instances[0].name !==
                        values.instances[0].name ? (
                        <Alert
                          data-test-id="nameChangeAlert"
                          id="nameChangeAlert"
                          className="ConstrainedAlert"
                          header="Potential Problems Due to Name Change"
                          variant="warning"
                        >
                          Any rule components or data elements using this
                          instance will no longer function as expected when
                          running on your website. We recommend removing or
                          updating those resources before publishing your next
                          library.
                        </Alert>
                      ) : null}
                      <div />
                    </div>
                    <div className="u-gapTop">
                      <InfoTipLayout tip="Your assigned Experience Cloud organization ID.">
                        <FieldLabel
                          labelFor="orgIdField"
                          label="IMS Organization ID"
                        />
                      </InfoTipLayout>
                      <div>
                        <WrappedField
                          data-test-id="orgIdField"
                          id="orgIdField"
                          name={`instances.${index}.orgId`}
                          component={Textfield}
                          componentClassName="u-fieldLong"
                          supportDataElement="replace"
                        />
                        <Button
                          data-test-id="orgIdRestoreButton"
                          label="Restore to default"
                          onClick={() => {
                            const instanceDefaults = getInstanceDefaults(
                              initInfo
                            );
                            setFieldValue(
                              `instances.${index}.orgId`,
                              instanceDefaults.orgId
                            );
                          }}
                          quiet
                        />
                      </div>
                    </div>
                    <div className="u-gapTop">
                      <InfoTipLayout
                        tip="The domain that will be used to interact with
                        Adobe Services. Update this setting if you have
                        mapped one of your first party domains (using
                        CNAME) to an Adobe provisioned domain."
                      >
                        <FieldLabel
                          labelFor="edgeDomainField"
                          label="Edge Domain"
                        />
                      </InfoTipLayout>
                      <div>
                        <WrappedField
                          data-test-id="edgeDomainField"
                          id="edgeDomainField"
                          name={`instances.${index}.edgeDomain`}
                          component={Textfield}
                          componentClassName="u-fieldLong"
                          supportDataElement="replace"
                        />
                        <Button
                          data-test-id="edgeDomainRestoreButton"
                          label="Restore to default"
                          onClick={() => {
                            const instanceDefaults = getInstanceDefaults(
                              initInfo
                            );
                            setFieldValue(
                              `instances.${index}.edgeDomain`,
                              instanceDefaults.edgeDomain
                            );
                          }}
                          quiet
                        />
                      </div>
                    </div>

                    <div>
                      <h2 className="Rule">Edge Configurations</h2>
                      <Rule variant="small" />
                      <Link href="https://adobe.ly/3eY91Er" target="_blank">
                        Learn more
                      </Link>

                      <div className="u-gapTop">
                        {index === 0 && (
                          <WrappedField
                            name={`instances.${index}.edgeConfigInputMethod`}
                            id="edgeConfigInputMethodRadioGroup"
                            component={RadioGroup}
                          >
                            <Radio
                              data-test-id="edgeConfigInputMethodSelectRadio"
                              value={edgeConfigInputMethods.SELECT}
                              label="Choose from list"
                            />
                            <Radio
                              data-test-id="edgeConfigInputMethodTextfieldRadio"
                              value={edgeConfigInputMethods.TEXTFIELD}
                              label="Enter values"
                              className="u-gapLeft2x"
                            />
                          </WrappedField>
                        )}
                        {index === 0 &&
                        instance.edgeConfigInputMethod ===
                          edgeConfigInputMethods.SELECT ? (
                          <div>
                            <div className="u-gapTop">
                              <InfoTipLayout tip="The edge config name">
                                <FieldLabel
                                  labelFor="edgeConfigId"
                                  label="Edge Configuration"
                                />
                              </InfoTipLayout>
                              <WrappedField
                                data-test-id="edgeConfigIdSelect"
                                id="edgeConfigId"
                                name={`instances.${index}.edgeConfigId`}
                                component={Select}
                                options={configs}
                                componentClassName="u-fieldLong"
                              />
                            </div>
                            {!environments.fetching && instance.edgeConfigId && (
                              <div>
                                <div className="u-gapTop">
                                  <WrappedField
                                    data-test-id="productionEdgeConfigId"
                                    id="productionEdgeConfigId"
                                    name="instances.0.productionEdgeConfigId"
                                    component={EnvironmentSelector}
                                    label="Production Environment"
                                    infoTip="The production edge config environment. This config is used when the launch library is used in development."
                                    alertVariant="error"
                                    alertHeader="Error"
                                    alertText="No Production environment has been configured. You must add a production environment to your Edge Configuration."
                                    options={environments.production}
                                    className="u-fieldLong"
                                  />
                                </div>
                                <div className="u-gapTop">
                                  <WrappedField
                                    data-test-id="stagingEdgeConfigId"
                                    id="stagingEdgeConfigId"
                                    name="instances.0.stagingEdgeConfigId"
                                    component={EnvironmentSelector}
                                    label="Staging Environment"
                                    infoTip="The staging edge config environment. This config is used when the launch library is used in staging."
                                    alertVariant="warning"
                                    alertHeader="Warning"
                                    alertText="No staging environments have been configured. The production environment will be used for the Launch staging environment."
                                    options={environments.staging}
                                    className="u-fieldLong"
                                  />
                                </div>
                                <div className="u-gapTop">
                                  <WrappedField
                                    data-test-id="developmentEdgeConfigId"
                                    id="developmentEdgeConfigId"
                                    name="instances.0.developmentEdgeConfigId"
                                    component={EnvironmentSelector}
                                    label="Development Environment"
                                    infoTip="The development edge config environment. This config is used when the launch library is used in development."
                                    alertVariant="warning"
                                    alertHeader="Warning"
                                    alertText="No development environments have been configured. The production environment will be used for the Launch development environment."
                                    options={environments.development}
                                    className="u-fieldLong"
                                  />
                                </div>
                              </div>
                            )}
                          </div>
                        ) : (
                          <div>
                            <div className="u-gapTop">
                              <InfoTipLayout tip="The production edge config environment id.">
                                <FieldLabel
                                  labelFor="edgeConfigIdField"
                                  label="Production Environment ID"
                                />
                              </InfoTipLayout>
                              <WrappedField
                                data-test-id="productionManualEdgeConfigIdField"
                                id="edgeConfigIdField"
                                name={`instances.${index}.edgeConfigId`}
                                component={Textfield}
                                componentClassName="u-fieldLong"
                                supportDataElement="replace"
                              />
                            </div>
                            <div className="u-gapTop">
                              <InfoTipLayout tip="The staging edge config environment id.">
                                <FieldLabel
                                  labelFor="stagingEdgeConfigIdField"
                                  label="Staging Environment ID"
                                />
                              </InfoTipLayout>
                              <WrappedField
                                data-test-id="stagingManualEdgeConfigIdField"
                                id="stagingEdgeConfigIdField"
                                name={`instances.${index}.stagingEdgeConfigId`}
                                component={Textfield}
                                componentClassName="u-fieldLong"
                                supportDataElement="replace"
                              />
                            </div>
                            <div className="u-gapTop">
                              <InfoTipLayout tip="The development edge config environment id.">
                                <FieldLabel
                                  labelFor="developmentEdgeConfigIdField"
                                  label="Development Environment ID"
                                />
                              </InfoTipLayout>
                              <WrappedField
                                data-test-id="developmentManualEdgeConfigIdField"
                                id="developmentEdgeConfigIdField"
                                name={`instances.${index}.developmentEdgeConfigId`}
                                component={Textfield}
                                componentClassName="u-fieldLong"
                                supportDataElement="replace"
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    <div>
                      <h2 className="Rule">Privacy</h2>
                      <Rule variant="small" />
                      <Link href="https://adobe.ly/2WSngEh" target="_blank">
                        Learn more
                      </Link>

                      <div className="u-gapTop2x">
                        <OptionsWithDataElement
                          options={[
                            {
                              value: consentLevels.IN,
                              label:
                                "In - Collect events that occur before the user provides consent preferences.",
                              testId: "In"
                            },
                            {
                              value: consentLevels.OUT,
                              label:
                                "Out - Drop events that occur before the user provides consent preferences.",
                              testId: "Out"
                            },
                            {
                              value: consentLevels.PENDING,
                              label:
                                "Pending - Queue events that occur before the user provides consent preferences.",
                              testId: "Pending"
                            }
                          ]}
                          label="Default Consent"
                          infoTip="How to handle events that occur before the user provides consent preferences. This setting is not persisted to users' profiles. If provided through a data element, it should resolve to 'in', 'out', or 'pending'."
                          id="generalDefaultConsent"
                          data-test-id="defaultConsent"
                          name={`instances.${index}.defaultConsent`}
                          values={instance.defaultConsent}
                        />
                      </div>
                    </div>

                    <div>
                      <h2 className="Rule">Identity</h2>
                      <Rule variant="small" />
                      <Link href="https://adobe.ly/39ouRzA" target="_blank">
                        Learn more
                      </Link>

                      <div className="u-gapTop">
                        <InfoTipLayout tip="Enables the AEP Web SDK to preserve the ECID by reading/writing the AMCV cookie. Use this config until users are fully migrated to the Alloy cookie and in situations where you have mixed pages on your website.">
                          <WrappedField
                            data-test-id="idMigrationEnabledField"
                            name={`instances.${index}.idMigrationEnabled`}
                            component={Checkbox}
                            label="Migrate ECID from VisitorAPI to Alloy to prevent visitor cliffing"
                          />
                        </InfoTipLayout>
                      </div>

                      <div className="u-gapTop">
                        <InfoTipLayout tip="Enables the setting of Adobe third-party cookies. The SDK has the ability to persist the visitor ID in a third-party context to enable the same visitor ID to be used across site. This is useful if you have multiple sites or you want to share data with partners; however, sometimes this is not desired for privacy reasons.">
                          <WrappedField
                            data-test-id="thirdPartyCookiesEnabledField"
                            name={`instances.${index}.thirdPartyCookiesEnabled`}
                            component={Checkbox}
                            label="Use third-party cookies"
                          />
                        </InfoTipLayout>
                      </div>
                    </div>

                    <div>
                      <h2 className="Rule">Personalization</h2>
                      <Rule variant="small" />
                      <Link href="https://adobe.ly/3fYDkfh" target="_blank">
                        Learn more
                      </Link>

                      <div className="u-gapTop">
                        <InfoTipLayout tip="A CSS style definition that will hide content areas of your web page while personalized content is loaded from the server.">
                          <FieldLabel
                            labelFor="prehidingStyleField"
                            label="Prehiding Style (optional)"
                          />
                        </InfoTipLayout>
                        <div>
                          <WrappedField
                            data-test-id="prehidingStyleEditorButton"
                            id="prehidingStyleField"
                            name={`instances.${index}.prehidingStyle`}
                            component={EditorButton}
                            language="css"
                            placeholder={
                              "/*\nHide elements as necessary. For example:\n#container { opacity: 0 !important }\n*/"
                            }
                          />
                        </div>
                      </div>
                      <div className="u-gapTop">
                        <InfoTipLayout tip="Place the prehiding snippet within the <head> tag of the HTML page.">
                          <FieldLabel
                            labelFor="copyToClipboardPrehidingSnippetButton"
                            label="Default prehiding snippet (optional)"
                          />
                        </InfoTipLayout>
                        <div>
                          <CopyToClipboard text={prehidingSnippet}>
                            <Button
                              id="copyToClipboardPrehidingSnippetButton"
                              data-test-id="copyToClipboardPrehidingSnippetButton"
                              label="Copy to Clipboard"
                            />
                          </CopyToClipboard>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h2 className="Rule">Data Collection</h2>
                      <Rule variant="small" />
                      <Link href="https://adobe.ly/2CYnq65" target="_blank">
                        Learn more
                      </Link>
                      <div className="u-gapTop">
                        <InfoTipLayout tip='A variable named "content" will be available for use within your custom code. Modify "content.xdm" as needed to transform data before it is sent to the server.'>
                          <FieldLabel
                            labelFor="onBeforeEventSendField"
                            label="Callback function for modifying data before each event is sent to the server"
                          />
                        </InfoTipLayout>
                        <div>
                          <WrappedField
                            data-test-id="onBeforeEventSendEditorButton"
                            id="onBeforeEventSendField"
                            name={`instances.${index}.onBeforeEventSend`}
                            component={EditorButton}
                            language="javascript"
                            placeholder={
                              '// Modify content.xdm as necessary. There is no need to wrap the code in a function\n// or return a value. For example:\n// content.xdm.web.webPageDetails.name = "Checkout";'
                            }
                          />
                        </div>
                      </div>
                      <div className="u-gapTop2x u-gapBottom2x">
                        <InfoTipLayout tip="Indicates whether data associated with clicks on navigational links, download links, or personalized content should be automatically collected.">
                          <WrappedField
                            data-test-id="clickCollectionEnabledField"
                            name={`instances.${index}.clickCollectionEnabled`}
                            component={Checkbox}
                            label="Enable click data collection"
                          />
                        </InfoTipLayout>
                      </div>
                      {values.instances[index].clickCollectionEnabled ? (
                        <div className="FieldSubset u-gapTop u-gapBottom">
                          <InfoTipLayout tip="Regular expression that qualifies a link URL as a download link.">
                            <FieldLabel
                              labelFor="downloadLinkQualifier"
                              label="Download Link Qualifier"
                            />
                          </InfoTipLayout>
                          <div>
                            <WrappedField
                              data-test-id="downloadLinkQualifierField"
                              id="downloadLinkQualifierField"
                              name={`instances.${index}.downloadLinkQualifier`}
                              component={Textfield}
                              componentClassName="u-fieldLong"
                            />
                            <Button
                              data-test-id="downloadLinkQualifierTestButton"
                              className="u-gapLeft"
                              label="Test"
                              onClick={() => {
                                const currentPattern =
                                  values.instances[index].downloadLinkQualifier;
                                window.extensionBridge
                                  .openRegexTester({
                                    pattern: currentPattern
                                  })
                                  .then(newPattern => {
                                    // A bug exists in the Launch UI where the promise is resolved
                                    // with undefined if the user hits Cancel. Instead, the promise
                                    // should have never been resolved or rejected.
                                    // https://jira.corp.adobe.com/browse/DTM-14454
                                    if (newPattern === undefined) {
                                      return;
                                    }
                                    setFieldValue(
                                      `instances.${index}.downloadLinkQualifier`,
                                      newPattern
                                    );
                                  });
                              }}
                              quiet
                            />
                            <Button
                              data-test-id="downloadLinkQualifierRestoreButton"
                              label="Restore to default"
                              onClick={() => {
                                const instanceDefaults = getInstanceDefaults(
                                  initInfo
                                );
                                setFieldValue(
                                  `instances.${index}.downloadLinkQualifier`,
                                  instanceDefaults.downloadLinkQualifier
                                );
                              }}
                              quiet
                            />
                          </div>
                        </div>
                      ) : null}
                      <div className="u-gapTop">
                        <InfoTipLayout tip="Indicates which categories of context information should be automatically collected.">
                          <FieldLabel
                            labelFor="contextGranularityField"
                            label="When sending event data, automatically include:"
                          />
                        </InfoTipLayout>
                        <WrappedField
                          id="contextGranularityField"
                          name={`instances.${index}.contextGranularity`}
                          component={RadioGroup}
                          componentClassName="u-flexColumn"
                        >
                          <Radio
                            data-test-id="contextGranularityAllField"
                            value={contextGranularityEnum.ALL}
                            label="all context information"
                          />
                          <Radio
                            data-test-id="contextGranularitySpecificField"
                            value={contextGranularityEnum.SPECIFIC}
                            label="specific context information"
                          />
                        </WrappedField>
                      </div>
                      {values.instances[index].contextGranularity ===
                      contextGranularityEnum.SPECIFIC ? (
                        <div className="FieldSubset u-gapTop">
                          <WrappedField
                            name={`instances.${index}.context`}
                            component={CheckboxList}
                            options={contextOptions}
                          />
                        </div>
                      ) : null}
                    </div>

                    <div className="u-gapTop2x">
                      <div>
                        <h2 className="AdvancedSettings">Advanced Settings</h2>
                        <Rule variant="small" />

                        <div className="u-gapTop">
                          <InfoTipLayout
                            tip="Specifies the base path of the endpoint used
                      to interact with Adobe Services. This setting
                      should only be changed if you are not intending
                      to use the default production environment."
                          >
                            <FieldLabel
                              labelFor="edgeBasePathField"
                              label="Edge Base Path"
                            />
                          </InfoTipLayout>
                          <div>
                            <WrappedField
                              data-test-id="edgeBasePathField"
                              id="edgeBasePathField"
                              name={`instances.${index}.edgeBasePath`}
                              component={Textfield}
                              componentClassName="u-fieldLong"
                              supportDataElement="replace"
                            />
                            <Button
                              data-test-id="edgeBasePathRestoreButton"
                              label="Restore to default"
                              onClick={() => {
                                const instanceDefaults = getInstanceDefaults(
                                  initInfo
                                );
                                setFieldValue(
                                  `instances.${index}.edgeBasePath`,
                                  instanceDefaults.edgeBasePath
                                );
                              }}
                              quiet
                            />
                          </div>
                        </div>
                      </div>
                      <div className="u-gapTop2x">
                        <ModalTrigger>
                          <Button
                            data-test-id="deleteInstanceButton"
                            label="Delete Instance"
                            icon={<Delete />}
                            variant="action"
                            disabled={values.instances.length === 1}
                          />
                          {values.instances.length === 1 ? (
                            <span className="Note u-gapLeft">
                              You must have at least one instance to use this
                              extension.
                            </span>
                          ) : null}
                          <Dialog
                            id="resourceUsageDialog"
                            onConfirm={() => {
                              arrayHelpers.remove(index);
                              setSelectedAccordionIndex(0);
                            }}
                            title="Resource Usage"
                            confirmLabel="Delete"
                            cancelLabel="Cancel"
                          >
                            Any rule components or data elements using this
                            instance will no longer function as expected when
                            running on your website. We recommend removing these
                            resources or switching them to use a different
                            instance before publishing your next library. Would
                            you like to proceed?
                          </Dialog>
                        </ModalTrigger>
                      </div>
                    </div>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          );
        }}
      />
    </div>
  );
};

Configuration.propTypes = {
  initInfo: PropTypes.object.isRequired,
  formikProps: PropTypes.object.isRequired,
  configs: PropTypes.array.isRequired,
  environments: PropTypes.object.isRequired,
  setEnvironments: PropTypes.func.isRequired
};

const ConfigurationExtensionView = () => {
  const [configs, setConfigs] = useState();
  const [environments, setEnvironments] = useState();

  return (
    <ExtensionView
      getInitialValues={({ initInfo }) =>
        getInitialValues({ initInfo, setConfigs, setEnvironments })
      }
      getSettings={getSettings}
      validationSchema={validationSchema}
      render={props => (
        <Configuration
          {...props}
          configs={configs}
          environments={environments}
          setEnvironments={setEnvironments}
        />
      )}
    />
  );
};
render(ConfigurationExtensionView);
