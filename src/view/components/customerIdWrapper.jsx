import "regenerator-runtime"; // needed for some of react-spectrum
import React from "react";
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
import InfoTipLayout from "./infoTipLayout";
import getInstanceOptions from "../utils/getInstanceOptions";

function CustomerIdWrapper({ values, initInfo }) {
  // TODO: implement in the future
  /*
  const [namespaceOptions, setNamespaceOptions] = useState([]);
  const [error, setError] = useState();

  useEffect(() => {
    async function fetchData() {
      try {
        const nOptions = await loadIdentityNamespaces();

        setNamespaceOptions(nOptions);
      } catch (error) {}
    }

    fetchData();
  }, []);
*/

  return (
    <React.Fragment>
      <FieldLabel labelFor="instanceName" label="Instance" />
      <div>
        <WrappedField
          id="instanceName"
          name="instanceName"
          component={Select}
          componentClassName="u-fieldLong"
          options={getInstanceOptions(initInfo)}
        />
      </div>
      <FieldArray
        name="customerIds"
        render={arrayHelpers => {
          return (
            <React.Fragment>
              <div className="u-gapTop u-alignRight">
                <Button
                  id="addCustomerId"
                  label="Add Customer ID"
                  onClick={() => {
                    arrayHelpers.push(getDefaultCustomerId());
                  }}
                />
              </div>
              {((Array.isArray(values.customerIds) &&
                values.customerIds.length) ||
                null) && <Heading variant="subtitle2">Customer IDs</Heading>}
              <div>
                {((Array.isArray(values.customerIds) &&
                  values.customerIds.length) ||
                  null) &&
                  values.customerIds.map((customerId, index) => (
                    <Well key={index}>
                      <div>
                        <FieldLabel
                          labelFor={`namespaceField${index}`}
                          label="Namespace"
                        />
                        <div>
                          <WrappedField
                            id={`namespaceField${index}`}
                            name={`customerIds.${index}.namespace`}
                            // component={Select}
                            component={Textfield}
                            componentClassName="u-fieldLong"
                            // options={namespaceOptions}
                          />
                        </div>
                      </div>
                      <div className="u-gapTop">
                        <FieldLabel labelFor={`idField${index}`} label="ID" />
                        <div>
                          <WrappedField
                            id={`idField${index}`}
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
                          labelFor={`authenticatedStateField${index}`}
                          label="Authenticated State"
                        />
                        <div>
                          <WrappedField
                            id={`authenticatedStateField${index}`}
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
                              You must have at least one customer ID to use this
                              action.
                            </span>
                          ) : null}
                          <Dialog
                            title="Delete Customer ID"
                            id={`deleteCustomerId${index}`}
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
}

CustomerIdWrapper.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  values: PropTypes.object,
  // eslint-disable-next-line react/forbid-prop-types
  initInfo: PropTypes.object
};

export default CustomerIdWrapper;
