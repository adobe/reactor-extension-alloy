import "regenerator-runtime"; // needed for some of react-spectrum
import React, { useState, useEffect } from "react";
import { FieldArray } from "formik";
import Textfield from "@react/react-spectrum/Textfield";
import Checkbox from "@react/react-spectrum/Checkbox";
import Select from "@react/react-spectrum/Select";
import FieldLabel from "@react/react-spectrum/FieldLabel";
import Button from "@react/react-spectrum/Button";
import Well from "@react/react-spectrum/Well";
import Heading from "@react/react-spectrum/Heading";
import Delete from "@react/react-spectrum/Icon/Delete";
import ModalTrigger from "@react/react-spectrum/ModalTrigger";
import Dialog from "@react/react-spectrum/Dialog";
import "@react/react-spectrum/Form"; // needed for spectrum form styles
import PropTypes from "prop-types";
import WrappedField from "./wrappedField";
import authenticatedStateOptions from "../constants/authenticatedStateOptions";
import getDefaultCustomerId from "../utils/getDefaultCustomerId";
import ErrorMessage from "./errorMessage";
import InfoTipLayout from "./infoTipLayout";

function CIdWrapper({ values }) {
  // const [namespaceOptions, setNamespaceOptions] = useState([]);
  const [showStuff, setShowStuff] = useState({});
  let returnValue = null;

  useEffect(() => {
    async function fetchData() {
      try {
        // const nOptions = await loadIdentityNamespaces();

        setShowStuff({
          value: "content"
        });
        // setNamespaceOptions(nOptions);
      } catch (error) {
        setShowStuff({
          value: "error",
          message: error.message
        });
      }
    }

    fetchData();
  }, []);

  switch (showStuff.value) {
    case "content":
      returnValue = (
        <React.Fragment>
          <FieldLabel labelFor="instanceName" label="Instance" />
          <div>
            <WrappedField
              id="instanceName"
              name="instanceName"
              component={Textfield}
              componentClassName="u-fieldLong"
              supportDataElement
            />
          </div>
          <FieldArray
            name="customerIds"
            render={arrayHelpers => {
              return (
                <React.Fragment>
                  <div className="u-gapTop u-alignRight">
                    <Button
                      label="Add Customer ID"
                      onClick={() => {
                        arrayHelpers.push(getDefaultCustomerId());
                      }}
                    />
                  </div>
                  {((Array.isArray(values.customerIds) &&
                    values.customerIds.length) ||
                    null) && (
                    <Heading variant="subtitle2">Customer IDs</Heading>
                  )}
                  <div>
                    {((Array.isArray(values.customerIds) &&
                      values.customerIds.length) ||
                      null) &&
                      values.customerIds.map((customerId, index) => (
                        <Well key={index}>
                          <div>
                            <FieldLabel
                              labelFor="namespaceField"
                              label="Namespace"
                            />
                            <div>
                              <WrappedField
                                id="namespaceField"
                                name={`customerIds.${index}.namespace`}
                                // component={Select}
                                component={Textfield}
                                componentClassName="u-fieldLong"
                                // options={namespaceOptions}
                              />
                            </div>
                          </div>
                          <div className="u-gapTop">
                            <FieldLabel labelFor="idField" label="ID" />
                            <div>
                              <WrappedField
                                id="idField"
                                name={`customerIds.${index}.id`}
                                component={Textfield}
                                componentClassName="u-fieldLong"
                                supportDataElement
                              />
                            </div>
                          </div>
                          <div className="u-gapTop">
                            <InfoTipLayout tip="Uses the SHA-256 hashing algorithm that allows you to pass in customer IDs or email addresses, and pass out hashed IDs. This is an optional Javascript method for sending hashed identifiers. You can continue to use your own methods of hashing prior to sending customer IDs.">
                              <WrappedField
                                name={`customerIds.${index}.hashEnabled`}
                                component={Checkbox}
                                label="Convert ID to sha256 hash"
                              />
                            </InfoTipLayout>
                          </div>
                          <div className="u-gapTop">
                            <FieldLabel
                              labelFor="authenticatedStateField"
                              label="Authenticated State"
                            />
                            <div>
                              <WrappedField
                                id="authenticatedStateField"
                                name={`customerIds.${index}.authenticatedState`}
                                component={Select}
                                componentClassName="u-fieldLong"
                                options={authenticatedStateOptions}
                              />
                            </div>
                          </div>
                          <div className="u-gapTop">
                            <InfoTipLayout tip="Adobe Experience Platform will use the customer ID as an identifier to help stitch together more information about that individual. If left unchecked, the identifier within this namespace will still be collected but the ECID will be used as the primary identifier for stitching.">
                              <WrappedField
                                name={`customerIds.${index}.primary`}
                                component={Checkbox}
                                label="Primary"
                              />
                            </InfoTipLayout>
                          </div>
                          <div className="u-gapTop">
                            <ModalTrigger>
                              <Button
                                id={`deleteButton${index}`}
                                label="Delete Customer ID"
                                icon={<Delete />}
                                variant="action"
                                disabled={values.customerIds.length === 1}
                              />
                              {values.customerIds.length === 1 ? (
                                <span className="Note u-gapLeft">
                                  You must have at least one customer ID to use
                                  this action.
                                </span>
                              ) : null}
                              <Dialog
                                title="Delete Customer ID"
                                onConfirm={() => {
                                  arrayHelpers.remove(index);
                                }}
                                confirmLabel="Delete"
                                cancelLabel="Cancel"
                              >
                                Would you like to proceed?
                              </Dialog>
                            </ModalTrigger>
                          </div>
                        </Well>
                      ))}
                  </div>
                </React.Fragment>
              );
            }}
          />
        </React.Fragment>
      );
      break;
    case "error":
      returnValue = <ErrorMessage>{`${showStuff.message}`}</ErrorMessage>;
      break;
    default:
      returnValue = null;
  }

  return returnValue;
}

CIdWrapper.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  values: PropTypes.object
};

export default CIdWrapper;
