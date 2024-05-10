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
import renderForm from "../forms/renderForm";
import form from "../forms/form";
import instancePicker from "../forms/instancePicker";
import textField from "../forms/textField";
import objectArray from "../forms/objectArray";
import dataElement from "../forms/dataElement";
import comboBox from "../forms/comboBox";
import radioGroup from "../forms/radioGroup";
import conditional from "../forms/conditional";
import { DATA_ELEMENT_REQUIRED } from "../constants/validationErrorMessages";
import singleDataElementRegex from "../constants/singleDataElementRegex";

const wrapGetInitialValues = getInitialValues => args => {
  const initialValues = getInitialValues(args);
  if (initialValues.metadata && initialValues.metadata.length > 0) {
    initialValues.metadata = initialValues.metadata.map(
      ({ scope, selector, element, actionType }) => {
        return {
          scope,
          selector,
          element,
          actionType,
          elementType: element ? "element" : "selector"
        };
      }
    );
  }
  return initialValues;
};

const wrapGetSettings = getSettings => args => {
  const settings = getSettings(args);
  if (settings.metadata && settings.metadata.length > 0) {
    settings.metadata = Object.keys(settings.metadata || {}).reduce(
      (memo, scope) => {
        // eslint-disable-next-line unused-imports/no-unused-vars
        const { elementType, ...rest } = settings.metadata[scope];
        memo[scope] = rest;
        return memo;
      },
      {}
    );
  }
  return settings;
};

const applyPropositionsForm = form({ wrapGetInitialValues, wrapGetSettings }, [
  instancePicker({ name: "instanceName" }),
  dataElement({
    name: "propositions",
    label: "Propositions",
    description:
      'Provide a data element that resolves to an array of propositions to render. Enter "%event.propositions%" if this is an action of a Send event complete event.'
  }),
  textField({
    name: "viewName",
    label: "View name",
    description: "Provide a view to render the propositions for that view."
  }),
  objectArray(
    {
      name: "metadata",
      label: "Proposition metadata",
      singularLabel: "Scope",
      dataElementDescription:
        "Provide a data element that resolves to an object scope keys, and object values with keys: selector and actionType.",
      objectKey: "scope",
      objectLabelPlural: "Scopes",
      isRowEmpty: ({ scope, selector, actionType }) =>
        scope === "" && selector === "" && actionType === ""
    },
    [
      textField({
        name: "scope",
        label: "Scope",
        description: "Enter your scope",
        validationSchemaBase: string().required("Please provide a scope.")
      }),
      radioGroup({
        name: "elementType",
        label: "Target element",
        items: [
          { value: "selector", label: "Selector" },
          { value: "element", label: "Element" }
        ],
        defaultValue: "selector",
        orientation: "horizontal",
        dataElementSupported: false
      }),
      conditional(
        {
          args: "elementType",
          condition: elementType => elementType === "selector"
        },
        [
          textField({
            name: "selector",
            ariaLabel: "Selector",
            description: "Enter a css-selector for the target element.",
            validationSchemaBase: string().required(
              "Please provide a selector."
            )
          })
        ]
      ),
      conditional(
        {
          args: "elementType",
          condition: elementType => elementType === "element"
        },
        [
          textField({
            name: "element",
            ariaLabel: "Element",
            description:
              "Provide a data element that resolves to a DOM element.",
            validationSchemaBase: string()
              .required("Please provide an element.")
              .matches(singleDataElementRegex, DATA_ELEMENT_REQUIRED)
          })
        ]
      ),
      comboBox({
        name: "actionType",
        label: "Action Type",
        description: "Select your action type",
        items: [
          { value: "setHtml", label: "Set HTML" },
          { value: "replaceHtml", label: "Replace HTML" },
          { value: "appendHtml", label: "Append HTML" },
          { value: "track", label: "Track" }
        ],
        validationSchemaBase: string().required(
          "Please provide an action type."
        )
      })
    ]
  )
]);

renderForm(applyPropositionsForm);
