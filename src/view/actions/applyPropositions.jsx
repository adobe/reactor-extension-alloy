import createExtensionView from "../formBuilders/createExtensionView";
import createTextField from "../formBuilders/createTextField";
import render from "../render";
import createStringArray from "../formBuilders/createStringArray";
import createComboBox from "../formBuilders/createComboBox";
import createRadioGroup from "../formBuilders/createRadioGroup";
import createObjectArray from "../formBuilders/createObjectArray";
import createInstancePicker from "../formBuilders/createInstancePicker";
import createConditional from "../formBuilders/createConditional";

const ApplyPropositionsExtensionView = createExtensionView(
  createInstancePicker({ key: "instanceName" }),
  createRadioGroup({
    key: "propositions",
    label: "Propositions",
    dataElementDescription:
      "Provide a data element that resolves to an array of propositions",
    items: [
      { value: "all", label: "All propositions" },
      { value: "scoped", label: "Propositions from specific scopes" }
    ],
    defaultValue: "all"
  }),
  createConditional(
    "propositions",
    propositions => propositions === "scoped",
    createStringArray({
      key: "scopes",
      label: "Scopes",
      singularLabel: "Scope",
      description: "Provide a list of scopes to render.",
      dataElementDescription:
        "Provide a data element that resolves to an array of strings.",
      isRequired: true
    })
  ),
  createObjectArray(
    {
      key: "metadata",
      label: "Metadata",
      singularLabel: "Scope",
      dataElementDescription:
        "Provide a data element that resolves to an object with keys of the scopes, and values an object with keys: selector and actionType.",
      objectKey: "scope",
      objectLabelPlural: "Scopes"
    },
    createTextField({
      key: "scope",
      label: "Scope",
      isRequired: true,
      description: "Enter your scope"
    }),
    createTextField({
      key: "selector",
      label: "Selector",
      isRequired: true,
      description: "Enter your selector"
    }),
    createComboBox({
      key: "actionType",
      label: "Action Type",
      description: "Select your action type",
      isRequired: true,
      items: [
        { value: "setHtml", label: "Set HTML" },
        { value: "replaceHtml", label: "Replace HTML" },
        { value: "appendHtml", label: "Append HTML" }
      ]
    })
  )
);

render(ApplyPropositionsExtensionView);
