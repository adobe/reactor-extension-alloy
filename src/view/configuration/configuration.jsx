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
import React, { useState } from "react";
import { object, array, string, number, lazy } from "yup";
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
import { Accordion, AccordionItem } from "@react/react-spectrum/Accordion";
import CheckboxList from "../components/checkboxList";
import "@react/react-spectrum/Form"; // needed for spectrum form styles
import render from "../render";
import WrappedField from "../components/wrappedField";
import ExtensionView from "../components/extensionView";
import EditorButton from "../components/editorButton";
import InfoTipLayout from "../components/infoTipLayout";
import copyPropertiesIfNotDefault from "./utils/copyPropertiesIfNotDefault";
import singleDataElementRegex from "../constants/singleDataElementRegex";
import "./configuration.styl";

const contextGranularityEnum = {
  ALL: "all",
  SPECIFIC: "specific"
};
const contextOptions = ["web", "device", "environment", "placeContext"];

const getInstanceDefaults = initInfo => ({
  name: "alloy",
  configId: "",
  imsOrgId: initInfo.company.orgId,
  edgeDomain: "beta.adobedc.net",
  errorsEnabled: true,
  optInEnabled: false,
  idSyncEnabled: true,
  idSyncContainerId: "",
  urlDestinationsEnabled: true,
  cookieDestinationsEnabled: true,
  prehidingStyle: "",
  contextGranularity: contextGranularityEnum.ALL,
  context: contextOptions,
  migrateIds: false
});

const createDefaultInstance = initInfo =>
  JSON.parse(JSON.stringify(getInstanceDefaults(initInfo)));

