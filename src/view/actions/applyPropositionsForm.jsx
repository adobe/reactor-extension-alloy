import React from "react";
import propositionMetadata from "../forms/propositionMetadata";
import form from "../forms/form";
import instancePicker from "../forms/instancePicker";
import conditional from "../forms/conditional";
import stringArray from "../forms/stringArray";
import radioGroup from "../forms/radioGroup";

export default (
  form({},[
    instancePicker({ name: "instanceName" }),
    radioGroup({
      name: "propositions",
      label: "Propositions",
      dataElementDescription: "Provide a data element that resolves to an array of propositions",
      isRequired: true,
      items: [
        { value: "all", label: "All propositions" },
        { value: "scoped", label: "Propositions from specific scopes" }
      ]
    }),
    conditional({
      args: "propositions",
      condition: propositions => propositions === "scoped"
    },[
      stringArray({
        name: "scopes",
        label: "Scopes",
        singularLabel: "Scope",
        description: "Provide a list of scopes to render.",
        dataElementDescription: "Provide a data element that resolves to an array of strings.",
        isRequired: true
      })
    ])
  ])
);
