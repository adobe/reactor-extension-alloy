import React from "react";
import { Link } from "@adobe/react-spectrum";

import Checkbox from "../forms/checkbox";
import ComboBox from "../forms/comboBox";
import InstancePicker from "../forms/instancePicker";
import Form from "../forms/form";
import RadioGroup from "../forms/radioGroup";
import Section from "../forms/section";
import DataElement from "../forms/dataElement";
import StringArray from "../forms/stringArray";
import DisabledTextField from "../forms/disabledTextField";
import Conditional from "../forms/conditional";
import propositionMetadata from "../forms/propositionMetadata";
import DisabledCheckbox from "../forms/disabledCheckbox";
import ConfigOverrides from "../forms/configOverrides";

import eventTypes from "./constants/eventTypes";

import renderForm from "../forms/renderForm";
import TextField from "../forms/textField";

const UNGUIDED = "unguided";
const FETCH = "fetch";
const COLLECT = "collect";

const xdmFieldDescription = (
  <>
    Provide a data element which returns an object matching your XDM schema. You
    may want to use the{" "}
    <Link>
      <a
        href="https://experienceleague.adobe.com/docs/experience-platform/edge/extension/data-element-types.html?lang=en#xdm-object"
        target="_blank"
        rel="noopener noreferrer"
      >
        XDM Object
      </a>
    </Link>{" "}
    data element type to build this object. You can also combine objects using
    the{" "}
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
);

const wrapGetInitialValues = getInitialValues => ({ initInfo }) => {
  const { personalization = {}, ...otherSettings } = initInfo.settings || {};
  return getInitialValues({
    initInfo: {
      ...initInfo,
      settings: { ...personalization, ...otherSettings }
    }
  });
};

const wrapGetSettings = getSettings => ({ values }) => {
  const {
    decisionScopes,
    surfaces,
    sendNotifications,
    metadata,
    ...otherValues
  } = getSettings({ values });
  return {
    ...otherValues,
    personalization: {
      decisionScopes,
      surfaces,
      sendNotifications,
      metadata
    }
  };
};

const eventTypeField = (
  <ComboBox
    name="type"
    label="Type"
    description="Enter an event type to populate the `eventType` XDM field. Select a predefined value or enter a custom value."
    dataElementDescription="Enter a data element that resolves to an event type."
    items={Object.keys(eventTypes)
      .reduce((items, key) => {
        items.push({ value: key, label: eventTypes[key] });
        return items;
      }, [])
      .sort((a, b) => a.label.localeCompare(b.label))}
  />
);
const fetchEventTypeField = (
  <DisabledTextField
    name="type"
    label="Type"
    description="Enter an event type to populate the `eventType` XDM field. Select a predefined value or enter a custom value."
    value="decisioning.propositionFetch"
    valueLabel="Decisioning Proposition Fetch"
  />
);

