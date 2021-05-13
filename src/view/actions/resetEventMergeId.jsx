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
import Textfield from "@react/react-spectrum/Textfield";
import FieldLabel from "@react/react-spectrum/FieldLabel";
import "@react/react-spectrum/Form"; // needed for spectrum form styles
import render from "../spectrum2Render";
import WrappedField from "../components/wrappedField";
import ExtensionView from "../components/spectrum2ExtensionView";
import singleDataElementRegex from "../constants/singleDataElementRegex";
import InfoTipLayout from "../components/infoTipLayout";
import "./resetEventMergeId.styl";

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
  eventMergeId: string().matches(
    singleDataElementRegex,
    "Please specify a data element"
  )
});

const ResetEventMergeId = () => {
  return (
    <ExtensionView
      getInitialValues={getInitialValues}
      getSettings={getSettings}
      validationSchema={validationSchema}
      render={() => {
        return (
          <div>
            <InfoTipLayout tip="Please specify the data element that represents the event merge ID you would like to reset.">
              <FieldLabel labelFor="eventMergeIdField" label="Event Merge ID" />
            </InfoTipLayout>
            <div>
              <WrappedField
                data-test-id="eventMergeIdField"
                id="eventMergeIdField"
                name="eventMergeId"
                component={Textfield}
                componentClassName="u-fieldLong"
                supportDataElement="replace"
              />
            </div>
          </div>
        );
      }}
    />
  );
};

render(ResetEventMergeId);
