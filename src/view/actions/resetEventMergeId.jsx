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
import FormikTextField from "../components/formikReactSpectrum3/formikTextField";
import render from "../render";
import ExtensionView from "../components/extensionView";
import singleDataElementRegex from "../constants/singleDataElementRegex";
import { DATA_ELEMENT_REQUIRED } from "../constants/validationErrorMessages";
import FormElementContainer from "../components/formElementContainer";
import DataElementSelector from "../components/dataElementSelector";

const getInitialValues = ({ initInfo }) => {
  const { eventMergeId = "" } = initInfo.settings || {};
  return {
    eventMergeId
  };
};

const getSettings = ({ values }) => {
  return values;
};

const validationSchema = object().shape({
  eventMergeId: string()
    .required(DATA_ELEMENT_REQUIRED)
    .matches(singleDataElementRegex, DATA_ELEMENT_REQUIRED)
});

const ResetEventMergeId = () => {
  return (
    <ExtensionView
      getInitialValues={getInitialValues}
      getSettings={getSettings}
      formikStateValidationSchema={validationSchema}
      render={() => (
        <FormElementContainer>
        <DataElementSelector>
          <FormikTextField
            data-test-id="eventMergeIdField"
            name="eventMergeId"
            label="Event Merge ID"
            description="Please specify the data element that represents the event merge ID you would like to reset."
            width="size-5000"
            isRequired
          />
        </DataElementSelector>
      </FormElementContainer>
      )}
    />
  );
};

render(ResetEventMergeId);
