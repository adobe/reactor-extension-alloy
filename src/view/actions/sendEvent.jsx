/*
Copyright 2023 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
*/
import React from "react";
import { Link } from "@adobe/react-spectrum";

import { string } from "yup";
import checkbox from "../forms/checkbox";
import comboBox from "../forms/comboBox";
import instancePicker from "../forms/instancePicker";
import form from "../forms/form";
import radioGroup from "../forms/radioGroup";
import section from "../forms/section";
import dataElement from "../forms/dataElement";
import stringArray from "../forms/stringArray";
import disabledTextField from "../forms/disabledTextField";
import conditional from "../forms/conditional";
import disabledCheckbox from "../forms/disabledCheckbox";
import configOverrides from "../forms/configOverrides";

import eventTypes from "./constants/eventTypes";

import renderForm from "../forms/renderForm";
import textField from "../forms/textField";
import { validateSurface } from "../utils/surfaceUtils";

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
    sendDisplayEvent,
    includeRenderedPropositions,
    ...settings
  } = getSettings({ values });
  if (
    decisionScopes ||
    surfaces ||
    sendDisplayEvent === false ||
    includeRenderedPropositions
  ) {
    settings.personalization = {};
  }
  if (decisionScopes) {
    settings.personalization.decisionScopes = decisionScopes;
  }
  if (surfaces) {
    settings.personalization.surfaces = surfaces;
  }
  if (sendDisplayEvent === false) {
    settings.personalization.sendDisplayEvent = sendDisplayEvent;
  }
  if (includeRenderedPropositions) {
    settings.personalization.includeRenderedPropositions = includeRenderedPropositions;
  }
  return settings;
};

const eventTypeField = comboBox({
  name: "type",
  label: "Type",
  description:
    "Enter an event type to populate the `eventType` XDM field. Select a predefined value or enter a custom value.",
  dataElementDescription:
    "Enter a data element that resolves to an event type.",
  items: Object.keys(eventTypes).reduce((items, key) => {
    items.push({ value: key, label: eventTypes[key] });
    return items;
  }, []),
  allowsCustomValue: true
});

const fetchEventTypeField = disabledTextField({
  name: "type",
  label: "Type",
  description:
    "Enter an event type to populate the `eventType` XDM field. Select a predefined value or enter a custom value.",
  value: "decisioning.propositionFetch",
  valueLabel: "Decisioning Proposition Fetch"
});

const xdmField = dataElement({
  name: "xdm",
  label: "XDM",
  description: xdmFieldDescription
});

const dataField = dataElement({
  name: "data",
  label: "Data",
  description: "Provide a data element which returns an object to send as data."
});

const includeRenderedPropositionsField = checkbox({
  name: "includeRenderedPropositions",
  label: "Include rendered propositions",
  description:
    "Check this to include propositions that have been rendered, but the display notification has not been sent. This will populate the `_experience.decisioning` XDM field with information about rendered personalization.",
  defaultValue: false
});

const disabledIncludeRenderedPropositionsField = disabledCheckbox({
  name: "includeRenderedPropositions",
  label: "Include renderedPropositions",
  description:
    "Check this to include propositions that have been rendered, but the display notification has not been sent. This will populate the `_experience.decisioning` XDM field with information about rendered personalization.",
  value: true
});

const documentUnloadingField = checkbox({
  name: "documentUnloading",
  label: "Document will unload",
  description:
    "Check this to ensure the event will reach the server even if the user is navigating away from the current document (page). Any response from the server will be ignored."
});

const mergeIdField = dataElement({
  name: "mergeId",
  label: "Merge ID (Deprecated)",
  description:
    "Provide an identifier used to merge multiple events. This will populate the `eventMergeId` XDM field. This field has been deprecated because it is not supported by Adobe Experience Platform."
});

const decisionScopesField = stringArray({
  name: "decisionScopes",
  label: "Scopes",
  singularLabel: "Scope",
  description: "Create an array of decision scopes to query with the event.",
  dataElementDescription:
    "This data element should resolve to an array of scopes."
});

