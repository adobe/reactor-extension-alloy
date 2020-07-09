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

/**
<<<<<<< HEAD:src/view/dataElements/xdmObject/components/numberEdit.jsx
 * The form for editing a number or integer field.
 */
const NumberOrIntegerEdit = props => {
=======
 * The form for editing a string field.
 */
const StringEdit = props => {
>>>>>>> master:src/view/dataElements/xdmObject/components/stringEdit.jsx
  const { fieldName } = props;

  return (
    <div>
      <FieldLabel labelFor="valueField" label="Value" />
      <WrappedField
        data-test-id="valueField"
        id="valueField"
        name={`${fieldName}.value`}
        component={Textfield}
        componentClassName="u-fieldLong"
<<<<<<< HEAD:src/view/dataElements/xdmObject/components/numberEdit.jsx
        supportDataElement="replace"
=======
        supportDataElement="append"
>>>>>>> master:src/view/dataElements/xdmObject/components/stringEdit.jsx
      />
    </div>
  );
};

<<<<<<< HEAD:src/view/dataElements/xdmObject/components/numberEdit.jsx
NumberOrIntegerEdit.propTypes = {
  fieldName: PropTypes.string.isRequired
};

export default NumberOrIntegerEdit;
=======
StringEdit.propTypes = {
  fieldName: PropTypes.string.isRequired
};

export default StringEdit;
>>>>>>> master:src/view/dataElements/xdmObject/components/stringEdit.jsx
