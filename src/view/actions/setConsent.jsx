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
import React, { Fragment } from "react";
import { object, string } from "yup";

import { Form, Item, Button } from "@adobe/react-spectrum";
import Delete from "@spectrum-icons/workflow/Delete";
import {
  TextField,
  Picker
} from "../components/formikReactSpectrum3";
//import OptionsWithDataElement from "../components/formikReactSpectrum3/optionsWithDataElement";
import DataElementSelector from "../components/dataElementSelector";
import render from "../spectrum3Render";

import ExtensionView from "../components/spectrum3ExtensionView";
import getInstanceOptions from "../utils/getInstanceOptions";
import singleDataElementRegex from "../constants/singleDataElementRegex";
import ExtensionViewForm from "../components/extensionViewForm";
import DataElementRadioChoice from "../components/dataElementRadioChoice";
import ConsentObjects from "../components/consentObjects";

const getInitialValues = ({ initInfo }) => {
  const {
    instanceName = initInfo.extensionSettings.instances[0].name,
    identityMap = ""
  } = initInfo.settings || {};

  return {
    instanceName,
    identityMap
  };
};

const getSettings = ({ values }) => {
  const {
    instanceName,
    identityMap
  } = values;

  const settings = {
    instanceName
  };

  if (identityMap) {
    settings.identityMap = identityMap;
  }

  return settings;
}

const invalidDataMessage = "Please specify a data element.";
const validationSchema = object().shape({
  instanceName: string().required(),
  identityMap: string().matches(singleDataElementRegex, invalidDataMessage)
});

const SetConsent = () => {

  return (
    <ExtensionView
      render={({ initInfo }) => (
        <ExtensionViewForm
          initialValues={getInitialValues({ initInfo })}
          getSettings={getSettings}
          validationSchema={validationSchema}
          render={() => {
            return (
              <Form>
                <Picker
                  data-test-id="instanceNameField"
                  name="instanceName"
                  label="Instance"
                  items={getInstanceOptions(initInfo)}
                  width="size-5000"
                  isRequired
                >
                  {item => <Item key={item.value}>{item.label}</Item>}
                </Picker>
                <DataElementSelector>
                  <TextField
                    data-test-id="identityMapField"
                    name="identityMap"
                    label="Identity Map"
                    description="Provide a data element which returns a custom identity map object as part of the setConsent command."
                    width="size-5000"
                  />
                </DataElementSelector>
                <DataElementRadioChoice
                  name="consent"
                  label="Consent Information"
                  dataElementLabel="Use a data element"
                  constantLabel="Fill out a form"
                  isRequired
                >
                  <ConsentObjects/>
                </DataElementRadioChoice>
              </Form>
            );
          }}
        />
      )}
    />
  );
};

render(SetConsent);
