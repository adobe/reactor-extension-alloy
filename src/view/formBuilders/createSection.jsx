import React from "react";
import SectionHeader from "../components/sectionHeader";
import {
  combineComponents,
  combineGetInitialValues,
  combineGetSettings,
  combineValidationSchemas
} from "./utils";

/**
 * This creates a section header with a learn more url.
 * @param {object} options
 * @param {string} options.label - The heading to use for the field.
 * @param {string} [options.learnMoreUrl] - The url to use for the learn more link.
 * @returns {FormPart}
 */
export default ({ label, learnMoreUrl }, ...parts) => {
  const getInitialValues = combineGetInitialValues(parts);
  const getSettings = combineGetSettings(parts);
  const validationSchema = combineValidationSchemas(parts);
  const Component = combineComponents(parts);

  return {
    getInitialValues,
    getSettings,
    validationSchema,
    Component: props => (
      <>
        <SectionHeader learnMoreUrl={learnMoreUrl}>{label}</SectionHeader>
        <Component {...props} />
      </>
    )
  };
};
