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
import "@react/react-spectrum/Form"; // needed for spectrum form styles
import PropTypes from "prop-types";
import WrappedField from "./wrappedField";
import authenticatedStateOptions from "../constants/authenticatedStateOptions";
import getDefaultIdentity from "../utils/getDefaultIdentity";
import InfoTipLayout from "./infoTipLayout";
import getInstanceOptions from "../utils/getInstanceOptions";

function IdentityWrapper({ values, initInfo }) {
  return (
    <React.Fragment>
      <FieldLabel labelFor="instanceNameField" label="Instance" />
      <div>
        <WrappedField
          data-test-id="instanceNameField"
          id="instanceNameField"
          name="instanceName"
          component={Select}
          componentClassName="u-fieldLong"
          options={getInstanceOptions(initInfo)}
        />
      </div>
      <FieldArray
        name="identities"
        render={arrayHelpers => {
          return (
            <React.Fragment>
              <div className="u-gapTop u-alignRight">
                <Button
                  data-test-id="addIdentityButton"
                  label="Add Identity"
                  onClick={() => {
                    arrayHelpers.push(getDefaultIdentity());
                  }}
                />
              </div>
              <Heading variant="subtitle2">Identity</Heading>
              <div>
                {values.identities.map((identity, index) => (
                  <Well key={index}>
                    <div>
                      <FieldLabel
                        labelFor={`namespace${index}Field`}
                        label="Namespace"
                      />
                      <div>
                        <WrappedField
                          data-test-id={`namespace${index}Field`}
                          id={`namespace${index}Field`}
                          name={`identities.${index}.namespace`}
                          // component={Select}
                          component={Textfield}
                          componentClassName="u-fieldLong"
                          // options={namespaceOptions}
                        />
                      </div>
                    </div>
                    <div className="u-gapTop">
                      <FieldLabel labelFor={`id${index}Field`} label="ID" />
                      <div>
                        <WrappedField
                          data-test-id={`id${index}Field`}
                          id={`id${index}Field`}
                          name={`identities.${index}.id`}
                          component={Textfield}
                          componentClassName="u-fieldLong"
                          supportDataElement="replace"
                        />
                      </div>
                    </div>
                    <div className="u-gapTop">
                      <InfoTipLayout tip="Uses the SHA-256 hashing algorithm that allows you to pass in identities or email addresses, and pass out hashed IDs. This is an optional Javascript method for sending hashed identifiers. You can continue to use your own methods of hashing prior to sending identities. Note: if this is set to true for an identity and the page is HTTP, the identity will be removed from the call because hashing cannot be completed in this case.">
                        <WrappedField
                          data-test-id={`hashEnabled${index}Field`}
                          name={`identities.${index}.hashEnabled`}
                          component={Checkbox}
                          label="Convert ID to sha256 hash"
                        />
                      </InfoTipLayout>
                    </div>
                    <div className="u-gapTop">
                      <FieldLabel
                        labelFor={`authenticatedState${index}Field`}
                        label="Authenticated State"
                      />
                      <div>
                        <WrappedField
                          data-test-id={`authenticatedState${index}Field`}
                          id={`authenticatedState${index}Field`}
                          name={`identities.${index}.authenticatedState`}
                          component={Select}
                          componentClassName="u-fieldLong"
                          options={authenticatedStateOptions}
                        />
                      </div>
                    </div>
                    <div className="u-gapTop">
                      <InfoTipLayout tip="Adobe Experience Platform will use the identity as an identifier to help stitch together more information about that individual. If left unchecked, the identifier within this namespace will still be collected but the ECID will be used as the primary identifier for stitching.">
                        <WrappedField
                          data-test-id={`primary${index}Field`}
                          name={`identities.${index}.primary`}
                          component={Checkbox}
                          label="Primary"
                        />
                      </InfoTipLayout>
                    </div>
                    <div className="u-gapTop">
                      <Button
                        data-test-id={`delete${index}Button`}
                        label="Delete Identity"
                        icon={<Delete />}
                        disabled={values.identities.length === 1}
                        onClick={() => {
                          arrayHelpers.remove(index);
                        }}
                      />
                      {values.identities.length === 1 ? (
                        <span className="Note u-gapLeft">
                          You must have at least one identity to use this
                          action.
                        </span>
                      ) : null}
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

IdentityWrapper.propTypes = {
  values: PropTypes.object,
  initInfo: PropTypes.object
};

export default IdentityWrapper;
