import React from "react";
import ObjectArray from "./objectArray";
import TextField from "./textField";
import ComboBox from "./comboBox";

export default (
  <ObjectArray
    name="metadata"
    label="Proposition metadata"
    singularLabel="Scope"
    dataElementDescription="Provide a data element that resolves to an object with keys of the scopes, and values an object with keys: selector and actionType."
    objectKey="scope"
    objectLabelPlural="Scopes"
  >
    <TextField
      name="scope"
      label="Scope"
      isRequired
      description="Enter your scope"
    />
    <TextField
      name="selector"
      label="Selector"
      isRequired
      description="Enter your selector"
    />
    <ComboBox
      name="actionType"
      label="Action Type"
      description="Select your action type"
      isRequired
      items={[
        { value: "setHtml", label: "Set HTML" },
        { value: "replaceHtml", label: "Replace HTML" },
        { value: "appendHtml", label: "Append HTML" }
      ]}
    />
  </ObjectArray>
);
