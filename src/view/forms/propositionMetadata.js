import objectArray from "./objectArray";
import textField from "./textField";
import comboBox from "./comboBox";

export default (
  objectArray({
    name: "metadata",
    label: "Proposition metadata",
    singularLabel: "Scope",
    dataElementDescription:
      "Provide a data element that resolves to an object with keys of the scopes, and values an object with keys: selector and actionType.",
    objectKey: "scope",
    objectLabelPlural: "Scopes"
  },[
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
  ])
);
