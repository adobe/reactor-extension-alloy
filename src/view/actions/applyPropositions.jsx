import renderForm from "../forms/renderForm";
import form from "../forms/form";
import instancePicker from "../forms/instancePicker";
import textField from "../forms/textField";
import objectArray from "../forms/objectArray";
import dataElement from "../forms/dataElement";
import comboBox from "../forms/comboBox";

const applyPropositionsForm = form({}, [
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
        "Provide a data element that resolves to an object with keys of the scopes, and values an object with keys: selector and actionType.",
      objectKey: "scope",
      objectLabelPlural: "Scopes"
    },
    [
      textField({
        name: "scope",
        label: "Scope",
        isRequired: true,
        description: "Enter your scope"
      }),
      textField({
        name: "selector",
        label: "Selector",
        isRequired: true,
        description: "Enter your selector"
      }),
      comboBox({
        name: "actionType",
        label: "Action Type",
        description: "Select your action type",
        isRequired: true,
        items: [
          { value: "setHtml", label: "Set HTML" },
          { value: "replaceHtml", label: "Replace HTML" },
          { value: "appendHtml", label: "Append HTML" }
        ]
      })
    ]
  )
]);

renderForm(applyPropositionsForm);