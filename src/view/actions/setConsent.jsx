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

import React from "react";
import { object, string } from "yup";

import { Item } from "@adobe/react-spectrum";
import { TextField, Picker } from "../components/formikReactSpectrum3";
import DataElementSelector from "../components/dataElementSelector";
import render from "../spectrum3Render";

import ExtensionView from "../components/spectrum3ExtensionView";
import getInstanceOptions from "../utils/getInstanceOptions";
import singleDataElementRegex from "../constants/singleDataElementRegex";
import DataElementRadioChoice from "../components/dataElementRadioChoice";
import ConsentObjects from "../components/consentObjects";
import PartialForm from "../components/partialForm";

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
  const { instanceName, identityMap } = values;

  const settings = {
    instanceName
  };

  if (identityMap) {
    settings.identityMap = identityMap;
  }

  return settings;
};

const invalidDataMessage = "Please specify a data element.";
const validationSchema = object().shape({
  instanceName: string().required(),
  identityMap: string().matches(singleDataElementRegex, invalidDataMessage)
});

const SetConsent = () => {
  return (
    <ExtensionView>
      <PartialForm
        getInitialValues={getInitialValues}
        getSettings={getSettings}
        formikStateValidationSchema={validationSchema}
        name="view1"
        render={({ initInfo }) => (
          <>
            <Picker
              data-test-id="instanceNamePicker"
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
          </>
        )}
      />

      <DataElementRadioChoice
        name="consentChoice"
        setting="consent"
        label="Consent Information"
        dataElementLabel="Use a data element"
        constantLabel="Fill out a form"
        isRequired
      >
        <ConsentObjects />
      </DataElementRadioChoice>
    </ExtensionView>
  );
};

render(SetConsent);
