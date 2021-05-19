import React, { useContext, useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import useExtensionViewAggregators from "../utils/useExtensionViewAggregators";
import ExtensionViewContext from "../components/extensionViewContext";
import { FormikProvider, useFormik } from "formik";
import FillParentAndCenterChildren from "./fillParentAndCenterChildren";
import { ProgressCircle } from "@adobe/react-spectrum";

const Subform = ({
  getInitialValues,
  getSettings,
  validate,
  validationSchema,
  render
}) => {

  const formikProps = useFormik({
    enableReinitialize: true,
    onSubmit: () => {},
    validate,
    validationSchema,
    validateOnChange: false
  });
  const [initialized, setInitialized] = useState(false);

  const ref = useRef();
  const parentExtensionViewContext = useContext(ExtensionViewContext);
  const { extensionViewContext, getCombinedSettings } = useExtensionViewAggregators(parentExtensionViewContext.initInfo);
  ref.current = { getInitialValues, getSettings, formikProps, getCombinedSettings };

  useEffect(() => {
    parentExtensionViewContext.registerGetSettings(() => {
      return ref.current.getCombinedSettings();
    })
    extensionViewContext.registerGetSettings(() => {
      console.log("Subform getSettings", ref.current.formikProps.values);
      return ref.current.getSettings({
        values: ref.current.formikProps.values,
        initInfo: ref.current.initInfo
      });
    });
    Promise.resolve(getInitialValues({ initInfo: parentExtensionViewContext.initInfo }))
      .then(initialValues => {
        formikProps.resetForm({ values: initialValues });
        setInitialized(true);
      });
  },[]);

  if (!initialized) {
    return (
      <FillParentAndCenterChildren>
        <ProgressCircle size="L" aria-label="Loading..." isIndeterminate />
      </FillParentAndCenterChildren>
    );
  }

  return (
    <ExtensionViewContext.Provider value={extensionViewContext}>
      <FormikProvider value={formikProps}>{render()}</FormikProvider>
    </ExtensionViewContext.Provider>
  );
};

Subform.propTypes = {
  getInitialValues: PropTypes.func.isRequired,
  getSettings: PropTypes.func.isRequired,
  validate: PropTypes.func,
  render: PropTypes.func.isRequired
};

export default Subform;
