import React from "react";
import FormElementContainer from "../components/formElementContainer";

export const combineGetInitialValues = parts => ({ initInfo }) => {
  return parts
    .filter(part => part.getInitialValues)
    .reduce((values, part) => {
      return {
        ...values,
        ...part.getInitialValues({ initInfo })
      };
    }, {});
};

export const combineGetSettings = parts => ({ values }) => {
  return parts
    .filter(part => part.getSettings)
    .reduce((settings, part) => {
      return {
        ...settings,
        ...part.getSettings({ values })
      };
    }, {});
};

export const combineValidationSchemas = parts => {
  return parts
    .filter(part => part.validationSchema)
    .reduce((shape, part) => {
      return {
        ...shape,
        ...part.validationSchema
      };
    }, {});
};

export const combineComponents = parts => props => {
  return (
    <FormElementContainer>
      {parts.map((part, index) => {
        const { Component } = part;
        return <Component key={`${index}`} {...props} />;
      })}
    </FormElementContainer>
  );
};

export const simpleGetInitialValues = ({ defaultValue = "", key }) => ({
  initInfo
}) => {
  const { [key]: value = defaultValue } = initInfo.settings || {};
  return { [key]: value };
};

export const simpleGetSettings = ({ defaultValue = "", key }) => ({
  values
}) => {
  const settings = {};
  if (values[key] !== defaultValue) {
    settings[key] = values[key];
  }
  return settings;
};
