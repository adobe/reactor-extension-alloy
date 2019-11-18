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
import "@react/react-spectrum/Form"; // needed for spectrum form styles
import render from "../render";
import ExtensionView from "../components/extensionView";
import "./setCustomerIds.styl";
import { updateFetchSettings } from "../utils/fetch";
import CustomerIdWrapper from "../components/customerIdWrapper";
import getDefaultCustomerId from "../utils/getDefaultCustomerId";

const getInitialValues = ({ initInfo }) => {
  const { instanceName = initInfo.extensionSettings.instances[0].name } =
    initInfo.settings || {};

  return {
    instanceName,
    customerIds: (initInfo.settings && initInfo.settings.customerIds) || [
      getDefaultCustomerId()
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

const setCustomerIds = () => {
  return (
    <ExtensionView
      getInitialValues={getInitialValues}
      getSettings={getSettings}
      validationSchema={validationSchema}
      render={({ formikProps, initInfo }) => {
        const { values } = formikProps;

        updateFetchSettings({
          imsOrgId: initInfo.company.orgId,
          token: initInfo.tokens.imsAccess
        });

        return (
          <React.Fragment>
            <CustomerIdWrapper values={values}></CustomerIdWrapper>
          </React.Fragment>
        );
      }}
    />
  );
};

render(setCustomerIds);