const getInitialValues = ({ initInfo }) => {
  const instanceDefaults = getInstanceDefaults(initInfo);
  let { instances } = initInfo.settings || {};

  if (instances) {
    instances.forEach(instance => {
      if (instance.context) {
        instance.contextGranularity = contextGranularityEnum.SPECIFIC;
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
};

const getSettings = ({ values, initInfo }) => {
  const instanceDefaults = getInstanceDefaults(initInfo);
  return {
    instances: values.instances.map(instance => {
      const trimmedInstance = {
        name: instance.name
      };

      copyPropertiesIfNotDefault(trimmedInstance, instance, instanceDefaults, [
        "configId",
        "imsOrgId",
        "edgeDomain",
        "errorsEnabled",
        "optInEnabled",
        "idSyncEnabled",
        "urlDestinationsEnabled",
        "cookieDestinationsEnabled",
        "prehidingStyle",
        "migrateIds"
      ]);

      if (
        instance.idSyncEnabled &&
        instance.idSyncContainerId !== instanceDefaults.idSyncContainerId
      ) {
        trimmedInstance.idSyncContainerId = instance.idSyncContainerId;

        // trimmedInstance.idSyncContainerId is most likely a string at this point. If
        // the value represents a number, we need to cast to a number.
        if (number().isValidSync(trimmedInstance.idSyncContainerId)) {
          trimmedInstance.idSyncContainerId = Number(
            trimmedInstance.idSyncContainerId
          );
        }
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

const idSyncContainerIdValidationMessage =
  "Please specify a non-negative integer or data element for the container ID.";

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
        configId: string().required("Please specify a config ID."),
        imsOrgId: string().required("Please specify an IMS organization ID."),
        edgeDomain: string().required("Please specify an edge domain."),
        // A valid idSyncContainerId field value can be an integer
        // greater than or equal to 0, an empty string, or a string containing
        // a single data element token. Using `lazy` as we've done
        // here is the suggested way of handling a value that can be two
        // different types (number and string):
        // https://github.com/jquense/yup/issues/321
        idSyncContainerId: lazy(value => {
          let validator;
          if (number().isValidSync(value)) {
            validator = number().when("idSyncEnabled", {
              is: true,
              then: number()
                .integer(idSyncContainerIdValidationMessage)
                // convert empty string to a 0 so it doesn't fail subsequent rules
                .min(0, idSyncContainerIdValidationMessage)
            });
          } else {
            validator = string().when("idSyncEnabled", {
              is: true,
              then: string().matches(singleDataElementRegex, {
                message: idSyncContainerIdValidationMessage,
                excludeEmptyString: true
              })
            });
          }
          return validator;
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
      "configId",
      "Please provide a config ID unique from those used for other instances."
    );
  })
  // TestCafe doesn't allow this to be an arrow function because of
  // how it scopes "this".
  // eslint-disable-next-line func-names
  .test("uniqueImsOrgId", function(settings) {
    return validateDuplicateValue(
      this.createError.bind(this),
      settings.instances,
      "imsOrgId",
      "Please provide an IMS Organization ID unique from those used for other instances."
    );
  });

const Configuration = () => {
  const [selectedAccordionIndex, setSelectedAccordionIndex] = useState();
  const [isFirstExtensionViewRender, setIsFirstExtensionViewRender] = useState(
    true
  );

  return (
    <ExtensionView
      getInitialValues={getInitialValues}
      getSettings={getSettings}
      validationSchema={validationSchema}
      render={({ formikProps, initInfo }) => {
        const {
          values,
          errors,
          isSubmitting,
          isValidating,
          setFieldValue,
          initialValues
        } = formikProps;

        // Only expand the first accordion item if there's one instance because
        // users may get disoriented if we automatically expand the first item
        // when there are multiple instances.
        if (isFirstExtensionViewRender && values.instances.length === 1) {
          setSelectedAccordionIndex(0);
        }

        // If the user just tried to save the configuration and there's
        // a validation error, make sure the first accordion item containing
        // an error is shown.
        if (isSubmitting && !isValidating && errors && errors.instances) {
          const instanceIndexContainingErrors = errors.instances.findIndex(
            instance => instance
          );
          setSelectedAccordionIndex(instanceIndexContainingErrors);
        }

        setIsFirstExtensionViewRender(false);

        return (
          <div>
            <FieldArray
              name="instances"
              render={arrayHelpers => {
                return (
                  <div>
                    <div className="u-alignRight">
                      <Button
                        label="Add Instance"
                        onClick={() => {
                          arrayHelpers.push(createDefaultInstance(initInfo));
                          setSelectedAccordionIndex(values.instances.length);
                        }}
                      />
                    </div>
                    <Accordion
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
                                id="nameField"
                                name={`instances.${index}.name`}
                                component={Textfield}
                                componentClassName="u-fieldLong"
                                supportDataElement
                              />
                            </div>
                            {// If we're editing an existing configuration and the name changes.
                            initInfo.settings &&
                            initialValues.instances[0].name !==
                              values.instances[0].name ? (
                              <Alert
                                id="nameChangeAlert"
                                className="ConstrainedAlert"
                                header="Potential Problems Due to Name Change"
                                variant="warning"
                              >
                                Any rule components or data elements using this
                                instance will no longer function as expected
                                when running on your website. We recommend
                                removing or updating those resources before
                                publishing your next library.
                              </Alert>
                            ) : null}
                            <div />
                          </div>
                          <div className="u-gapTop">
                            <InfoTipLayout tip="Your assigned config ID, which links the SDK to the appropriate accounts and configuration.">
                              <FieldLabel
                                labelFor="configIdField"
                                label="Config ID"
                              />
                            </InfoTipLayout>
                            <div>
                              <WrappedField
                                id="configIdField"
                                name={`instances.${index}.configId`}
                                component={Textfield}
                                componentClassName="u-fieldLong"
                                supportDataElement
                              />
                            </div>
                          </div>
                          <div className="u-gapTop">
                            <InfoTipLayout tip="Your assigned Experience Cloud organization ID.">
                              <FieldLabel
                                labelFor="imsOrgIdField"
                                label="IMS Organization ID"
                              />
                            </InfoTipLayout>
                            <div>
                              <WrappedField
                                id="imsOrgIdField"
                                name={`instances.${index}.imsOrgId`}
                                component={Textfield}
                                componentClassName="u-fieldLong"
                                supportDataElement
                              />
                              <Button
                                id="imsOrgIdRestoreButton"
                                label="Restore to default"
                                onClick={() => {
                                  const instanceDefaults = getInstanceDefaults(
                                    initInfo
                                  );
                                  setFieldValue(
                                    `instances.${index}.imsOrgId`,
                                    instanceDefaults.imsOrgId
                                  );
                                }}
                                quiet
                                variant="quiet"
                              />
                            </div>
                          </div>
                          <div className="u-gapTop">
                            <InfoTipLayout
                              tip="The domain that will be used to interact with
                              Adobe Services. This should only be changed if you
                              have a first party domain (CNAME) that proxies
                              requests to Adobe's edge infrastructure."
                            >
                              <FieldLabel
                                labelFor="edgeDomainField"
                                label="Edge Domain"
                              />
                            </InfoTipLayout>
                            <div>
                              <WrappedField
                                id="edgeDomainField"
                                name={`instances.${index}.edgeDomain`}
                                component={Textfield}
                                componentClassName="u-fieldLong"
                                supportDataElement
                              />
                              <Button
                                id="edgeDomainRestoreButton"
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
                                variant="quiet"
                              />
                            </div>
                          </div>
                          <div className="u-gapTop">
                            <InfoTipLayout tip="Allows uncaught errors to be displayed in the console.">
                              <WrappedField
                                name={`instances.${index}.errorsEnabled`}
                                component={Checkbox}
                                label="Enable errors"
                              />
                            </InfoTipLayout>
                          </div>

                          <h3>Privacy</h3>

                          <div className="u-gapTop">
                            <InfoTipLayout tip="Queues privacy-sensitive work until the user opts in.">
                              <WrappedField
                                name={`instances.${index}.optInEnabled`}
                                component={Checkbox}
                                label="Enable Opt-In"
                              />
                            </InfoTipLayout>
                          </div>

                          <h3>Identity</h3>

                          <div className="u-gapTop">
                            <InfoTipLayout tip="Sends requests to third-party URLs to synchronize the Adobe unique user ID with the unique user ID of a third-party data source.">
                              <WrappedField
                                name={`instances.${index}.idSyncEnabled`}
                                component={Checkbox}
                                label="Enable ID Synchronization"
                              />
                            </InfoTipLayout>
                          </div>
                          
                          {values.instances[index].idSyncEnabled ? (
                            <div className="FieldSubset u-gapTop">
                              <InfoTipLayout tip="The container ID that specifies which ID syncs will be fired. This can be obtained from your Adobe consultant.">
                                <FieldLabel
                                  labelFor="idSyncContainerIdField"
                                  label="ID Synchronization Container ID (optional)"
                                />
                              </InfoTipLayout>
                              <div>
                                <WrappedField
                                  id="idSyncContainerIdField"
                                  name={`instances.${index}.idSyncContainerId`}
                                  component={Textfield}
                                  componentClassName="u-fieldLong"
                                  supportDataElement
                                />
                              </div>
                            </div>
                          ) : null}

                            <div className="u-gapTop">
                            <InfoTipLayout tip="Copy id from a previous version of experience cloud ID service.">
                              <WrappedField
                                name={`instances.${index}.migrateIds`}
                                component={Checkbox}
                                label="Migrate Ids from VisitorAPI"
                              />
                            </InfoTipLayout>
                          </div>

                          <h3>Audiences</h3>

                          <div className="u-gapTop">
                            <InfoTipLayout tip="Enables URL destinations, which allows the firing of URLs based on segment qualification.">
                              <WrappedField
                                name={`instances.${index}.urlDestinationsEnabled`}
                                component={Checkbox}
                                label="Enable URL Destinations"
                              />
                            </InfoTipLayout>
                          </div>

                          <div className="u-gapTop">
                            <InfoTipLayout tip="Enables cookie destinations, which allows the setting of cookies based on segment qualification.">
                              <WrappedField
                                name={`instances.${index}.cookieDestinationsEnabled`}
                                component={Checkbox}
                                label="Enable cookie Destinations"
                              />
                            </InfoTipLayout>
                          </div>

                          <h3>Personalization</h3>

                          <div className="u-gapTop">
                            <InfoTipLayout tip="A CSS style definition that will hide content areas of your web page while personalized content is loaded from the server.">
                              <FieldLabel
                                labelFor="prehidingStyleField"
                                label="Prehiding Style (optional)"
                              />
                            </InfoTipLayout>
                            <div>
                              <WrappedField
                                id="prehidingStyleField"
                                name={`instances.${index}.prehidingStyle`}
                                component={EditorButton}
                                language="css"
                              />
                            </div>
                          </div>

                          <h3>Context</h3>

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
                                value={contextGranularityEnum.ALL}
                                label="all context information"
                              />
                              <Radio
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

                          <div className="u-gapTop2x">
                            <ModalTrigger>
                              <Button
                                id="deleteButton"
                                label="Delete Instance"
                                icon={<Delete />}
                                variant="action"
                                disabled={values.instances.length === 1}
                              />
                              {values.instances.length === 1 ? (
                                <span className="Note u-gapLeft">
                                  You must have at least one instance to use
                                  this extension.
                                </span>
                              ) : null}
                              <Dialog
                                onConfirm={() => {
                                  arrayHelpers.remove(index);
                                  setSelectedAccordionIndex(0);
                                }}
                                title="Resource Usage"
                                confirmLabel="Delete"
                                cancelLabel="Cancel"
                              >
                                Any rule components or data elements using this
                                instance will no longer function as expected
                                when running on your website. We recommend
                                removing these resources or switching them to
                                use a different instance before publishing your
                                next library. Would you like to proceed?
                              </Dialog>
                            </ModalTrigger>
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
      }}
    />
  );
};

render(Configuration);