const xdmField = (
  <DataElement name="xdm" label="XDM" description={xdmFieldDescription} />
);
const dataField = (
  <DataElement
    name="data"
    label="Data"
    description="Provide a data element which returns an object to send as free-form data."
  />
);
const propositionsField = (
  <RadioGroup
    name="propositions"
    label="Propositions"
    description="Select the propositions to include in the XDM payload as display or interact notifications."
    dataElementSupported
    defaultValue="none"
    items={[
      { value: "none", label: "None" },
      { value: "all", label: "All rendered propositions" },
      { value: "scoped", label: "Scoped propositions" }
    ]}
  />
);
const propositionScopesField = (
  <Conditional
    args="propositions"
    condition={propositions => propositions === "scoped"}
  >
    <StringArray
      name="propositionScopes"
      label="Proposition scopes"
      isRequired
      singularLabel="Scope"
      description="Create an array of decision scopes to include in the XDM payload as display or interact notifications."
      dataElementDescription="This data element should resolve to an array of scopes."
    />
  </Conditional>
);
const propositionEventTypeField = (
  <Conditional
    args="propositions"
    condition={propositions => propositions !== "none"}
  >
    <ComboBox
      name="propositionEventType"
      label="Display or interact notification"
      description="Enter an event type to populate the `propositionEventType` XDM field. Select a predefined value or enter a data element."
      items={[
        { value: "display", label: "Display" },
        { value: "interact", label: "Interact" }
      ]}
    />
  </Conditional>
);
const documentUnloadingField = (
  <Checkbox
    name="documentUnloading"
    label="Document will unload"
    description="Check this to ensure the event will reach the server even if the user is navigating away from the current document (page). Any response from the server will be ignored."
  />
);
const mergeIdField = (
  <DataElement
    name="mergeId"
    label="Merge ID (Deprecated)"
    description="Provide an identifier used to merge multiple events. This will populate the `eventMergeId` XDM field. This field has been deprecated until it is supported by Adobe Experience Platform."
  />
);
const decisionScopesField = (
  <StringArray
    name="decisionScopes"
    label="Scopes"
    singularLabel="Scope"
    description="Create an array of decision scopes to query with the event."
    dataElementDescription="This data element should resolve to an array of scopes."
  />
);
const surfacesField = (
  <StringArray
    name="surfaces"
    label="Surfaces"
    singularLabel="Surface"
    description="Create an array of surfaces to query with the event."
    dataElementDescription="This data element should resolve to an array of surfaces."
  />
);
const renderDecisionsField = (
  <Checkbox
    name="renderDecisions"
    label="Render visual personalization decisions"
    description="Check this to render visual personalization decisions."
    defaultValue
  />
);
const renderDecisionsChecked = (
  <DisabledCheckbox
    name="renderDecisions"
    label="Render visual personalization decisions"
    description="Check this to render visual personalization decisions."
    value
  />
);
const sendNotificationsField = (
  <Conditional
    args="renderDecisions"
    condition={renderDecisions => renderDecisions}
  >
    <Checkbox
      name="sendNotifications"
      label="Automatically send a display notification"
      description="Check this to automatically send a display notification. (Note when automatically sending a display notification, you cannot set the proposition metadata.)"
      defaultValue
    />
  </Conditional>
);
const sendNotificationsUnchecked = (
  <DisabledCheckbox
    name="sendNotifications"
    label="Automatically send a display notification"
    description="Check this to automatically send a display notification."
    value={false}
  />
);
const configOverrideFields = <ConfigOverrides />;
const datasetIdField = (
  <TextField
    name="datasetId"
    label="Dataset ID (deprecated)"
    description={
      'Send data to a different dataset than what\'s been provided in the datastream. Note: this option is deprecated. Use "Event dataset" instead.'
    }
  />
);

const SendEventForm = (
  <Form
    wrapGetInitialValues={wrapGetInitialValues}
    wrapGetSettings={wrapGetSettings}
  >
    <RadioGroup
      name="eventStyle"
      label="Guided event style"
      dataElementSupported={false}
      defaultValue={UNGUIDED}
      items={[
        { value: UNGUIDED, label: "Unguided (all fields)" },
        { value: FETCH, label: "Fetch personalization" },
        { value: COLLECT, label: "Data collection with display notifications" }
      ]}
      description="Select the event style. Fetch personalization events do not record events in Adobe Analytics and have the type decisioning.propositionFetch. Data collection events do not request personalization decisions."
    />
    <InstancePicker name="instanceName" />
    <Conditional
      args="eventStyle"
      condition={eventStyle => eventStyle === UNGUIDED}
    >
      <Section label="Data collection">
        {eventTypeField}
        {xdmField}
        {dataField}
        {propositionsField}
        {propositionScopesField}
        {propositionEventTypeField}
        {documentUnloadingField}
        {mergeIdField}
      </Section>
      <Section label="Personalization">
        {decisionScopesField}
        {surfacesField}
        {renderDecisionsField}
        {sendNotificationsField}
        {propositionMetadata}
      </Section>
      <Section label="Configuration overrides">
        {configOverrideFields}
        {datasetIdField}
      </Section>
    </Conditional>
    <Conditional
      args="eventStyle"
      condition={eventStyle => eventStyle === FETCH}
    >
      <Section label="Data collection">
        {fetchEventTypeField}
        {xdmField}
        {dataField}
      </Section>
      <Section label="Personalization">
        {decisionScopesField}
        {surfacesField}
        {renderDecisionsChecked}
        {sendNotificationsUnchecked}
        {propositionMetadata}
      </Section>
      <Section label="Configuration overrides">{configOverrideFields}</Section>
    </Conditional>
    <Conditional
      args="eventStyle"
      condition={eventStyle => eventStyle === COLLECT}
    >
      <Section label="Data collection">
        {eventTypeField}
        {xdmField}
        {dataField}
        {propositionsField}
        {propositionScopesField}
      </Section>
      <Section label="Configuration overrides">{configOverrideFields}</Section>
    </Conditional>
  </Form>
);

renderForm(SendEventForm);
