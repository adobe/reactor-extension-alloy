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
import { object, array, string, number } from "yup";
import { FieldArray } from "formik";
import Textfield from "@react/react-spectrum/Textfield";
import RadioGroup from "@react/react-spectrum/RadioGroup";
import Radio from "@react/react-spectrum/Radio";
import Checkbox from "@react/react-spectrum/Checkbox";
import Button from "@react/react-spectrum/Button";
import ModalTrigger from "@react/react-spectrum/ModalTrigger";
import Dialog from "@react/react-spectrum/Dialog";
import Delete from "@react/react-spectrum/Icon/Delete";
import { Accordion, AccordionItem } from "@react/react-spectrum/Accordion";
import CheckboxList from "../components/checkboxList";
import "@react/react-spectrum/Form"; // needed for spectrum form styles
import render from "../render";
import WrappedField from "../components/wrappedField";
import ExtensionView from "../components/extensionView";
import EditorButton from "../components/editorButton";
import copyPropertiesIfNotDefault from "./utils/copyPropertiesIfNotDefault";
import "./configuration.styl";

const contextGranularityEnum = {
  ALL: "all",
  SPECIFIC: "specific"
};
const contextOptions = ["web", "device", "environment", "placeContext"];

const instanceDefaults = {
  name: "alloy",
  propertyId: "",
  edgeDomain: "",
  errorsEnabled: true,
  optInEnabled: false,
  idSyncEnabled: true,
  idSyncContainerId: "",
  destinationsEnabled: true,
  prehidingStyle: "",
  contextGranularity: contextGranularityEnum.ALL,
  context: contextOptions
};

const createDefaultInstance = () =>
  JSON.parse(JSON.stringify(instanceDefaults));

const getInitialValues = initInfo => {
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
    instances = [createDefaultInstance()];
  }

  return {
    instances
  };
};

