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
import { Item, Link, Radio } from "@adobe/react-spectrum";
import { useField } from "formik";
import PropTypes from "prop-types";
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
import FormikRadioGroup from "../components/formikReactSpectrum3/formikRadioGroup";
import FieldSubset from "../components/fieldSubset";

const STANDARD = "standard";
const TOP = "top";
const BOTTOM = "bottom";
const NONE = "none";
const ACTIVE = "active";
const DATA_ELEMENT = "dataElement";
const DISPLAY = "Display";
const INTERACT = "Interact";

const getInitialValues = ({ initInfo }) => {
  const {
    eventStyle = "standard",
    instanceName = initInfo.extensionSettings.instances[0].name,
    renderDecisions = false,
    xdm = "",
    data = "",
    type = "",
    mergeId = "",
    datasetId = "",
    documentUnloading = false,
    propositions,
    propositionsEventType,
    edgeConfigOverrides = overridesBridge.getInstanceDefaults()
      .edgeConfigOverrides
  } = initInfo.settings || {};

  const initialValues = {
    eventStyle,
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
    propositionsStyle: NONE,
    propositionsDataElement: "",
    propositionsEventType: DISPLAY,
    ...overridesBridge.getInitialInstanceValues({
      instanceSettings: { edgeConfigOverrides }
    })
  };
  if (propositions) {
    if (propositions === ACTIVE) {
      initialValues.propositionsStyle = ACTIVE;
    } else {
      initialValues.propositionsStyle = DATA_ELEMENT;
      initialValues.propositionsDataElement = propositions;
      if (propositionsEventType === "interact") {
        initialValues.propositionsEventType = INTERACT;
      } else {
        initialValues.propositionsEventType = propositionsEventType;
      }
    }
  }
  return initialValues;
};

