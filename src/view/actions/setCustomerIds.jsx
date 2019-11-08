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
import { object, string } from "yup";
import { FieldArray } from "formik";
import Textfield from "@react/react-spectrum/Textfield";
import Checkbox from "@react/react-spectrum/Checkbox";
import Select from "@react/react-spectrum/Select";
import FieldLabel from "@react/react-spectrum/FieldLabel";
import Button from "@react/react-spectrum/Button";
import Well from "@react/react-spectrum/Well";
import { Accordion, AccordionItem } from "@react/react-spectrum/Accordion";
import Heading from "@react/react-spectrum/Heading";
import Delete from "@react/react-spectrum/Icon/Delete";
import "@react/react-spectrum/Form"; // needed for spectrum form styles
import render from "../render";
import WrappedField from "../components/wrappedField";
import ExtensionView from "../components/extensionView";
import authenticatedStateOptions from "../constants/authenticatedStateOptions";
import "./setCustomerIds.styl";
import InfoTipLayout from "../components/infoTipLayout";
import getCustomerIdNamespaceOptions from "../utils/getCustomerIdNamespaceOptions";

const getInitialValues = ({ initInfo }) => {
  const { instances } = initInfo.settings || {};

  return {
    instances
  };
};

const getSettings = ({ values }) => {
  return values;
};

const validationSchema = object().shape({
  xdm: string().matches(/^%[^%]+%$/, "Please specify a data element")
});

let customerIdNamespaceOptions = [];

getCustomerIdNamespaceOptions().then(options => {
  customerIdNamespaceOptions = options;
});

/*
const values = {
    "instances": [
      {
        "name": "willi",
        "customerIds": [
          {
            "namespace": "Email_LC_SHA256",
            "id": "tester",
            "authenticatedState": "loggedOut",
            "primary": true,
            "hash": true
          },
          {
            "namespace": "AAID",
            "id": "1234",
            "authenticatedState": "ambiguous"
          }
        ]
      },
      {
        "name": "willi2",
        "customerIds": [
          {
            "namespace": "CORE",
            "id": "abc",
            "primary": false,
            "authenticatedState": "ambiguous"
          }
        ]
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
  const [selectedAccordionIndex, setSelectedAccordionIndex] = useState();
  const [isFirstExtensionViewRender, setIsFirstExtensionViewRender] = useState(
    true
  );

  return (
    <ExtensionView
      getInitialValues={getInitialValues}
      getSettings={getSettings}
      validationSchema={validationSchema}
      render={({ formikProps }) => {
        const { values, errors, isSubmitting, isValidating } = formikProps;

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
              render={() => {
                return (
                  <div>
                    <Heading variant="subtitle1">Instances</Heading>
                    <Accordion
                      multiselectable
                      selectedIndex={selectedAccordionIndex}
                      className="u-gapTop2x"
                      onChange={setSelectedAccordionIndex}
                    >
                      {values.instances.map((instance, instanceIndex) => (
                        <AccordionItem
                          key={instanceIndex}
                          header={instance.name || "unnamed instance"}
                        >
                          <div>
                            <div>
                              <div>
                                {Array.isArray(instance.customerIds) &&
                                  instance.customerIds.length && (
                                    <Heading variant="subtitle2">
                                      Customer IDs
                                    </Heading>
                                  )}
                                <div>
                                  {Array.isArray(instance.customerIds) &&
                                    instance.customerIds.length &&
                                    instance.customerIds.map(
                                      (customerId, index) => (
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
                                                name={`instances.${instanceIndex}.customerIds.${index}.namespace`}
                                                component={Select}
                                                componentClassName="u-fieldLong"
                                                options={
                                                  customerIdNamespaceOptions
                                                }
                                                supportDataElement
                                              />
                                            </div>
                                          </div>
                                          <div className="u-gapTop">
                                            <InfoTipLayout tip="Tip">
                                              <FieldLabel
                                                labelFor="idField"
                                                label="ID"
                                              />
                                            </InfoTipLayout>
                                            <div>
                                              <WrappedField
                                                id="idField"
                                                name={`instances.${instanceIndex}.customerIds.${index}.id`}
                                                component={Textfield}
                                                componentClassName="u-fieldLong"
                                                supportDataElement
                                              />
                                            </div>
                                          </div>
                                          <div className="u-gapTop">
                                            <InfoTipLayout tip="Tip">
                                              <WrappedField
                                                name={`instances.${instanceIndex}.customerIds.${index}.hash`}
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
                                                name={`instances.${instanceIndex}.customerIds.${index}.authenticatedState`}
                                                component={Select}
                                                componentClassName="u-fieldLong"
                                                options={
                                                  authenticatedStateOptions
                                                }
                                                supportDataElement
                                              />
                                            </div>
                                          </div>
                                          <div className="u-gapTop">
                                            <InfoTipLayout tip="Tip">
                                              <WrappedField
                                                name={`instances.${instanceIndex}.customerIds.${index}.primary`}
                                                component={Checkbox}
                                                label="Primary"
                                                supportDataElement
                                              />
                                            </InfoTipLayout>
                                          </div>
                                          <div className="u-gapTop u-alignRight">
                                            <Button
                                              icon={<Delete />}
                                              onClick={() => {}}
                                            />
                                          </div>
                                        </Well>
                                      )
                                    )}
                                  <div className="u-gapTop u-alignRight">
                                    <Button
                                      label="Add Customer ID"
                                      onClick={() => {}}
                                    />
                                  </div>
                                </div>
                              </div>
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
      }}
    />
  );
};

render(setCustomerIds);