const surfacesField = stringArray({
  name: "surfaces",
  label: "Surfaces",
  singularLabel: "Surface",
  description: "Create an array of surfaces to query with the event.",
  dataElementDescription:
    "This data element should resolve to an array of surfaces.",
  validationSchema: string().test(
    "is-surface",
    () => "Please provide a valid surface",
    (value, testContext) => {
      const message = validateSurface(value);
      if (message) {
        return testContext.createError({ message });
      }
      return true;
    }
  )
});

const renderDecisionsField = checkbox({
  name: "renderDecisions",
  label: "Render visual personalization decisions",
  description: "Check this to render visual personalization decisions.",
  defaultValue: false
});

const renderDecisionsChecked = disabledCheckbox({
  name: "renderDecisions",
  label: "Render visual personalization decisions",
  description: "Check this to render visual personalization decisions.",
  value: true
});

const sendDisplayEventField = conditional(
  {
    args: "renderDecisions",
    condition: renderDecisions => renderDecisions
  },
  [
    checkbox({
      name: "sendDisplayEvent",
      label: "Automatically send a display event",
      description:
        "Check this to automatically send an extra experience event containing display event after personalization is rendered. Uncheck this so that you can include the display notifications in a subsequent event.",
      defaultValue: true
    })
  ]
);

const sendDisplayEventUnchecked = disabledCheckbox({
  name: "sendDisplayEvent",
  label: "Automatically send a display event",
  description:
    "Check this to automatically send an extra experience event containing display notifications after personalization is rendered. Uncheck this so that you can include the display notifications in a subsequent event.",
  value: false
});

const configOverrideFields = configOverrides();
const datasetIdField = textField({
  name: "datasetId",
  label: "Dataset ID (deprecated)",
  description:
    "Send data to a different dataset than what's been provided in the datastream. Note: this field is deprecated. Use the 'Event dataset' field instead."
});

const sendEventForm = form(
  {
    wrapGetInitialValues,
    wrapGetSettings
  },
  [
    instancePicker({ name: "instanceName" }),
    radioGroup({
      name: "eventStyle",
      label: "Guided event style",
      dataElementSupported: false,
      defaultValue: UNGUIDED,
      items: [
        {
          value: FETCH,
          label: "Top of page event - request personalization decisions."
        },
        { value: COLLECT, label: "Bottom of page event - collect analytics." },
        { value: UNGUIDED, label: "Unguided - show all fields." }
      ],
      description:
        "Event styles automatically fill in or hide certain fields below. Top of page events fetch personalization decisions and do not record events in Adobe Analytics and have the type decisioning.propositionFetch. Bottom of page events record events and do not request personalization decisions. The unguided event style shows all fields."
    }),
    conditional(
      {
        args: "eventStyle",
        condition: eventStyle => eventStyle === UNGUIDED
      },
      [
        section({ label: "Data" }, [
          eventTypeField,
          xdmField,
          dataField,
          includeRenderedPropositionsField,
          documentUnloadingField,
          mergeIdField
        ]),
        section({ label: "Personalization" }, [
          decisionScopesField,
          surfacesField,
          renderDecisionsField,
          sendDisplayEventField
        ]),
        configOverrideFields,
        datasetIdField
      ]
    ),
    conditional(
      {
        args: "eventStyle",
        condition: eventStyle => eventStyle === FETCH
      },
      [
        section({ label: "Data" }, [fetchEventTypeField, xdmField, dataField]),
        section({ label: "Personalization" }, [
          decisionScopesField,
          surfacesField,
          renderDecisionsChecked,
          sendDisplayEventUnchecked
        ]),
        configOverrideFields
      ]
    ),
    conditional(
      {
        args: "eventStyle",
        condition: eventStyle => eventStyle === COLLECT
      },
      [
        section({ label: "Data" }, [
          eventTypeField,
          xdmField,
          dataField,
          disabledIncludeRenderedPropositionsField
        ]),
        configOverrideFields
      ]
    )
  ]
);

renderForm(sendEventForm);
