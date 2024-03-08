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
import { string } from "yup";
import form from "../../../../forms/form";
import textField from "../../../../forms/textField";
import objectArray from "../../../../forms/objectArray";
import comboBox from "../../../../forms/comboBox";
import jsonOptionalEditor from "../../../../forms/jsonOptionalEditor";
import numberAwareCompareFunction from "../../../../utils/numberAwareCompareFunction";
import eventCompareFunction from "../../../../utils/eventCompareFunction";

const evarItems = Array.from({ length: 250 }, (_, i) => ({
  label: `eVar${i + 1}`,
  value: `eVar${i + 1}`
}));
const propItems = Array.from({ length: 75 }, (_, i) => ({
  label: `prop${i + 1}`,
  value: `prop${i + 1}`
}));
const numberedEventItems = Array.from({ length: 250 }, (_, i) => ({
  label: `event${i + 1}`,
  value: `event${i + 1}`
}));
const eventItems = [
  { label: "prodView: Product View", value: "prodView" },
  { label: "purchase: Order", value: "purchase" },
  { label: "scAdd: Cart Addition", value: "scAdd" },
  { label: "scCheckout: Checkout", value: "scCheckout" },
  { label: "scOpen: Cart", value: "scOpen" },
  { label: "scRemove: Cart Removal", value: "scRemove" },
  { label: "scView: Cart View", value: "scView" },
  ...numberedEventItems
];
const INVALID_ADDITIONAL_FIELDS_REGEX = /^(eVar\d+|prop\d+|event\d+|contextData)$/;
const additionalFieldsItems = [
  { label: "Campaign", value: "campaign" },
  { label: "Channel", value: "channel" },
  { label: "Link name", value: "linkName" },
  { label: "Link type", value: "linkType" },
  { label: "Link URL", value: "linkURL" },
  { label: "Page name", value: "pageName" },
  { label: "Page URL", value: "pageURL" },
  { label: "Purchase ID", value: "purchaseID" },
  { label: "Products", value: "products" },
  { label: "Referrer", value: "referrer" },
  { label: "Server", value: "server" },
  { label: "Transaction ID", value: "transactionID" },
  { label: "Zip", value: "zip" }
];

const wrapGetInitialValues = getInitialValues => ({ initInfo }) => {
  const originalSettings = initInfo.settings || {};
  const settings = Object.keys(originalSettings).reduce(
    (memo, key) => {
      if (key.startsWith("eVar")) {
        memo.evars[key] = { value: originalSettings[key] };
      } else if (key.startsWith("prop")) {
        memo.props[key] = { value: originalSettings[key] };
      } else if (key !== "events" && key !== "contextData") {
        memo.additionalProperties[key] = { value: originalSettings[key] };
      }
      return memo;
    },
    { evars: {}, props: {}, additionalProperties: {} }
  );
  // Split the events string into an array of events and sort them.
  // Using this regex to handle commas inside of data element names.
  settings.events = Array.from(
    (originalSettings.events || "").matchAll(/(%[^%]+%|[^%,]+)+/g)
  )
    .map(match => match[0].trim())
    .filter(match => match)
    .sort(eventCompareFunction)
    .reduce((memo, event) => {
      const [key, value = ""] = event.split("=");
      const [a, b = ""] = key.split(":");
      memo[a] = { id: b, value };
      return memo;
    }, {});
  if (Object.keys(settings.evars).length === 0) {
    delete settings.evars;
  }
  if (Object.keys(settings.props).length === 0) {
    delete settings.props;
  }
  if (Object.keys(settings.events).length === 0) {
    delete settings.events;
  }
  if (Object.keys(settings.additionalProperties).length === 0) {
    delete settings.additionalProperties;
  }

  if (
    originalSettings.contextData &&
    typeof originalSettings.contextData === "string"
  ) {
    settings.contextData = originalSettings.contextData;
  } else {
    settings.contextData = Object.keys(
      originalSettings.contextData || {}
    ).reduce((memo, key) => {
      memo[key] = originalSettings.contextData[key];
      return memo;
    }, {});
    if (Object.keys(settings.contextData).length === 0) {
      delete settings.contextData;
    }
  }

  const initialValues = getInitialValues({
    initInfo: {
      ...initInfo,
      settings
    }
  });
  return initialValues;
};

