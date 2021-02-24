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
import Checkbox from "@react/react-spectrum/Checkbox";
import ComboBox from "@react/react-spectrum/ComboBox";
import Select from "@react/react-spectrum/Select";
import FieldLabel from "@react/react-spectrum/FieldLabel";
import "@react/react-spectrum/Form"; // needed for spectrum form styles
import render from "../render";
import WrappedField from "../components/wrappedField";
import ExtensionView from "../components/extensionView";
import getInstanceOptions from "../utils/getInstanceOptions";
import singleDataElementRegex from "../constants/singleDataElementRegex";
import "./sendEvent.styl";
import InfoTipLayout from "../components/infoTipLayout";
import DecisionScopesComponent from "../components/decisionScopesComponent";

const decisionScopesOptions = {
  CONSTANT: "constant",
  DATA_ELEMENT: "dataElement"
};

const filterDecisionScopes = scopes => {
  return scopes.filter(s => s !== "");
};

const getDecisionScopesFromFormState = values => {
  if (
    values.decisionsInputMethod === decisionScopesOptions.DATA_ELEMENT &&
    values.decisionScopesDataElement
  ) {
    return values.decisionScopesDataElement;
  }

  if (
    values.decisionsInputMethod === decisionScopesOptions.CONSTANT &&
    values.decisionScopesArray.length > 0
  ) {
    const scopes = filterDecisionScopes(values.decisionScopesArray);
    if (scopes.length > 0) {
      return scopes;
    }
  }
  return undefined;
};

const getInitialDecisionScopesData = decisionScopes => {
  if (Array.isArray(decisionScopes)) {
    return {
      decisionsInputMethod: decisionScopesOptions.CONSTANT,
      decisionScopesArray: decisionScopes,
      decisionScopesDataElement: ""
    };
  }
  if (typeof decisionScopes === "string") {
    return {
      decisionsInputMethod: decisionScopesOptions.DATA_ELEMENT,
      decisionScopesDataElement: decisionScopes,
      decisionScopesArray: [""]
    };
  }
  return {
    decisionsInputMethod: decisionScopesOptions.CONSTANT,
    decisionScopesDataElement: "",
    decisionScopesArray: [""]
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
  xdm: string().matches(
    singleDataElementRegex,
    "Please specify a data element"
  ),
  decisionScopesDataElement: string().when("decisionsInputMethod", {
    is: decisionScopesOptions.DATA_ELEMENT,
    then: string().matches(
      singleDataElementRegex,
      "Please specify a data element"
    )
  })
});

const knownEventTypes = [
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
];

const SendEvent = () => {
  return (
    <ExtensionView
      getInitialValues={getInitialValues}
      getSettings={getSettings}
      validationSchema={validationSchema}
      render={({ formikProps, initInfo }) => {
        const { values } = formikProps;

        return (
          <div>
            <div>
              <FieldLabel labelFor="instanceNameField" label="Instance" />
              <div>
                <WrappedField
                  data-test-id="instanceNameField"
                  id="instanceNameField"
                  name="instanceName"
                  component={Select}
                  componentClassName="u-fieldLong"
                  options={getInstanceOptions(initInfo)}
                />
              </div>
            </div>
            <div className="u-gapTop">
              <InfoTipLayout
                tip="The type of the experience event. Choose a predefined type or create
                  your own. This will be added to the XDM object as the field `eventType`."
              >
                <FieldLabel labelFor="typeField" label="Type (optional)" />
              </InfoTipLayout>
              <div>
                <WrappedField
                  data-test-id="typeField"
                  id="typeField"
                  name="type"
                  component={ComboBox}
                  componentClassName="u-fieldLong"
                  supportDataElement="replace"
                  allowCreate
                  options={knownEventTypes}
                />
              </div>
            </div>
            <div className="u-gapTop">
              <InfoTipLayout
                tip="Please specify a data element that will return a JavaScript
                  object in XDM format. This object will be sent to the Adobe
                  Experience Platform."
              >
                <FieldLabel labelFor="xdmField" label="XDM Data" />
              </InfoTipLayout>
              <div>
                <WrappedField
                  data-test-id="xdmField"
                  id="xdmField"
                  name="xdm"
                  component={Textfield}
                  componentClassName="u-fieldLong"
                  supportDataElement="replace"
                />
              </div>
            </div>
            <div className="u-gapTop">
              <InfoTipLayout
                tip="The merge ID of the experience event. This will be added to
                  the XDM object as the field `eventMergeId`."
              >
                <FieldLabel
                  labelFor="mergeIdField"
                  label="Merge ID (optional)"
                />
              </InfoTipLayout>
              <div>
                <WrappedField
                  data-test-id="mergeIdField"
                  id="mergeIdField"
                  name="mergeId"
                  component={Textfield}
                  componentClassName="u-fieldLong"
                  supportDataElement="replace"
                />
              </div>
            </div>
            <div className="u-gapTop">
              <InfoTipLayout
                tip="A platform experience event dataset ID that is different from the
                dataset provided in the Edge configuration."
              >
                <FieldLabel
                  labelFor="datasetIdField"
                  label="Dataset ID (optional)"
                />
              </InfoTipLayout>
              <div>
                <WrappedField
                  data-test-id="datasetIdField"
                  id="datasetIdField"
                  name="datasetId"
                  component={Textfield}
                  componentClassName="u-fieldLong"
                  supportDataElement="replace"
                />
              </div>
            </div>
            <div className="u-gapTop">
              <InfoTipLayout tip="Ensures the event will reach the server even if the user is navigating away from the current document (page), but any response from the server will be ignored.">
                <WrappedField
                  data-test-id="documentUnloadingField"
                  name="documentUnloading"
                  component={Checkbox}
                  label="Document will unload"
                />
              </InfoTipLayout>
            </div>
            <div className="u-gapTop">
              <InfoTipLayout tip="Influences whether the SDK should automatically render personalization and pre-hide the content to prevent flicker.">
                <WrappedField
                  data-test-id="renderDecisionsField"
                  name="renderDecisions"
                  component={Checkbox}
                  label="Render visual personalization decisions"
                />
              </InfoTipLayout>
            </div>
            <DecisionScopesComponent
              values={values}
              options={decisionScopesOptions}
            />
          </div>
        );
      }}
    />
  );
};

render(SendEvent);
