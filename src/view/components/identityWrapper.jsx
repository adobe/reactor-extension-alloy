/*
Copyright 2019 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
*/

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
import { Accordion, AccordionItem } from "@react/react-spectrum/Accordion";
import WrappedField from "./wrappedField";
import authenticatedStateOptions from "../constants/authenticatedStateOptions";
import getDefaultIdentifier from "../utils/getDefaultIdentifier";
import InfoTipLayout from "./infoTipLayout";
import getDefaultIdentity from "../utils/getDefaultIdentity";

function IdentityWrapper({ values }) {
  return (
    <React.Fragment>
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
              <Heading variant="subtitle2">Identities</Heading>
              <Accordion
                data-test-id="identitiesAccordion"
                className="u-gapTop2x"
              >
                {values.identities.map((identity, index) => (
                  <AccordionItem
                    key={index}
                    header={identity.namespace || "unnamed identity"}
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
                          name={`identities.${index}.namespace`}
                          component={Textfield}
                          componentClassName="u-fieldLong"
                        />
                      </div>
                    </div>
                    <div>
                      <FieldArray
                        id={`identities.${index}.identifiers`}
                        name={`identities.${index}.identifiers`}
                        render={identityArrayHelpers => {
                          return (
                            <React.Fragment>
                              <div className="u-gapTop u-alignRight">
                                <Button
                                  data-test-id={`addIdentifier${index}Button`}
                                  label="Add Identifier"
                                  onClick={() => {
                                    identityArrayHelpers.push(
                                      getDefaultIdentifier()
                                    );
                                  }}
                                />
                              </div>
                              {identity.identifiers.map(
                                (identifier, identifierIndex) => (
                                  <Well
                                    key={`identity${index}identifier${identifierIndex}`}
                                  >
                                    <div className="u-gapTop">
                                      <FieldLabel
                                        labelFor={`identity${index}idField${identifierIndex}`}
                                        label="ID"
                                      />
                                      <div>
                                        <WrappedField
                                          data-test-id={`identity${index}idField${identifierIndex}`}
                                          id={`identity${index}idField${identifierIndex}`}
                                          name={`identities.${index}.identifiers.${identifierIndex}.id`}
                                          component={Textfield}
                                          componentClassName="u-fieldLong"
                                          supportDataElement="replace"
                                        />
                                      </div>
                                    </div>

                                    <div className="u-gapTop">
                                      <FieldLabel
                                        labelFor={`identity${index}authenticatedStateField${identifierIndex}`}
                                        label="Authenticated State"
                                      />
                                      <div>
                                        <WrappedField
                                          data-test-id={`identity${index}authenticatedStateField${identifierIndex}`}
                                          id={`identity${index}authenticatedStateField${identifierIndex}`}
                                          name={`identities.${index}.identifiers.${identifierIndex}.authenticatedState`}
                                          component={Select}
                                          componentClassName="u-fieldLong"
                                          options={authenticatedStateOptions}
                                        />
                                      </div>
                                    </div>
                                    <div className="u-gapTop">
                                      <InfoTipLayout tip="Adobe Experience Platform will use the identity as an identifier to help stitch together more information about that individual. If left unchecked, the identifier within this namespace will still be collected but the ECID will be used as the primary identifier for stitching.">
                                        <WrappedField
                                          data-test-id={`identity${index}primaryField${identifierIndex}`}
                                          name={`identities.${index}.identifiers.${identifierIndex}.primary`}
                                          component={Checkbox}
                                          label="Primary"
                                        />
                                      </InfoTipLayout>
                                    </div>
                                    <div className="u-gapTop">
                                      <Button
                                        data-test-id={`deleteIdentifier${index}Button${identifierIndex}`}
                                        label="Delete Identifier"
                                        icon={<Delete />}
                                        disabled={
                                          values.identities[index].identifiers
                                            .length === 1
                                        }
                                        onClick={() => {
                                          identityArrayHelpers.remove(
                                            identifierIndex
                                          );
                                        }}
                                      />
                                      {values.identities[index].identifiers
                                        .length === 1 ? (
                                        <span className="Note u-gapLeft">
                                          You must have at least one identifier
                                          to use this action.
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
                        data-test-id={`deleteIdentity${index}Button`}
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
  values: PropTypes.object
};

export default IdentityWrapper;
