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
import { object, string } from "yup";
import { FieldArray } from "formik";
import Textfield from "@react/react-spectrum/Textfield";
import Checkbox from "@react/react-spectrum/Checkbox";
import Select from "@react/react-spectrum/Select";
import FieldLabel from "@react/react-spectrum/FieldLabel";
import Button from "@react/react-spectrum/Button";
import Well from "@react/react-spectrum/Well";
import "@react/react-spectrum/Form"; // needed for spectrum form styles
import render from "../render";
import WrappedField from "../components/wrappedField";
import ExtensionView from "../components/extensionView";
import getInstanceOptions from "../utils/getInstanceOptions";
import authenticatedStateOptions from "../constants/authenticatedStateOptions";
import "./setCustomerIds.styl";
import InfoTipLayout from "../components/infoTipLayout";

const getInitialValues = ({ initInfo }) => {
  const { instanceName = initInfo.extensionSettings.instances[0].name } =
    initInfo.settings || {};

  return {
    instanceName
  };
};

const getSettings = ({ values }) => {
  const settings = {
    instanceName: values.instanceName
  };

  return settings;
};

const validationSchema = object().shape({
  xdm: string().matches(/^%[^%]+%$/, "Please specify a data element")
});

const values = {
  instances: [
    {
      name: "alloy",
      configId: "99999999"
    },
    {
      name: "alloy2",
      configId: "8888888"
    }
  ]
};

/*
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
      render={({ initInfo }) => {
        return (
          <div>
            <div>
              <FieldLabel labelFor="instanceNameField" label="Instance" />
              <div>
                <WrappedField
                  id="instanceNameField"
                  name="instanceName"
                  component={Select}
                  componentClassName="u-fieldLong"
                  options={getInstanceOptions(initInfo)}
                />
              </div>
            </div>
            <div>
              <FieldArray
                name="instances"
                render={() => {
                  return (
                    <div>
                      <div className="u-alignRight">
                        <Button label="Add Item" onClick={() => {}} />
                      </div>
                      {values.instances.map((instance, index) => (
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
                                name={`instances.${index}.namespace`}
                                component={Textfield}
                                componentClassName="u-fieldLong"
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
                                name={`instances.${index}.id`}
                                component={Textfield}
                                componentClassName="u-fieldLong"
                                supportDataElement
                              />
                            </div>
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
                                name="authenticatedState"
                                component={Select}
                                componentClassName="u-fieldLong"
                                options={authenticatedStateOptions}
                              />
                            </div>
                          </div>
                          <div className="u-gapTop">
                            <InfoTipLayout tip="Tip">
                              <WrappedField
                                name={`instances.${index}.primary`}
                                component={Checkbox}
                                label="Primary"
                              />
                            </InfoTipLayout>
                          </div>
                        </Well>
                      ))}
                    </div>
                  );
                }}
              />
            </div>
          </div>
        );
      }}
    />
  );
};

render(setCustomerIds);
