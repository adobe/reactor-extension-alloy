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

const SendEventForm = (
  <Form>
    <RadioGroup
      name="eventStyle"
      label="Guided event style"
      dataElementSupported={false}
      defaultValue="standard"
      items={[
        { value: "standard", label: "Unguided (all fields)" },
        { value: "fetch", label: "Fetch propositions" },
        { value: "pageView", label: "Page view" }
      ]}
      description="Select the event style. Fetch propositions events do not record events in Adobe Analytics and have the type decisioning.propositionFetch. Pave view events do not request personalization decisions."
    />
    <InstancePicker name="instanceName" />
    <Section label="Data collection">
      <Conditional
        args="eventStyle"
        condition={eventStyle => eventStyle !== "fetch"}
      >
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
      </Conditional>
      <Conditional
        args="eventStyle"
        condition={eventStyle => eventStyle === "fetch"}
      >
        <DisabledTextField
          name="type"
          label="Type"
          description="Enter an event type to populate the `eventType` XDM field. Select a predefined value or enter a custom value."
          value="decisioning.propositionFetch"
          valueLabel="Decisioning Proposition Fetch"
        />
      </Conditional>
      <DataElement name="xdm" label="XDM" description={xdmFieldDescription} />
      <DataElement
        name="data"
        label="Data"
        description="Provide a data element which returns an object to send as free-form data."
      />
      <Conditional
        args="eventStyle"
        condition={eventStyle => eventStyle !== "fetch"}
      >
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
      </Conditional>
      <Conditional
        args={["eventStyle", "propositions"]}
        condition={(eventStyle, propositions) =>
          eventStyle === "standard" && propositions !== "none"
        }
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
      <Conditional
        args="eventStyle"
        condition={eventStyle => eventStyle === "standard"}
      >
        <DataElement
          name="mergeId"
          label="Merge ID (Deprecated)"
          description="Provide an identifier used to merge multiple events. This will populate the `eventMergeId` XDM field. This field has been deprecated until it is supported by Adobe Experience Platform."
        />
        <Checkbox
          name="documentUnloading"
          label="Document will unload"
          description="Check this to ensure the event will reach the server even if the user is navigating away from the current document (page). Any response from the server will be ignored."
        />
      </Conditional>
    </Section>
    <Conditional
      args="eventStyle"
      condition={eventStyle => eventStyle !== "pageView"}
    >
      <Section label="Personalization">
        <StringArray
          name="scopes"
          label="Scopes"
          singularLabel="Scope"
          description="Create an array of decision scopes to query with the event."
          dataElementDescription="This data element should resolve to an array of scopes."
        />
        <StringArray
          name="surfaces"
          label="Surfaces"
          singularLabel="Surface"
          description="Create an array of surfaces to query with the event."
          dataElementDescription="This data element should resolve to an array of surfaces."
        />
        <Conditional
          args="eventStyle"
          condition={eventStyle => eventStyle === "standard"}
        >
          <Checkbox
            name="renderDecisions"
            label="Render visual personalization decisions"
            description="Check this to render visual personalization decisions."
            defaultValue
          />
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
            <Conditional
              args="sendNotifications"
              condition={sendNotifications => !sendNotifications}
            >
              {propositionMetadata}
            </Conditional>
          </Conditional>
        </Conditional>
        <Conditional
          args="eventStyle"
          condition={eventStyle => eventStyle === "fetch"}
        >
          <DisabledCheckbox
            name="renderDecisions"
            label="Render visual personalization decisions"
            description="Check this to render visual personalization decisions."
            value
          />
          <DisabledCheckbox
            name="sendNotifications"
            label="Automatically send a display notification"
            description="Check this to automatically send a display notification."
            value={false}
          />
          {propositionMetadata}
        </Conditional>
      </Section>
    </Conditional>
    <Conditional
      args="eventStyle"
      condition={eventStyle => eventStyle === "standard"}
    >
      <Section label="Configuration overrides">
        <ConfigOverrides />
        <TextField
          name="datasetId"
          label="Dataset ID (deprecated)"
          description={
            'Send data to a different dataset than what\'s been provided in the datastream. Note: this option is deprecated. Use "Event dataset" instead.'
          }
        />
      </Section>
    </Conditional>
  </Form>
);

renderForm(SendEventForm);
