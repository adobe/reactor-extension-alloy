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
import Button from "@react/react-spectrum/Button";
import ModalTrigger from "@react/react-spectrum/ModalTrigger";
import Dialog from "@react/react-spectrum/Dialog";
import Delete from "@react/react-spectrum/Icon/Delete";
import { Accordion, AccordionItem } from "@react/react-spectrum/Accordion";
import "@react/react-spectrum/Form"; // needed for spectrum form styles
import render from "../render";
import WrappedField from "../components/wrappedField";
import ExtensionView from "../components/extensionView";
import "./configuration.styl";

const createEmptyAccount = () => ({
  propertyID: "",
  instanceName: "alloy",
  edgeDomain: ""
});

const getInitialValues = settings => {
  // settings is null if the user is creating a new rule component
  if (!settings) {
    settings = {};
  }

  return {
    accounts: settings.accounts || [createEmptyAccount()]
  };
};

const getSettings = values => {
  return {
    accounts: values.accounts.map(account => {
      const trimmedAccount = {
        propertyID: account.propertyID,
        instanceName: account.instanceName
      };

      if (account.edgeDomain) {
        trimmedAccount.edgeDomain = account.edgeDomain;
      }

      return trimmedAccount;
    })
  };
};

const validationSchema = object()
  .shape({
    accounts: array().of(
      object().shape({
        propertyID: string().required("Please specify a property ID."),
        instanceName: string().required("Please specify an instance name."),
        edgeDomain: string()
      })
    )
  })
  .test("instanceName", function(value) {
    const instanceNames = value.accounts.map(account => account.instanceName);
    const duplicateIndex = instanceNames.findIndex(
      (instanceName, index) => instanceNames.indexOf(instanceName) < index
    );

    return (
      duplicateIndex === -1 ||
      this.createError({
        path: `accounts[${duplicateIndex}].instanceName`,
        message:
          "Please provide an instance name unique from those used for other accounts."
      })
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
                          arrayHelpers.push(createEmptyAccount());
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
                          header={account.propertyID || "untitled"}
                        >
                          <div>
                            <label
                              htmlFor="propertyIDField"
                              className="spectrum-Form-itemLabel"
                            >
                              Property ID
                            </label>
                            <div>
                              <WrappedField
                                id="propertyIDField"
                                name={`accounts.${index}.propertyID`}
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
                          {values.accounts.length > 1 ? (
                            <div className="u-gapTop2x">
                              <ModalTrigger>
                                <Button
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
