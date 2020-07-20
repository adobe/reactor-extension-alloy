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
import getDefaultIdentifier from "../utils/getDefaultIdentifier";
import InfoTipLayout from "./infoTipLayout";
import getDefaultIdentity from "../utils/getDefaultIdentity";
import { Accordion, AccordionItem } from "@react/react-spectrum/Accordion";

function IdentityWrapper({ values }) {
  return (
    <React.Fragment>
      <FieldArray
        name="identifiers"
        render={arrayHelpers => {
          return (
            <React.Fragment>
              <div className="u-gapTop u-alignRight">
                <Button
                  data-test-id="addIdentifierButton"
                  label="Add Identifier"
                  onClick={() => {
                    arrayHelpers.push(getDefaultIdentifier());
                  }}
                />
              </div>
              <Heading variant="subtitle2">Identifiers</Heading>
              <Accordion
                data-test-id="identifiersAccordion"
                className="u-gapTop2x"
              >
                {values.identifiers.map((identifier, index) => (
                  <AccordionItem
                    key={index}
                    header={identifier.namespace || "unnamed identifier"}
                  >
                    <div>
                      <FieldLabel
                        labelFor={`namespace${index}Field`}
                        label="Namespace"
                      />
                      <div>
                        <WrappedField
                          data-test-id={`namespace${index}Field`}
                          id={`namespace${index}Field`}
                          name={`identifiers.${index}.namespace`}
                          component={Textfield}
                          componentClassName="u-fieldLong"
                        />
                      </div>
                    </div>
                    <div>
                      <FieldArray
                        id={`identifiers.${index}.identities`}
                        name={`identifiers.${index}.identities`}
                        render={identityArrayHelpers => {
                          return (
                            <React.Fragment>
                              <div className="u-gapTop u-alignRight">
                                <Button
                                  data-test-id="addIdentityButton"
                                  label="Add Identity"
                                  onClick={() => {
                                    identityArrayHelpers.push(
                                      getDefaultIdentity()
                                    );
                                  }}
                                />
                              </div>
                              {identifier.identities.map(
                                (identity, identityIndex) => (
                                  <Well
                                    key={`identifier${index}identity${identityIndex}`}
                                  >
                                    <div className="u-gapTop">
                                      <FieldLabel
                                        labelFor={`identifier${index}idField${identityIndex}`}
                                        label="ID"
                                      />
                                      <div>
                                        <WrappedField
                                          data-test-id={`identifier${index}idField${identityIndex}`}
                                          id={`identifier${index}idField${identityIndex}`}
                                          name={`identifiers.${index}.identities.${identityIndex}.id`}
                                          component={Textfield}
                                          componentClassName="u-fieldLong"
                                          supportDataElement="replace"
                                        />
                                      </div>
                                    </div>

                                    <div className="u-gapTop">
                                      <FieldLabel
                                        labelFor={`identifier${index}authenticatedStateField${identityIndex}`}
                                        label="Authenticated State"
                                      />
                                      <div>
                                        <WrappedField
                                          data-test-id={`identifier${index}authenticatedStateField${identityIndex}`}
                                          id={`identifier${index}authenticatedStateField${identityIndex}`}
                                          name={`identifiers.${index}.identities.${identityIndex}.authenticatedState`}
                                          component={Select}
                                          componentClassName="u-fieldLong"
                                          options={authenticatedStateOptions}
                                        />
                                      </div>
                                    </div>
                                    <div className="u-gapTop">
                                      <InfoTipLayout tip="Adobe Experience Platform will use the identity as an identifier to help stitch together more information about that individual. If left unchecked, the identifier within this namespace will still be collected but the ECID will be used as the primary identifier for stitching.">
                                        <WrappedField
                                          data-test-id={`identifier${index}primaryField${identityIndex}`}
                                          name={`identifiers.${index}.identities.${identityIndex}.primary`}
                                          component={Checkbox}
                                          label="Primary"
                                        />
                                      </InfoTipLayout>
                                    </div>
                                    <div className="u-gapTop">
                                      <Button
                                        data-test-id={`deleteIdentity${index}Button${identityIndex}`}
                                        label="Delete Identity"
                                        icon={<Delete />}
                                        disabled={
                                          values.identifiers[index].identities
                                            .length === 1
                                        }
                                        onClick={() => {
                                          identityArrayHelpers.remove(
                                            identityIndex
                                          );
                                        }}
                                      />
                                      {values.identifiers[index].identities
                                        .length === 1 ? (
                                        <span className="Note u-gapLeft">
                                          You must have at least one identity to
                                          use this action.
                                        </span>
                                      ) : null}
                                    </div>
                                  </Well>
                                )
                              )}
                            </React.Fragment>
                          );
                        }}
                      />
                    </div>
                    <div className="u-gapTop">
                      <Button
                        data-test-id={`delete${index}Button`}
                        label="Delete Identifier"
                        icon={<Delete />}
                        disabled={values.identifiers.length === 1}
                        onClick={() => {
                          arrayHelpers.remove(index);
                        }}
                      />
                      {values.identifiers.length === 1 ? (
                        <span className="Note u-gapLeft">
                          You must have at least one identifier to use this
                          action.
                        </span>
                      ) : null}
                    </div>
                  </AccordionItem>
                ))}
              </Accordion>
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
