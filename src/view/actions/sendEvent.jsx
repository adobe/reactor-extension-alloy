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
import { Form, Item } from "@adobe/react-spectrum";
import {
  ComboBox,
  Picker,
  TextField,
  Checkbox
} from "../components/hookFormReactSpectrum";
import DataElementSelector from "../components/dataElementSelector";
import render from "../spectrum3Render";
import ExtensionView from "../components/hookFormExtensionView";
import getInstanceOptions from "../utils/getInstanceOptions";
import singleDataElementRegex from "../constants/singleDataElementRegex";
// import "./sendEvent.styl";
import DecisionScopesComponent from "../components/decisionScopesComponent";
import { CONSTANT, DATA_ELEMENT } from "../constants/decisionScopesInputMethod";

const filterDecisionScopes = scopes => {
  return scopes.filter(scope => scope.value !== "");
};

const getDecisionScopesFromFormState = values => {
  if (
    values.decisionsInputMethod === DATA_ELEMENT &&
    values.decisionScopesDataElement
  ) {
    return values.decisionScopesDataElement;
  }

  if (
    values.decisionsInputMethod === CONSTANT &&
    values.decisionScopesArray.length > 0
  ) {
    const scopes = filterDecisionScopes(values.decisionScopesArray);
    if (scopes.length > 0) {
      return scopes.map(scope => scope.value);
    }
  }
  return undefined;
};

const getInitialDecisionScopesData = decisionScopes => {
  if (Array.isArray(decisionScopes)) {
    return {
      decisionsInputMethod: CONSTANT,
      decisionScopesArray: decisionScopes.map(scope => ({ value: scope })),
      decisionScopesDataElement: ""
    };
  }
  if (typeof decisionScopes === "string") {
    return {
      decisionsInputMethod: DATA_ELEMENT,
      decisionScopesDataElement: decisionScopes,
      decisionScopesArray: [{ value: "" }]
    };
  }
  return {
    decisionsInputMethod: CONSTANT,
    decisionScopesDataElement: "",
    decisionScopesArray: [{ value: "" }]
  };
};
const getInitialValues = ({ initInfo }) => {
  const {
    instanceName = initInfo.extensionSettings.instances[0].name,
    renderDecisions = false,
    decisionScopes = null,
    xdm = "",
    type = "",
    mergeId = "",
    datasetId = "",
    documentUnloading = false
  } = initInfo.settings || {};
  const initialPersonalizationData = getInitialDecisionScopesData(
    decisionScopes
  );

  return {
    instanceName,
    renderDecisions,
    xdm,
    type,
    mergeId,
    datasetId,
    documentUnloading,
    ...initialPersonalizationData
  };
};

const getSettings = ({ values }) => {
  const settings = {
    instanceName: values.instanceName
  };

  if (values.xdm) {
    settings.xdm = values.xdm;
  }
  if (values.type) {
    settings.type = values.type;
  }
  if (values.mergeId) {
    settings.mergeId = values.mergeId;
  }
  if (values.datasetId) {
    settings.datasetId = values.datasetId;
  }
  // Only add if the value is different than the default (false).
  if (values.documentUnloading) {
    settings.documentUnloading = true;
  }
  // Only add if the value is different than the default (false).
  if (values.renderDecisions) {
    settings.renderDecisions = true;
  }
  const scopes = getDecisionScopesFromFormState(values);
  if (scopes) {
    settings.decisionScopes = scopes;
  }

  return settings;
};

const validationSchema = object().shape({
  xdm: string().matches(singleDataElementRegex, {
    excludeEmptyString: true,
    message: "Please specify a data element"
  }),
  decisionScopesDataElement: string().when("decisionsInputMethod", {
    is: DATA_ELEMENT,
    then: string().matches(
      singleDataElementRegex,
      "Please specify a data element"
    )
  })
});

const knownEventTypeOptions = [
  "advertising.completes",
  "advertising.timePlayed",
  "advertising.federated",
  "advertising.clicks",
  "advertising.conversions",
  "advertising.firstQuartiles",
  "advertising.impressions",
  "advertising.midpoints",
  "advertising.starts",
  "advertising.thirdQuartiles",
  "web.webpagedetails.pageViews",
  "web.webinteraction.linkClicks",
  "commerce.checkouts",
  "commerce.productListAdds",
  "commerce.productListOpens",
  "commerce.productListRemovals",
  "commerce.productListReopens",
  "commerce.productListViews",
  "commerce.productViews",
  "commerce.purchases",
  "commerce.saveForLaters"
].map(type => ({ type }));

const SendEvent = () => {
  return (
    <ExtensionView
      getInitialValues={getInitialValues}
      getSettings={getSettings}
      validationSchema={validationSchema}
      render={({ initInfo }) => {
        return (
          <Form>
            <Picker
              data-test-id="instanceNameField"
              name="instanceName"
              label="Instance"
              items={getInstanceOptions(initInfo)}
              width="size-5000"
            >
              {item => <Item key={item.value}>{item.label}</Item>}
            </Picker>
            <DataElementSelector name="type">
              <ComboBox
                data-test-id="typeField"
                name="type"
                label="Type"
                description="Enter an event type to populate the `eventType` XDM field. Select a predefined value or enter a custom value."
                items={knownEventTypeOptions}
                allowsCustomValue
                width="size-5000"
              >
                {item => <Item key={item.type}>{item.type}</Item>}
              </ComboBox>
            </DataElementSelector>
            <DataElementSelector name="xdm">
              <TextField
                data-test-id="xdmField"
                name="xdm"
                label="XDM Data"
                description="Provide a data element which returns an object matching your XDM schema."
                width="size-5000"
              />
            </DataElementSelector>
            <DataElementSelector name="mergeId">
              <TextField
                data-test-id="mergeIdField"
                name="mergeId"
                description="Provide an identifier used to merge multiple events. This will
                  populate the `eventMergeId` XDM field."
                label="Merge ID"
                width="size-5000"
              />
            </DataElementSelector>
            <DataElementSelector name="datasetId">
              <TextField
                data-test-id="datasetIdField"
                name="datasetId"
                description="Send data to a different dataset than what's been provided in the Edge configuration."
                label="Dataset ID"
                width="size-5000"
              />
            </DataElementSelector>
            <Checkbox
              data-test-id="documentUnloadingField"
              name="documentUnloading"
              description="This will ensure the event will reach the server even if the user is navigating away from the current document (page). Any response from the server will be ignored."
              width="size-5000"
            >
              Document will unload
            </Checkbox>
            <Checkbox
              data-test-id="renderDecisionsField"
              name="renderDecisions"
              description="This will influence whether the SDK should automatically render personalization and pre-hide the content to prevent flicker."
              width="size-5000"
            >
              Render visual personalization decisions
            </Checkbox>
            <DecisionScopesComponent />
          </Form>
        );
      }}
    />
  );
};

render(SendEvent);