const getSettings = ({ values }) => {
  const settings = {
    eventStyle: values.eventStyle,
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

  if (values.eventStyle !== STANDARD) {
    settings.eventStyle = values.eventStyle;
  }
  if (values.xdm) {
    settings.xdm = values.xdm;
  }
  if (values.data) {
    settings.data = values.data;
  }
  if (values.type && values.eventStyle !== TOP) {
    settings.type = values.type;
  }
  if (values.mergeId && values.eventStyle === STANDARD) {
    settings.mergeId = values.mergeId;
  }
  if (values.datasetId && values.eventStyle === STANDARD) {
    settings.datasetId = values.datasetId;
  }
  // Only add if the value is different than the default (false).
  if (values.documentUnloading && values.eventStyle === STANDARD) {
    settings.documentUnloading = true;
  }
  // Only add if the value is different than the default (false).
  if (values.renderDecisions && values.eventStyle === STANDARD) {
    settings.renderDecisions = true;
  }
  if (values.propositionsStyle === ACTIVE && values.eventStyle === STANDARD) {
    settings.propositions = ACTIVE;
  }
  if (
    values.propositionsStyle === DATA_ELEMENT &&
    values.eventStyle === STANDARD
  ) {
    settings.propositions = values.propositionsDataElement;
    if (values.propositionsEventType === INTERACT) {
      settings.propositionsEventType = "interact";
    } else if (values.propositionsEventType !== DISPLAY) {
      settings.propositionsEventType = values.propositionsEventType;
    }
  }
  if (values.eventStyle === TOP) {
    settings.type = "decisioning.propositionsFetch";
    settings.decisionScopes ||= [];
    if (!settings.decisionScopes.includes("__view__")) {
      settings.decisionScopes.push("__view__");
    }
  }

  return settings;
};

const validationSchema = object()
  .shape({
    xdm: string().matches(singleDataElementRegex, DATA_ELEMENT_REQUIRED),
    data: string().matches(singleDataElementRegex, DATA_ELEMENT_REQUIRED),
    propositionsDataElement: string().when("propositionsStyle", {
      is: DATA_ELEMENT,
      then: schema =>
        schema
          .matches(singleDataElementRegex, DATA_ELEMENT_REQUIRED)
          .required(DATA_ELEMENT_REQUIRED)
    }),
    propositionsEventType: string().when("propositionsStyle", {
      is: DATA_ELEMENT,
      then: schema =>
        schema.test(
          "propositionsEventType",
          "Please select a value or specify a single data element.",
          value => {
            return (
              value === DISPLAY ||
              value === INTERACT ||
              value.match(singleDataElementRegex)
            );
          }
        )
    })
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

const SendEvent = ({ initInfo }) => {
  const [{ value: eventStyle }] = useField("eventStyle");
  const [{ value: propositionsStyle }] = useField("propositionsStyle");

  return (
    <FormElementContainer>
      <FormikRadioGroup
        label="Event style"
        name="eventStyle"
        description="Select the event style. Top of page events do not record events in Adobe Analytics and have the type decisioning.propositionFetch. Bottom of page events do not request personalization decisions."
        width="size-5000"
      >
        <Radio data-test-id="eventStyleStandardField" value={STANDARD}>
          Standard event
        </Radio>
        <Radio data-test-id="eventStyleTopField" value={TOP}>
          Top of page event
        </Radio>
        <Radio data-test-id="eventStyleBottomField" value={BOTTOM}>
          Bottom of page event
        </Radio>
      </FormikRadioGroup>
      <InstanceNamePicker
        data-test-id="instanceNameField"
        name="instanceName"
        initInfo={initInfo}
      />
      {eventStyle !== TOP && (
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
      )}
      <DataElementSelector>
        <FormikTextField
          data-test-id="xdmField"
          name="xdm"
          label="XDM data"
          description={
            <>
              Provide a data element which returns an object matching your XDM
              schema. You may want to use the{" "}
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
      {eventStyle === STANDARD && (
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
      )}
      {eventStyle === STANDARD && (
        <DataElementSelector>
          <FormikTextField
            data-test-id="datasetIdField"
            name="datasetId"
            description='Send data to a different dataset than what&apos;s been provided in the datastream. Note: this option is deprecated. Use "Event dataset" in the "Datastream Configuration Overrides" options instead.'
            label="Dataset ID (deprecated)"
            width="size-5000"
          />
        </DataElementSelector>
      )}
      {eventStyle === STANDARD && (
        <FormikCheckbox
          data-test-id="documentUnloadingField"
          name="documentUnloading"
          description="Check this to ensure the event will reach the server even if the user is navigating away from the current document (page). Any response from the server will be ignored."
          width="size-5000"
        >
          Document will unload
        </FormikCheckbox>
      )}
      {eventStyle === STANDARD && (
        <FormikCheckbox
          data-test-id="renderDecisionsField"
          name="renderDecisions"
          description="Check this to automatically render personalization and pre-hide the content to prevent flicker."
          width="size-5000"
        >
          Render visual personalization decisions
        </FormikCheckbox>
      )}
      {eventStyle !== BOTTOM && <DecisionScopes />}
      {eventStyle !== BOTTOM && <Surfaces />}
      {eventStyle === STANDARD && (
        <>
          <FormikRadioGroup
            label="Propositions"
            name="propositionsStyle"
            description="Select the propositions to include in the XDM payload as display or interact notifications."
            width="size-5000"
          >
            <Radio data-test-id="propositionsStyleNoneField" value={NONE}>
              None
            </Radio>
            <Radio data-test-id="propositionsStyleActiveField" value={ACTIVE}>
              Include active propositions as a display notification. (Active
              propositions are those that were returned from the last sendEvent
              call.)
            </Radio>
            <Radio
              data-test-id="propositionsStyleDataElementField"
              value={DATA_ELEMENT}
            >
              Specify a data element and proposition event type
            </Radio>
          </FormikRadioGroup>
          {propositionsStyle === DATA_ELEMENT && (
            <FieldSubset>
              <DataElementSelector>
                <FormikTextField
                  data-test-id="propositionsDataElementField"
                  name="propositionsDataElement"
                  label="Propositions data element"
                  description="Provide a data element which returns an array of propositions to include in the XDM payload as display or interact notifications."
                  width="size-5000"
                />
              </DataElementSelector>
              <DataElementSelector>
                <FormikComboBox
                  data-test-id="propositionsEventTypeField"
                  name="propositionsEventType"
                  label="Display or interact notification"
                  description="Enter an event type to populate the `propositionEventType` XDM field. Select a predefined value or enter a data element."
                  width="size-5000"
                  allowsCustomValue
                >
                  <Item key={DISPLAY}>{DISPLAY}</Item>
                  <Item key={INTERACT}>{INTERACT}</Item>
                </FormikComboBox>
              </DataElementSelector>
            </FieldSubset>
          )}
        </>
      )}
      <Overrides />
    </FormElementContainer>
  );
};

SendEvent.propTypes = {
  initInfo: PropTypes.object.isRequired
};

const SendEventExtensionView = () => {
  return (
    <ExtensionView
      getInitialValues={getInitialValues}
      getSettings={getSettings}
      formikStateValidationSchema={validationSchema}
      render={({ initInfo }) => <SendEvent initInfo={initInfo} />}
    />
  );
};
render(SendEventExtensionView);
