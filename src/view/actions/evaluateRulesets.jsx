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
import renderForm from "../forms/renderForm";
import form from "../forms/form";
import instancePicker from "../forms/instancePicker";
import checkbox from "../forms/checkbox";
import simpleMap from "../forms/simpleMap";

const evaluateRulesetsForm = form({}, [
  instancePicker({ name: "instanceName" }),
  checkbox({
    name: "renderDecisions",
    label: "Render decisions",
    description:
      "Select this option to render decisions. If you do not select this option, decisions will not be rendered.",
    defaultValue: false
  }),
  simpleMap({
    name: "decisionContext",
    label: "Decision context",
    singularLabel: "Context item",
    dataElementDescription:
      "Provide a data element that resolves to a map of strings",
    keyLabel: "Key",
    keyLabelPlural: "Keys",
    keyDescription: "Enter the context key",
    valueLabel: "Value",
    valueDescription: "Enter the context value"
  })
]);

renderForm(evaluateRulesetsForm);
