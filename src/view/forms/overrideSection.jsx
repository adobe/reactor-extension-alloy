import React from "react";
import { TextField, Item } from "@adobe/react-spectrum";
import PropTypes from "prop-types";
import { useField } from "formik";
import FormikKeyedComboBox from "../components/formikReactSpectrum3/formikKeyedComboBox";
import DataElementSelector from "../components/dataElementSelector";
import nestedObject from "./nestedObject";
import { string } from "yup";
import singleDataElementRegex from "../constants/singleDataElementRegex";
import conditional from "./conditional";

const NONE = "none";
const DISABLE = "disable";
const DATASTREAM = "datastream";
const OVERRIDE = "override";

export default function overrideSection({
  name,
  label,
  wrapInWell = true,
  isAction = true,
  allowsDisable = true,
  isDisabled = false,
  isTopLevel = false,
}, children = []) {

  const items = [];
  let dataElementDescription = "The data element should resolve to the override behavior: ";
  if (isTopLevel) {
    items.push({value: NONE, label: "No override"});
    dataElementDescription += "false to provide no override";
  } else {
    items.push({value: NONE, label: "No override"});
    dataElementDescription += "'none' to provide no override";
  }

  if (isTopLevel) {
    items.push({value: OVERRIDE, label: "Provide overrides"});
    dataElementDescription += ", true to provide overrides";
  } else if (children.length > 0) {
    items.push({value: OVERRIDE, label: "Enable service and provide overrides"});
    dataElementDescription += ", true to enable the service and provide overrides";
  } else if (isAction) {
    items.push({value: OVERRIDE, label: "Enable service"});
    dataElementDescription += ", true to enable the service";
  }

  if (allowsDisable) {
    items.push({value: DISABLE, label: "Disable service"});
    dataElementDescription += ", false to disable the service";
  }

  if (children.length > 0 && isAction) {
    items.push({value: DATASTREAM, label: "Clear extension config override"});
    dataElementDescription += ", 'clear' to clear the extension config override";
  }
  dataElementDescription += ".";

  const overrideSelector = {
    getInitialValues({ initInfo }) {
      const value = initInfo.settings;
      let enabled = value;
      if (value === undefined) {
        enabled = items[0].value;
      } else if (value?.enabled === false) {
        enabled = DISABLE;
      } else if (Object.keys(value).length > 0 || isAction) {
        enabled = OVERRIDE;
      } else if (Object.keys(value).length === 0) {
        enabled = DATASTREAM;
      }
      return { enabled };
    },
    getSettings({ values }) {
      const { enabled } = values;
      return { enabled };
    },
    getValidationShape() {
      return {
        enabled: string().test(
          "enabled",
          "Please choose an override behavior from the list or specify a single data element.",
          (value) => {
            return items.find(item => item.value === value) || value.match(singleDataElementRegex)
          }
        ).required("Please choose an override behavior from the list or specify a single data element."),
      }
    },
    Component: ({ namePrefix = "", ...props }) => {
      console.log("overrideSection", `${namePrefix}enabled`, props);

      const [{value: enabledInDatastream}] = useField(`${namePrefix}datastream.enabled`);
      const [{value: enabled}] = useField(`${namePrefix}enabled`);

      const fieldLabel = wrapInWell ? null : label;

      if (allowsDisable && !enabledInDatastream) {
        return (
          <TextField
            data-test-id={`${namePrefix}${name}DisabledField`}
            label={fieldLabel}
            aria-label="Override behavior"
            value="No override"
            description="This service is not configured on the datastream."
            width="size-5000"
            isDisabled
          />
        )
      }

      console.log("overrideSection", name, enabled);

      return (
        <DataElementSelector>
          <FormikKeyedComboBox
            data-test-id={`${namePrefix}${name}OverrideSelector`}
            name={`${namePrefix}enabled`}
            label={fieldLabel}
            aria-label="Override behavior"
            width="size-5000"
            allowsCustomValue={true}
            getKey={(item) => item.value}
            getLabel={(item) => item.label}
            items={items}
            description={enabled.match(singleDataElementRegex) ? dataElementDescription : null}
            isDisabled={isDisabled}
            {...props}
          >
            {(item) => (
              <Item key={item.value} data-test-id={item.value}>
                {item.label}
              </Item>
            )}
          </FormikKeyedComboBox>
        </DataElementSelector>
      );
    },
  };

  overrideSelector.Component.propTypes = {
    namePrefix: PropTypes.string,
  };

  const conditionals = [];

  if (children.length > 0) {
    conditionals.push(
      conditional({
        args: ["enabled"],
        condition: (enabled) => enabled === OVERRIDE || enabled.match(singleDataElementRegex),
      }, children)
    );
  }
  return nestedObject({
    name,
    label: wrapInWell ? label : "",
    wrapGetSettings: (getSettings) => ({ values }) => {
      const { enabled, ...otherSettings } = getSettings({ values }) || {};
      if (enabled === NONE) {
        return undefined;
      }
      if (enabled === DISABLE) {
        return { enabled: false };
      }
      if (enabled === OVERRIDE) {
        return otherSettings;
      }
      if (enabled === DATASTREAM) {
        return {};
      }
      // data element
      return { enabled, ...otherSettings };
    },
  }, [overrideSelector, ...conditionals]);

}
