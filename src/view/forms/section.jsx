import React from "react";
import SectionHeader from "../components/sectionHeader";
import form from "./form";

/**
 * This creates a section header with a learn more url.
 * @param {object} props
 * @param {string} props.label - The heading to use for the field.
 * @param {string} [props.learnMoreUrl] - The url to use for the learn more link.
 * @returns {FormPart}
 */
export default ({ label, learnMoreUrl, children }) => {
  const { getInitialValues, getSettings, validationSchema, Component } = form({
    children
  });

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
