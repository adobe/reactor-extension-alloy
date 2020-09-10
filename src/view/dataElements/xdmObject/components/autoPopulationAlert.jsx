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

import React, { Fragment } from "react";
import Alert from "@react/react-spectrum/Alert";
import { ALWAYS, COMMAND, CONTEXT } from "../constants/autoPopulationSource";
import { OBJECT } from "../constants/schemaType";
import { formStateNodePropTypes } from "../helpers/getInitialFormState";
/**
 * Shown on the edit form for any fields that get populated
 * automatically by Alloy.
 */
const AutoPopulationAlert = ({ formStateNode }) => {
  const { autoPopulationSource, contextKey, schema } = formStateNode;

  return (
    <Alert header="Auto-populated Field">
      {autoPopulationSource === ALWAYS && (
        <Fragment>
          The value for this field will be auto-populated when this data element
          is provided as the XDM object for a &quot;Send Event&quot; action, and
          cannot be overwritten.
        </Fragment>
      )}
      {autoPopulationSource === COMMAND && (
        <Fragment>
          The value for this field may be specified as an option to the
          &quot;Send Event&quot; action. You can provide a value here, but it
          will be overwritten if this field is also specified in the action.
        </Fragment>
      )}
      {autoPopulationSource === CONTEXT && schema.type !== OBJECT && (
        <Fragment>
          The value for this field will be auto-populated when this data element
          is provided as the XDM object for a &quot;Send Event&quot; action if
          the
          <strong>&quot;{contextKey}&quot;</strong> Context is configured, but
          can be overwritten.
        </Fragment>
      )}
      {autoPopulationSource === CONTEXT && schema.type === OBJECT && (
        <Fragment>
          Some of the attributes of this field will be auto-populated by the
          Adobe Experience Platform Web SDK if the
          <strong>&quot;{contextKey}&quot;</strong> Context is configured, but
          can be overwritten.
        </Fragment>
      )}
    </Alert>
  );
};

AutoPopulationAlert.propTypes = {
  formStateNode: formStateNodePropTypes.isRequired
};

export default AutoPopulationAlert;
