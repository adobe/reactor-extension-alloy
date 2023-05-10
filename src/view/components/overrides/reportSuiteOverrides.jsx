import { ActionButton, Button, Flex, Item } from "@adobe/react-spectrum";
import Delete from "@spectrum-icons/workflow/Delete";
import { FieldArray, useField } from "formik";
import PropTypes from "prop-types";
import React from "react";
import OverrideInput from "./overrideInput";
import { FIELD_NAMES } from "./utils";

/**
 * The section of the page that allows the user to input a variable number of
 * report suite overrides.
 *
 * @param {Object} props
 * @param {string} props.prefix The common prefix for all the data input
 * fields in the Formik state object.
 * @param {{ value: string, label: string }} props.items The list of items to
 * display in the dropdown.
 * @param {string[]} props.primaryItem The list of report suites that are being
 * overridden.
 * @param {boolean} props.useManualEntry If true, the input is a text field. If
 * false, the input is a combo box.
 * @returns
 */
const ReportSuitesOverride = ({
  prefix,
  items,
  primaryItem,
  useManualEntry
}) => {
  const fieldName = `${prefix}.com_adobe_analytics.reportSuites`;
  const [, { value: rsids }] = useField(fieldName);
  return (
    <FieldArray name={fieldName}>
      {({ remove, push }) => (
        <>
          <Flex direction="column" gap="size-100">
            {rsids.map((rsid, index) => (
              <Flex key={index} direction="row">
                <OverrideInput
                  useManualEntry={useManualEntry || items.length === 0}
                  data-test-id={`${FIELD_NAMES.reportSuitesOverride}.${index}`}
                  label={index === 0 && "Report suites"}
                  allowsCustomValue
                  overrideType="report suites"
                  primaryItem={primaryItem}
                  items={items}
                  name={`${fieldName}.${index}`}
                  description={
                    index === rsids.length - 1 &&
                    "The IDs for the destination report suites in Adobe Analytics. The value must be a preconfigured override report suite from your datastream configuration and overrides the primary report suites."
                  }
                  width="size-5000"
                  key={index}
                >
                  {({ value, label }) => <Item key={value}>{label}</Item>}
                </OverrideInput>
                <ActionButton
                  isQuiet
                  isDisabled={rsids.length < 2}
                  marginTop={index === 0 && "size-300"}
                  data-test-id={`removeReportSuite.${index}`}
                  aria-label={`Remove report suite #${index + 1}`}
                  onPress={() => remove(index)}
                >
                  <Delete />
                </ActionButton>
              </Flex>
            ))}
          </Flex>
          <Button
            data-test-id="addReportSuite"
            variant="secondary"
            onPress={() => push("")}
            UNSAFE_style={{ maxWidth: "fit-content" }}
          >
            Add Report Suite
          </Button>
        </>
      )}
    </FieldArray>
  );
};

ReportSuitesOverride.propTypes = {
  prefix: PropTypes.string.isRequired,
  items: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired
    })
  ).isRequired,
  primaryItem: PropTypes.arrayOf(PropTypes.string).isRequired,
  useManualEntry: PropTypes.bool.isRequired
};

export default ReportSuitesOverride;
