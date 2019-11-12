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
import React from "react";
import { array, object, string } from "yup";
import { FieldArray } from "formik";
import Textfield from "@react/react-spectrum/Textfield";
import Checkbox from "@react/react-spectrum/Checkbox";
import Select from "@react/react-spectrum/Select";
import FieldLabel from "@react/react-spectrum/FieldLabel";
import Button from "@react/react-spectrum/Button";
import Well from "@react/react-spectrum/Well";
import Heading from "@react/react-spectrum/Heading";
import Delete from "@react/react-spectrum/Icon/Delete";
import ModalTrigger from "@react/react-spectrum/ModalTrigger";
import Dialog from "@react/react-spectrum/Dialog";
import "@react/react-spectrum/Form"; // needed for spectrum form styles
import render from "../render";
import WrappedField from "../components/wrappedField";
import ExtensionView from "../components/extensionView";
import authenticatedStateOptions from "../constants/authenticatedStateOptions";
import "./setCustomerIds.styl";
import InfoTipLayout from "../components/infoTipLayout";
import getCustomerIdNamespaceOptions from "../utils/getCustomerIdNamespaceOptions";

const createDefaultCustomerId = () => {
  return {
    namespace: "",
    id: "",
    authenticatedState: "",
    primary: false,
    hash: false
  };
};

const getInitialValues = ({ initInfo }) => {
  const { instanceName = initInfo.extensionSettings.instances[0].name } =
    initInfo.settings || {};

  return {
    instanceName,
    customerIds: (initInfo.settings && initInfo.settings.customerIds) || [
      createDefaultCustomerId()
    ]
  };
};

const getSettings = ({ values }) => {
  return values;
};

const validationSchema = object().shape({
  instanceName: string().required("Please specify an instance name."),
  customerIds: array().of(
    object().shape({
      namespace: string().required("Please select a namespace."),
      id: string().required("Please specify an ID."),
      authenticatedState: string().required(
        "Please select an authenticated state."
      )
    })
  )
});

let customerIdNamespaceOptions = [];

getCustomerIdNamespaceOptions().then(options => {
  customerIdNamespaceOptions = options;
});

/*
const extensionSettings = {
  "instances": [
    {
      "name": "willi1",
      "configId": "8888888"
    },
    {
      "name": "willi2",
      "configId": "9999999"
    }
  ]
};

const settings = {
  "instanceName": "willi1",
  "customerIds": [
    {
      "namespace": "ECID",
      "id": "wvg",
      "authenticatedState": "loggedOut",
      "primary": false,
      "hash": true
    }
  ]
};

const normalizedObj = {
  email: {
    id: "tester",
    authenticatedState: LOGGED_OUT,
    primary: true
  },
  crm: {
    id: "1234",
    authenticatedState: AMBIGUOUS
  },
  custom: {
    id: "abc",
    primary: false,
    authenticatedState: AMBIGUOUS
  }
};
*/

const setCustomerIds = () => {
  return (
    <ExtensionView
      getInitialValues={getInitialValues}
      getSettings={getSettings}
      validationSchema={validationSchema}
      render={({ formikProps }) => {
        const { values } = formikProps;
        return (
          <React.Fragment>
            <InfoTipLayout tip="Tip">
              <FieldLabel labelFor="instanceName" label="Instance" />
            </InfoTipLayout>
            <div>
              <WrappedField
                id="instanceName"
                name="instanceName"
                component={Textfield}
                componentClassName="u-fieldLong"
                supportDataElement
              />
            </div>
            <FieldArray
              name="customerIds"
              render={arrayHelpers => {
                return (
                  <React.Fragment>
                    <div className="u-gapTop u-alignRight">
                      <Button
                        label="Add Customer ID"
                        onClick={() => {
                          arrayHelpers.push(createDefaultCustomerId());
                        }}
                      />
                    </div>
                    {((Array.isArray(values.customerIds) &&
                      values.customerIds.length) ||
                      null) && (
                      <Heading variant="subtitle2">Customer IDs</Heading>
                    )}
                    <div>
                      {((Array.isArray(values.customerIds) &&
                        values.customerIds.length) ||
                        null) &&
                        values.customerIds.map((customerId, index) => (
                          <Well key={index}>
                            <div>
                              <InfoTipLayout tip="Tip">
                                <FieldLabel
                                  labelFor="namespaceField"
                                  label="Namespace"
                                />
                              </InfoTipLayout>
                              <div>
                                <WrappedField
                                  id="namespaceField"
                                  name={`customerIds.${index}.namespace`}
                                  component={Select}
                                  componentClassName="u-fieldLong"
                                  options={customerIdNamespaceOptions}
                                  supportDataElement
                                />
                              </div>
                            </div>
                            <div className="u-gapTop">
                              <InfoTipLayout tip="Tip">
                                <FieldLabel labelFor="idField" label="ID" />
                              </InfoTipLayout>
                              <div>
                                <WrappedField
                                  id="idField"
                                  name={`customerIds.${index}.id`}
                                  component={Textfield}
                                  componentClassName="u-fieldLong"
                                  supportDataElement
                                />
                              </div>
                            </div>
                            <div className="u-gapTop">
                              <InfoTipLayout tip="Tip">
                                <WrappedField
                                  name={`customerIds.${index}.hash`}
                                  component={Checkbox}
                                  label="Convert ID to sha256 hash"
                                  supportDataElement
                                />
                              </InfoTipLayout>
                            </div>
                            <div className="u-gapTop">
                              <InfoTipLayout tip="Tip">
                                <FieldLabel
                                  labelFor="authenticatedStateField"
                                  label="Authenticated State"
                                />
                              </InfoTipLayout>
                              <div>
                                <WrappedField
                                  id="authenticatedStateField"
                                  name={`customerIds.${index}.authenticatedState`}
                                  component={Select}
                                  componentClassName="u-fieldLong"
                                  options={authenticatedStateOptions}
                                  supportDataElement
                                />
                              </div>
                            </div>
                            <div className="u-gapTop">
                              <InfoTipLayout tip="Tip">
                                <WrappedField
                                  name={`customerIds.${index}.primary`}
                                  component={Checkbox}
                                  label="Primary"
                                  supportDataElement
                                />
                              </InfoTipLayout>
                            </div>
                            <div className="u-gapTop u-alignRight">
                              <ModalTrigger>
                                <Button
                                  id="deleteButton"
                                  icon={<Delete />}
                                  variant="action"
                                />
                                <Dialog
                                  title="Delete Customer ID"
                                  onConfirm={() => {
                                    arrayHelpers.remove(index);
                                  }}
                                  confirmLabel="Delete"
                                  cancelLabel="Cancel"
                                >
                                  Would you like to proceed?
                                </Dialog>
                              </ModalTrigger>
                            </div>
                          </Well>
                        ))}
                    </div>
                  </React.Fragment>
                );
              }}
            />
          </React.Fragment>
        );
      }}
    />
  );
};

render(setCustomerIds);
