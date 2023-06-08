import React from "react";
import propositionMetadata from "../forms/propositionMetadata";
import Form from "../forms/form";
import InstancePicker from "../forms/instancePicker";
import Conditional from "../forms/conditional";
import StringArray from "../forms/stringArray";
import RadioGroup from "../forms/radioGroup";
import renderForm from "../forms/renderForm";

const ApplyPropositionsForm = (
  <Form>
    <InstancePicker name="instanceName" />
    <RadioGroup
      name="propositions"
      label="Propositions"
      dataElementDescription="Provide a data element that resolves to an array of propositions"
      items={[
        { value: "all", label: "All propositions" },
        { value: "scoped", label: "Propositions from specific scopes" }
      ]}
      defaultValue="all"
    />
    <Conditional
      args="propositions"
      condition={propositions => propositions === "scoped"}
    >
      <StringArray
        name="scopes"
        label="Scopes"
        singularLabel="Scope"
        description="Provide a list of scopes to render."
        dataElementDescription="Provide a data element that resolves to an array of strings."
        isRequired
      />
    </Conditional>
    {propositionMetadata}
  </Form>
);

renderForm(ApplyPropositionsForm);