const wrapGetSettings = getSettings => ({ values }) => {
  const {
    evars = {},
    props = {},
    events = {},
    contextData = {},
    additionalProperties = {}
  } = getSettings({ values });
  const flattenedEvars = Object.keys(evars)
    .sort(numberAwareCompareFunction)
    .reduce((memo, key) => {
      memo[key] = evars[key].value || "";
      return memo;
    }, {});
  const flattenedProps = Object.keys(props)
    .sort(numberAwareCompareFunction)
    .reduce((memo, key) => {
      memo[key] = props[key].value || "";
      return memo;
    }, {});
  const flattenedAdditionalProperties = Object.keys(
    additionalProperties
  ).reduce((memo, key) => {
    memo[key] = additionalProperties[key].value || "";
    return memo;
  }, {});
  const eventString = Object.keys(events)
    .sort(eventCompareFunction)
    .map(key => {
      const { id, value } = events[key];
      if (value && id) {
        return `${key}:${id}=${value}`;
      }
      if (value) {
        return `${key}=${value}`;
      }
      if (id) {
        return `${key}:${id}`;
      }
      return key;
    })
    .join(",");
  const finalSettings = {
    ...flattenedAdditionalProperties,
    ...flattenedEvars,
    ...flattenedProps
  };
  if (Object.keys(events).length > 0) {
    finalSettings.events = eventString;
  }
  if (typeof contextData === "string") {
    finalSettings.contextData = contextData;
  } else {
    const flattenedContextData = Object.keys(contextData)
      .sort(numberAwareCompareFunction)
      .reduce((memo, key) => {
        memo[key] = contextData[key].value || "";
        return memo;
      }, {});
    if (Object.keys(flattenedContextData).length > 0) {
      finalSettings.contextData = flattenedContextData;
    }
  }
  return Object.keys(finalSettings)
    .sort(numberAwareCompareFunction)
    .reduce((memo, key) => {
      memo[key] = finalSettings[key] || "";
      return memo;
    }, {});
};

const analyticsForm = form(
  {
    wrapGetInitialValues,
    wrapGetSettings
  },
  [
    objectArray(
      {
        name: "evars",
        singularLabel: "eVar",
        objectKey: "evar",
        objectLabelPlural: "eVars",
        dataElementSupported: false,
        horizontal: true
      },
      [
        comboBox({
          name: "evar",
          dataElementSupported: false,
          items: evarItems,
          width: "size-3000",
          label: "eVar"
        }),
        textField({
          name: "value",
          width: "size-3000",
          label: "Value"
        })
      ]
    ),
    objectArray(
      {
        name: "props",
        singularLabel: "Prop",
        objectKey: "prop",
        objectLabelPlural: "Props",
        dataElementSupported: false,
        horizontal: true
      },
      [
        comboBox({
          name: "prop",
          dataElementSupported: false,
          items: propItems,
          width: "size-3000",
          label: "Prop"
        }),
        textField({
          name: "value",
          width: "size-3000",
          label: "Value"
        })
      ]
    ),
    objectArray(
      {
        name: "events",
        singularLabel: "Event",
        objectKey: "event",
        objectLabelPlural: "Events",
        dataElementSupported: false,
        horizontal: true,
        compareFunction: eventCompareFunction
      },
      [
        comboBox({
          name: "event",
          dataElementSupported: false,
          items: eventItems,
          width: "size-3000",
          label: "Event"
        }),
        textField({
          name: "id",
          width: "size-2000",
          label: "Event ID (optional)"
        }),
        textField({
          name: "value",
          width: "size-3000",
          label: "Event value (optional)"
        })
      ]
    ),
    objectArray(
      {
        name: "contextData",
        label: "Context data",
        singularLabel: "Context data key",
        objectKey: "key",
        objectLabelPlural: "Context data values",
        horizontal: true
      },
      [
        textField({
          name: "key",
          dataElementSupported: false,
          width: "size-3000",
          label: "Context data key"
        }),
        textField({
          name: "value",
          width: "size-3000",
          label: "Value"
        })
      ]
    ),
    objectArray(
      {
        name: "additionalProperties",
        singularLabel: "Property",
        objectKey: "property",
        objectLabelPlural: "Properties",
        dataElementSupported: false,
        horizontal: true
      },
      [
        comboBox({
          name: "property",
          dataElementSupported: false,
          items: additionalFieldsItems,
          width: "size-3000",
          label: "Additional properties",
          allowsCustomValue: true,
          validationSchemaBase: string().test(
            "is-valid-additional-property",
            "Please use the fields provided above for this property.",
            value => !INVALID_ADDITIONAL_FIELDS_REGEX.test(value)
          )
        }),
        textField({
          name: "value",
          width: "size-3000",
          label: "Value"
        })
      ]
    )
  ]
);

/*
const testForm = form({}, [
  textField({
    name: "testField",
    label: "Test Field",
    isRequired: true
  }),
  textField({
    name: "testField2",
    label: "Test Field 2",
    isRequired: true
  })
]); */

export default jsonOptionalEditor(
  {
    name: "value",
    optionName: "populationStrategy",
    "aria-label": "Population strategy"
  },
  [analyticsForm]
);
