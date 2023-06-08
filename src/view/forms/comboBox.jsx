import React from "react";
import { string } from "yup";
import { Item } from "@adobe/react-spectrum";
import { useField } from "formik";
import PropTypes from "prop-types";
import DataElementSelector from "../components/dataElementSelector";
import FormikKeyedComboBox from "../components/formikReactSpectrum3/formikKeyedComboBox";
import singleDataElementRegex from "../constants/singleDataElementRegex";

/**
 * Form builder for a combo box. Use this when you have a static list of items.
 * @param {object} props
 * @param {string} props.name - The formik key for the field.
 * @param {boolean} [props.isRequired=false] - If true, an asterisk is added
 * to the label, and the schema is updated to require the field.
 * @param {boolean} [props.dataElementSupported=true] - If true, the field
 * will support data elements.
 * @param {string} props.label - The label for the field.
 * @param {string} [props.description] - The description text to put under the
 * combo box.
 * @param {string} [props.dataElementDescription] - The description text to
 * put under the combo box when a data element is chosen. This is useful to tell
 * what the data element should resolve to.
 * @param {array} props.items - An array of objects with keys "value" and
 * "label". The "value" is the value that will be saved to the settings, and the
 * "label" is the text that will be shown in the combo box.
 */
export default ({
  name,
  isRequired = false,
  dataElementSupported = true,
  label,
  description,
  dataElementDescription,
  items
}) => {
  let fieldSchema = string().test(
    name,
    `Please choose a ${label.toLowerCase()} from the list or specify a single data element.`,
    value =>
      value &&
      (items.find(item => item.value === value) ||
        value.match(singleDataElementRegex))
  );
  if (isRequired) {
    fieldSchema = fieldSchema.required(
      `Please choose a ${label.toLowerCase()}.`
    );
  }

  // DataElementSelector looks for name and label to do its calculations, so we have to have them here.
  const InnerComponent = ({
    name: innerName,
    label: innerLabel,
    description: innerDescription
  }) => {
    return (
      <FormikKeyedComboBox
        data-test-id={`${innerName}Field`}
        name={innerName}
        label={innerLabel}
        isRequired={isRequired}
        description={innerDescription}
        width="size-5000"
        items={items}
        allowsCustomValue={dataElementSupported}
        getKey={item => item.value}
        getLabel={item => item.label}
      >
        {item => (
          <Item key={item.value} data-test-id={item.value}>
            {item.label}
          </Item>
        )}
      </FormikKeyedComboBox>
    );
  };
  InnerComponent.propTypes = {
    name: PropTypes.string.isRequired,
    label: PropTypes.string,
    description: PropTypes.string
  };

  const part = {
    getInitialValues({ initInfo }) {
      const { [name]: value = "" } = initInfo.settings || {};
      const item = items.find(({ value: v }) => v === value);
      return { [name]: item ? item.value : value };
    },
    getSettings({ values }) {
      const settings = {};
      if (values[name]) {
        const item = items.find(({ label: l }) => l === values[name]);
        settings[name] = item ? item.value : values[name];
      }
      return settings;
    },
    validationShape: {
      [name]: fieldSchema
    },
    Component: ({ namePrefix = "" }) => {
      if (dataElementSupported) {
        const [{ value = "" }] = useField(`${namePrefix}${name}`);
        return (
          <DataElementSelector>
            <InnerComponent
              name={`${namePrefix}${name}`}
              label={label}
              description={
                value.match(singleDataElementRegex)
                  ? dataElementDescription
                  : description
              }
            />
          </DataElementSelector>
        );
      }
      return (
        <InnerComponent
          name={`${namePrefix}${name}`}
          label={label}
          description={description}
        />
      );
    }
  };
  part.Component.propTypes = {
    namePrefix: PropTypes.string
  };
  return part;
};
