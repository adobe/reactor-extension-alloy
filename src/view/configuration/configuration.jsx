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
import { object, array, string } from "yup";
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
import "./configuration.styl";

const contextGranularity = {
  ALL: "all",
  SPECIFIC: "specific"
};
const contextOptions = ["web", "device", "environment", "placeContext"];

const accountDefaults = {
  propertyId: "",
  instanceName: "alloy",
  edgeDomain: "",
  errorsEnabled: true,
  optInEnabled: false,
  idSyncsEnabled: true,
  destinationsEnabled: true,
  contextGranularity: contextGranularity.ALL,
  context: contextOptions
};

const createDefaultAccount = () => JSON.parse(JSON.stringify(accountDefaults));

const getInitialValues = settings => {
  // settings is null if the user is creating a new rule component
  if (!settings) {
    settings = {};
  }

  let { accounts } = settings;

  if (accounts) {
    accounts.forEach(account => {
      if (account.context) {
        account.contextGranularity = contextGranularity.SPECIFIC;
      }

      // Copy default values to the account if the properties
      // aren't already defined on the account. This is primarily
      // because Formik requires all fields to have initial values.
      Object.keys(accountDefaults).forEach(key => {
        if (account[key] === undefined) {
          account[key] = accountDefaults[key];
        }
      });
    });
  } else {
    accounts = [createDefaultAccount()];
  }

  return {
    accounts
  };
};

const getSettings = values => {
  return {
    accounts: values.accounts.map(account => {
      const trimmedAccount = {
        propertyId: account.propertyId,
        instanceName: account.instanceName
      };

      if (account.edgeDomain) {
        trimmedAccount.edgeDomain = account.edgeDomain;
      }

      if (account.errorsEnabled !== accountDefaults.errorsEnabled) {
        trimmedAccount.errorsEnabled = account.errorsEnabled;
      }

      if (account.optInEnabled !== accountDefaults.optInEnabled) {
        trimmedAccount.optInEnabled = account.optInEnabled;
      }

      if (account.idSyncsEnabled !== accountDefaults.idSyncsEnabled) {
        trimmedAccount.idSyncsEnabled = account.idSyncsEnabled;
      }

      if (account.destinationsEnabled !== accountDefaults.destinationsEnabled) {
        trimmedAccount.destinationsEnabled = account.destinationsEnabled;
      }

      if (account.contextGranularity === contextGranularity.SPECIFIC) {
        trimmedAccount.context = account.context;
      }

      return trimmedAccount;
    })
  };
};

const validateDuplicateValue = (createError, accounts, key, message) => {
  const values = accounts.map(account => account[key]);
  const duplicateIndex = values.findIndex(
    (value, index) => values.indexOf(value) < index
  );

  return (
    duplicateIndex === -1 ||
    createError({
      path: `accounts[${duplicateIndex}].${key}`,
      message
    })
  );
};

const validationSchema = object()
  .shape({
    accounts: array().of(
      object().shape({
        propertyId: string().required("Please specify a property ID."),
        instanceName: string().required("Please specify an instance name.")
      })
    )
  })
  // TestCafe doesn't allow this to be an arrow function because of
  // how it scopes "this".
  .test("propertyId", function(settings) {
    return validateDuplicateValue(
      this.createError.bind(this),
      settings.accounts,
      "propertyId",
      "Please provide a property ID unique from those used for other accounts."
    );
  })
  // TestCafe doesn't allow this to be an arrow function because of
  // how it scopes "this".
  .test("instanceName", function(settings) {
    return validateDuplicateValue(
      this.createError.bind(this),
      settings.accounts,
      "instanceName",
      "Please provide an instance name unique from those used for other accounts."
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
        if (isSubmitting && !isValidating && errors && errors.accounts) {
          const accountIndexContainingErrors = errors.accounts.findIndex(
            account => account
          );
          setSelectedAccordionIndex(accountIndexContainingErrors);
        }

        return (
          <div>
            <FieldArray
              name="accounts"
              render={arrayHelpers => {
                return (
                  <div>
                    <div className="u-alignRight">
                      <Button
                        label="Add Account"
                        onClick={() => {
                          arrayHelpers.push(createDefaultAccount());
                          setSelectedAccordionIndex(values.accounts.length);
                        }}
                      />
                    </div>
                    <Accordion
                      selectedIndex={selectedAccordionIndex}
                      className="u-gapTop2x"
                      onChange={setSelectedAccordionIndex}
                    >
                      {values.accounts.map((account, index) => (
                        <AccordionItem
                          key={index}
                          header={account.propertyId || "untitled account"}
                        >
                          <div>
                            <label
                              htmlFor="propertyIdField"
                              className="spectrum-Form-itemLabel"
                            >
                              Property ID
                            </label>
                            <div>
                              <WrappedField
                                id="propertyIdField"
                                name={`accounts.${index}.propertyId`}
                                component={Textfield}
                                componentClassName="u-fieldLong"
                              />
                            </div>
                          </div>
                          <div className="u-gapTop">
                            <label
                              htmlFor="instanceNameField"
                              className="spectrum-Form-itemLabel"
                            >
                              Instance Name
                            </label>
                            <div>
                              <WrappedField
                                id="instanceNameField"
                                name={`accounts.${index}.instanceName`}
                                component={Textfield}
                                componentClassName="u-fieldLong"
                                supportDataElement
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
                                name={`accounts.${index}.edgeDomain`}
                                component={Textfield}
                                componentClassName="u-fieldLong"
                                supportDataElement
                              />
                            </div>
                          </div>
                          <div className="u-gapTop">
                            <WrappedField
                              name={`accounts.${index}.errorsEnabled`}
                              component={Checkbox}
                              label="Enable errors"
                            />
                          </div>

                          <h3>Privacy</h3>

                          <div className="u-gapTop">
                            <WrappedField
                              name={`accounts.${index}.optInEnabled`}
                              component={Checkbox}
                              label="Enable Opt-In"
                            />
                          </div>

                          <h3>Identity</h3>

                          <div className="u-gapTop">
                            <WrappedField
                              name={`accounts.${index}.idSyncsEnabled`}
                              component={Checkbox}
                              label="Enable ID Synchronization"
                            />
                          </div>
                          <div className="u-gapTop">
                            <WrappedField
                              name={`accounts.${index}.destinationsEnabled`}
                              component={Checkbox}
                              label="Enable Destinations"
                            />
                          </div>

                          <h3>Context</h3>

                          <div className="u-gapTop">
                            <label
                              htmlFor="contextGranularity"
                              className="spectrum-Form-itemLabel"
                            >
                              When sending event data, automatically include:
                            </label>
                            <WrappedField
                              name={`accounts.${index}.contextGranularity`}
                              component={RadioGroup}
                              componentClassName="u-flexColumn"
                            >
                              <Radio
                                value={contextGranularity.ALL}
                                label="all context information"
                              />
                              <Radio
                                value={contextGranularity.SPECIFIC}
                                label="specific context information"
                              />
                            </WrappedField>
                          </div>
                          {values.accounts[index].contextGranularity ===
                          contextGranularity.SPECIFIC ? (
                            <div className="FieldSubset u-gapTop">
                              <WrappedField
                                name={`accounts.${index}.context`}
                                component={CheckboxList}
                                options={contextOptions}
                              />
                            </div>
                          ) : null}

                          {values.accounts.length > 1 ? (
                            <div className="u-gapTop2x">
                              <ModalTrigger>
                                <Button
                                  data-test-id={`accounts.${index}.delete`}
                                  label="Delete Account"
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
                                  this account will no longer function as
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