const getSettings = values => {
  return {
    instances: values.instances.map(instance => {
      const trimmedInstance = {
        name: instance.name,
        propertyId: instance.propertyId
      };

      copyPropertiesIfNotDefault(trimmedInstance, instance, instanceDefaults, [
        "edgeDomain",
        "errorsEnabled",
        "optInEnabled",
        "idSyncEnabled",
        "idSyncContainerId",
        "destinationsEnabled",
        "prehidingStyle"
      ]);

      if (trimmedInstance.idSyncContainerId !== undefined) {
        trimmedInstance.idSyncContainerId = Number(
          trimmedInstance.idSyncContainerId
        );
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
  "Please specify an non-negative integer for the container ID.";

const validationSchema = object()
  .shape({
    instances: array().of(
      object().shape({
        name: string().required("Please specify a name."),
        propertyId: string().required("Please specify a property ID."),
        idSyncContainerId: number()
          // convert empty string to a 0 so it doesn't fail subsequent rules
          .transform(value => value || 0)
          .typeError(idSyncContainerIdValidationMessage)
          .integer(idSyncContainerIdValidationMessage)
          .min(0, idSyncContainerIdValidationMessage)
      })
    )
  })
  // TestCafe doesn't allow this to be an arrow function because of
  // how it scopes "this".
  // eslint-disable-next-line func-names
  .test("name", function(settings) {
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
  .test("propertyId", function(settings) {
    return validateDuplicateValue(
      this.createError.bind(this),
      settings.instances,
      "propertyId",
      "Please provide a property ID unique from those used for other instances."
    );
  });

const Configuration = () => {
  const [selectedAccordionIndex, setSelectedAccordionIndex] = useState(0);

  return (
    <ExtensionView
      getInitialValues={getInitialValues}
      getSettings={getSettings}
      validationSchema={validationSchema}
      render={({ formikProps }) => {
        const { values, errors, isSubmitting, isValidating } = formikProps;

        // If the user just tried to save the configuration and there's
        // a validation error, make sure the first accordion item containing
        // an error is shown.
        if (isSubmitting && !isValidating && errors && errors.instances) {
          const instanceIndexContainingErrors = errors.instances.findIndex(
            instance => instance
          );
          setSelectedAccordionIndex(instanceIndexContainingErrors);
        }

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
                          arrayHelpers.push(createDefaultInstance());
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
                            <label
                              htmlFor="nameField"
                              className="spectrum-Form-itemLabel"
                            >
                              Name (will also be used to create a global method
                              on window)
                            </label>
                            <div>
                              <WrappedField
                                id="nameField"
                                name={`instances.${index}.name`}
                                component={Textfield}
                                componentClassName="u-fieldLong"
                                supportDataElement
                              />
                            </div>
                          </div>
                          <div className="u-gapTop">
                            <label
                              htmlFor="propertyIdField"
                              className="spectrum-Form-itemLabel"
                            >
                              Property ID
                            </label>
                            <div>
                              <WrappedField
                                id="propertyIdField"
                                name={`instances.${index}.propertyId`}
                                component={Textfield}
                                componentClassName="u-fieldLong"
                              />
                            </div>
                          </div>
                          <div className="u-gapTop">
                            <label
                              htmlFor="edgeDomainField"
                              className="spectrum-Form-itemLabel"
                            >
                              Edge Domain (optional)
                            </label>
                            <div>
                              <WrappedField
                                id="edgeDomainField"
                                name={`instances.${index}.edgeDomain`}
                                component={Textfield}
                                componentClassName="u-fieldLong"
                                supportDataElement
                              />
                            </div>
                          </div>
                          <div className="u-gapTop">
                            <WrappedField
                              name={`instances.${index}.errorsEnabled`}
                              component={Checkbox}
                              label="Enable errors"
                            />
                          </div>

                          <h3>Privacy</h3>

                          <div className="u-gapTop">
                            <WrappedField
                              name={`instances.${index}.optInEnabled`}
                              component={Checkbox}
                              label="Enable Opt-In"
                            />
                          </div>

                          <h3>Identity</h3>

                          <div className="u-gapTop">
                            <WrappedField
                              name={`instances.${index}.idSyncEnabled`}
                              component={Checkbox}
                              label="Enable ID Synchronization"
                            />
                          </div>

                          <div className="u-gapTop">
                            <label
                              htmlFor="idSyncContainerIdField"
                              className="spectrum-Form-itemLabel"
                            >
                              ID Synchronization Container ID
                            </label>
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

                          <h3>Audiences</h3>

                          <div className="u-gapTop">
                            <WrappedField
                              name={`instances.${index}.destinationsEnabled`}
                              component={Checkbox}
                              label="Enable Destinations"
                            />
                          </div>

                          <h3>Personalization</h3>

                          <div className="u-gapTop">
                            <label
                              htmlFor="prehidingStyleField"
                              className="spectrum-Form-itemLabel"
                            >
                              Prehiding Style (optional)
                            </label>
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
                            <label
                              htmlFor="contextGranularityField"
                              className="spectrum-Form-itemLabel"
                            >
                              When sending event data, automatically include:
                            </label>
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

                          {values.instances.length > 1 ? (
                            <div className="u-gapTop2x">
                              <ModalTrigger>
                                <Button
                                  data-test-id={`instances.${index}.delete`}
                                  label="Delete Instance"
                                  icon={<Delete />}
                                  variant="action"
                                />
                                <Dialog
                                  onConfirm={() => {
                                    arrayHelpers.remove(index);
                                    setSelectedAccordionIndex(0);
                                  }}
                                  title="Resource Usage"
                                  confirmLabel="OK"
                                  cancelLabel="Cancel"
                                >
                                  Any rule components or data elements using
                                  this instance will no longer function as
                                  expected when running on your website. We
                                  recommend removing these resources before
                                  publishing your next library. Would you like
                                  to proceed?
                                </Dialog>
                              </ModalTrigger>
                            </div>
                          ) : null}
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
