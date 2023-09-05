import React from "react";
import SectionHeader from "../components/sectionHeader";
import form from "./form";

/**
 * This creates a section header with a learn more url.
 * @param {object} options
 * @param {string} options.label - The heading to use for the field.
 * @param {string} [options.learnMoreUrl] - The url to use for the learn more link.
 * @param {Form[]} [children=[]] - The children forms to include in the section.
 * @returns {FormPart}
 */
export default function section({ label, learnMoreUrl }, children = []) {
  const { getInitialValues, getSettings, validationSchema, Component } = form({}, children);

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
}
