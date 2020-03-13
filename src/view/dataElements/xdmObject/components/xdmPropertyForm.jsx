/*
Copyright 2020 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
*/

import React from "react";
import PropTypes from "prop-types";
import FieldLabel from "@react/react-spectrum/FieldLabel";
import Textfield from "@react/react-spectrum/Textfield";
import WrappedField from "../../../components/wrappedField";
import AutoPopulationAlert from "./autoPopulationAlert";
import { formStateNodePropTypes } from "../helpers/getInitialFormState";

const XdmPropertyForm = props => {
  const { formStateNode, fieldName } = props;

  return (
    <div>
      {formStateNode.isAutoPopulated && <AutoPopulationAlert />}
      <div className="u-gapTop">
        <FieldLabel labelFor="wholeValueField" label="Value" />

        <WrappedField
          data-test-id="wholeValueField"
          id="wholeValueField"
          name={`${fieldName}.wholeValue`}
          component={Textfield}
          componentClassName="u-fieldLong"
        />
      </div>
    </div>
  );
};

XdmPropertyForm.propTypes = {
  formStateNode: formStateNodePropTypes.isRequired,
  fieldName: PropTypes.string.isRequired
};

export default XdmPropertyForm;
