import { ALWAYS, COMMAND, CONTEXT } from "../constants/autoPopulationSource";
import { OBJECT } from "../constants/schemaType";

export default ({ formStateNode }) => {
  const { autoPopulationSource, contextKey, schema } = formStateNode;

  if (autoPopulationSource === ALWAYS) {
    return "This field will be auto-populated when provided as the XDM object for a Send Event Action";
  }
  if (autoPopulationSource === COMMAND) {
    return "This field may be specified as an option to the Send Event Action";
  }
  if (autoPopulationSource === CONTEXT && schema.type !== OBJECT) {
    return `This field will be auto-populated when the "${contextKey}" context is configured.`;
  }
  if (autoPopulationSource === CONTEXT && schema.type === OBJECT) {
    return `Some of the attributes of this field will be auto-populated when the "${contextKey}" context is configured.`;
  }
  return "";
};
