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
import Textfield from "@react/react-spectrum/Textfield";
import render from "../render";
import WrappedField from "../components/wrappedField";
import ExtensionView from "../components/extensionView";

const getInitialValues = settings => {
  return settings;
};

const getSettings = values => {
  return values;
};

const validationSchema = object().shape({
  dataIngestionName: string()
});

const SendEvent = () => {
  return (
    <ExtensionView
      getInitialValues={getInitialValues}
      getSettings={getSettings}
      validationSchema={validationSchema}
      render={({ formikProps, settings }) => {
        console.log(formikProps, settings);
        return (
          <WrappedField
            id="dataIngestionName"
            name="dataIngestionName"
            component={Textfield}
            componentClassName="u-longTextfield"
            supportDataElement
          />
        );
      }}
    />
  );
};

render(SendEvent);
