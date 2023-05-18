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
import { Item, Link } from "@adobe/react-spectrum";
import FormikComboBox from "../components/formikReactSpectrum3/formikComboBox";
import FormikTextField from "../components/formikReactSpectrum3/formikTextField";
import FormikCheckbox from "../components/formikReactSpectrum3/formikCheckbox";
import DataElementSelector from "../components/dataElementSelector";
import render from "../render";
import ExtensionView from "../components/extensionView";
import singleDataElementRegex from "../constants/singleDataElementRegex";
import DecisionScopes, {
  bridge as decisionScopesBridge
} from "../components/decisionScopes";
import Surfaces, { bridge as surfacesBridge } from "../components/surfaces";
import Overrides, { bridge as overridesBridge } from "../components/overrides";
import { DATA_ELEMENT_REQUIRED } from "../constants/validationErrorMessages";
import FormElementContainer from "../components/formElementContainer";
import InstanceNamePicker from "../components/instanceNamePicker";
import getEdgeConfigIds from "../utils/getEdgeConfigIds";

const getInitialValues = ({ initInfo }) => {
  const {
    instanceName = initInfo.extensionSettings.instances[0].name,
    renderDecisions = false,
    xdm = "",
    data = "",
    type = "",
    mergeId = "",
    datasetId = "",
    documentUnloading = false,
    edgeConfigOverrides = overridesBridge.getInstanceDefaults()
      .edgeConfigOverrides
  } = initInfo.settings || {};

  return {
    instanceName,
    renderDecisions,
    xdm,
    data,
    type,
    mergeId,
    datasetId,
    documentUnloading,
    ...decisionScopesBridge.getInitialValues({ initInfo }),
    ...surfacesBridge.getInitialValues({ initInfo }),
    ...overridesBridge.getInitialInstanceValues({
      instanceSettings: { edgeConfigOverrides }
    })
  };
};

const getSettings = ({ values }) => {
  const settings = {
    instanceName: values.instanceName
  };

  const personalization = {
    ...decisionScopesBridge.getSettings({ values }),
    ...surfacesBridge.getSettings({ values })
  };

  if (Object.getOwnPropertyNames(personalization).length) {
    settings.personalization = personalization;
  }

  const { edgeConfigOverrides } = overridesBridge.getInstanceSettings({
    instanceValues: values
  });

  if (edgeConfigOverrides && Object.keys(edgeConfigOverrides).length > 0) {
    settings.edgeConfigOverrides = edgeConfigOverrides;
  }

  if (values.xdm) {
    settings.xdm = values.xdm;
  }
  if (values.data) {
    settings.data = values.data;
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

  return settings;
};

const validationSchema = object()
  .shape({
    xdm: string().matches(singleDataElementRegex, DATA_ELEMENT_REQUIRED),
    data: string().matches(singleDataElementRegex, DATA_ELEMENT_REQUIRED)
  })
  .concat(decisionScopesBridge.formikStateValidationSchema)
  .concat(surfacesBridge.formikStateValidationSchema)
  .concat(overridesBridge.formikStateValidationSchema);

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
      formikStateValidationSchema={validationSchema}
      render={({ initInfo, formikProps: { values } }) => {
        const { instanceName } = values;
        const instanceSettings = initInfo.extensionSettings.instances.find(
          instance => instance.name === instanceName
        );
        const edgeConfigIds = getEdgeConfigIds(instanceSettings);
        const orgId = instanceSettings.orgId ?? initInfo.company.orgId;
        return (
          <FormElementContainer>
            <InstanceNamePicker
              data-test-id="instanceNameField"
              name="instanceName"
              initInfo={initInfo}
            />
            <DataElementSelector>
              <FormikComboBox
                data-test-id="typeField"
                name="type"
                label="Type"
                description="Enter an event type to populate the `eventType` XDM field. Select a predefined value or enter a custom value."
                defaultItems={knownEventTypeOptions}
                allowsCustomValue
                width="size-5000"
              >
                {item => <Item key={item.type}>{item.type}</Item>}
              </FormikComboBox>
            </DataElementSelector>
            <DataElementSelector>
              <FormikTextField
                data-test-id="xdmField"
                name="xdm"
                label="XDM data"
                description={
                  <>
                    Provide a data element which returns an object matching your
                    XDM schema. You may want to use the{" "}
                    <Link>
                      <a
                        href="https://experienceleague.adobe.com/docs/experience-platform/edge/extension/data-element-types.html?lang=en#xdm-object"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        XDM Object
                      </a>
                    </Link>{" "}
                    data element type to build this object. You can also combine
                    objects using the{" "}
                    <Link>
                      <a
                        href="https://experienceleague.adobe.com/docs/experience-platform/tags/extensions/adobe/core/overview.html?lang=en#merged-objects"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Merged Objects
                      </a>
                    </Link>{" "}
                    data element type from the Core extension.
                  </>
                }
                width="size-5000"
              />
            </DataElementSelector>
            <DataElementSelector>
              <FormikTextField
                data-test-id="dataField"
                name="data"
                label="Data"
                description="Provide a data element which returns an object to send as free-form data."
                width="size-5000"
              />
            </DataElementSelector>
            <DataElementSelector>
              <FormikTextField
                data-test-id="mergeIdField"
                name="mergeId"
                description="Provide an identifier used to merge multiple events. This will
                          populate the `eventMergeId` XDM field."
                label="Merge ID"
                width="size-5000"
              />
            </DataElementSelector>
            <DataElementSelector>
              <FormikTextField
                data-test-id="datasetIdField"
                name="datasetId"
                description='Send data to a different dataset than what&apos;s been provided in the datastream. Note: this option is deprecated. Use "Event dataset" in the "Datastream Configuration Overrides" options instead.'
                label="Dataset ID (deprecated)"
                width="size-5000"
              />
            </DataElementSelector>
            <FormikCheckbox
              data-test-id="documentUnloadingField"
              name="documentUnloading"
              description="Check this to ensure the event will reach the server even if the user is navigating away from the current document (page). Any response from the server will be ignored."
              width="size-5000"
            >
              Document will unload
            </FormikCheckbox>
            <FormikCheckbox
              data-test-id="renderDecisionsField"
              name="renderDecisions"
              description="Check this to automatically render personalization and pre-hide the content to prevent flicker."
              width="size-5000"
            >
              Render visual personalization decisions
            </FormikCheckbox>
            <DecisionScopes />
            <Surfaces />
            <Overrides
              initInfo={initInfo}
              edgeConfigIds={edgeConfigIds}
              configOrgId={orgId}
            />
          </FormElementContainer>
        );
      }}
    />
  );
};

render(SendEvent);
