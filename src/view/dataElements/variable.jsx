/*
Copyright 2022 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0
Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
*/

import { Radio } from "@adobe/react-spectrum";
import React, { useRef } from "react";
import { object } from "yup";
import { useField } from "formik";
import { v4 as uuid } from "uuid";
import PropTypes from "prop-types";
import ExtensionView from "../components/extensionView";
import FormElementContainer from "../components/formElementContainer";
import FormikRadioGroup from "../components/formikReactSpectrum3/formikRadioGroup";
import XdmVariable, {
  bridge as xdmVariableBridge
} from "./variable/components/xdmVariable";
import render from "../render";

const SCHEMA_TYPE_XDM = "xdm";
const SCHEMA_TYPE_OBJECT = "object";

const getInitialValues = ({ xdmVariableContext }) => async ({ initInfo }) => {
  const { schemaType = SCHEMA_TYPE_XDM, cacheId = uuid() } =
    initInfo.settings || {};

  const initialValues = {
    schemaType,
    cacheId,
    ...(await xdmVariableBridge.getInitialValues({
      initInfo,
      context: xdmVariableContext
    }))
  };
  return initialValues;
};

const getSettings = ({ values }) => {
  const settings = {
    schemaType: values.schemaType,
    cacheId: values.cacheId,
    ...xdmVariableBridge.getSettings({ values })
  };

  return settings;
};

const validationSchema = object().concat(
  xdmVariableBridge.formikStateValidationSchema
);

const Source = ({ xdmVariableContext, initInfo }) => {
  const [{ value: schemaType }] = useField("schemaType");

  return (
    <>
      <FormikRadioGroup
        name="schemaType"
        orientation="horizontal"
        label="Variable type"
      >
        <Radio data-test-id="schemaTypeXdmField" value={SCHEMA_TYPE_XDM}>
          XDM
        </Radio>
        <Radio data-test-id="schemaTypeObjectField" value={SCHEMA_TYPE_OBJECT}>
          Object
        </Radio>
      </FormikRadioGroup>
      {schemaType === SCHEMA_TYPE_XDM && (
        <XdmVariable context={xdmVariableContext} initInfo={initInfo} />
      )}
      {schemaType === SCHEMA_TYPE_OBJECT && <></>}
    </>
  );
};
Source.propTypes = {
  xdmVariableContext: PropTypes.object,
  initInfo: PropTypes.object
};

const Variable = () => {
  const { current: xdmVariableContext } = useRef({});
  return (
    <ExtensionView
      getInitialValues={getInitialValues({ xdmVariableContext })}
      getSettings={getSettings}
      formikStateValidationSchema={validationSchema}
      render={({ initInfo }) => (
        <FormElementContainer>
          <Source xdmVariableContext={xdmVariableContext} initInfo={initInfo} />
        </FormElementContainer>
      )}
    />
  );
};

render(Variable);
