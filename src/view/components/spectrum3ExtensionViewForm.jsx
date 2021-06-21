import React, { useState, useRef } from "react";
import PropTypes from "prop-types";
import { useFormik, FormikProvider } from "formik";
import { Form, ProgressCircle } from "@adobe/react-spectrum";
import { useEffect } from "react/cjs/react.development";
import { object } from "yup";
import FillParentAndCenterChildren from "./fillParentAndCenterChildren";
import ExtensionViewContext from "./extensionViewContext";
import useExtensionBridge from "../utils/useExtensionBridge";
import deepAssign from "../utils/deepAssign";
import { setValue } from "../utils/nameUtils";

// This component wires up Launch's extension bridge, and creates the
// ExtensionViewContext. It should be used for each view inside an extension.
const ExtensionView = ({ children }) => {
  const [initInfo, setInitInfo] = useState();
  const [initialized, setInitialized] = useState(false);

  const registeredPartialFormsRef = useRef([]);
  const formikPropsRef = useRef();

  const formikProps = useFormik({
    onSubmit: () => {},
    validate: async values => {
      // TODO: add error logging see "wrapValidationWithErrorLogging"
      const errorObjects = await Promise.all(
        registeredPartialFormsRef.current.map(
          ({ validateFormikState = () => undefined }) => {
            return Promise.resolve(validateFormikState({ values }));
          }
        )
      );
      return errorObjects.reduce((errors, errorObject) => {
        return deepAssign(errors, errorObject);
      }, {});
    },
    validationSchema: () => {
      return registeredPartialFormsRef.current.reduce(
        (schema, { formikStateValidationSchema }) => {
          return formikStateValidationSchema
            ? schema.concat(formikStateValidationSchema)
            : schema;
        },
        object()
      );
    }
  });
  formikPropsRef.current = formikProps;

  useExtensionBridge({
    init({ initInfo: _initInfo }) {
      setInitInfo(_initInfo);
      formikPropsRef.current.resetForm({});
      setInitialized(false);
    },
    getSettings() {
      return registeredPartialFormsRef.current.reduce(
        (memo, { getSettings }) => {
          return deepAssign(memo, getSettings(formikPropsRef.current));
        },
        {}
      );
    },
    async validate() {
      const validateFormikStatePromise = formikPropsRef.current
        .submitForm()
        .then(() => {
          // The docs say that the promise submitForm returns
          // will be rejected if there are errors, but that is not the case.
          // Therefore, after the promise is resolved, we pull formikProps.errors
          // (which were set during submitForm()) to see if the form is valid.
          // https://github.com/jaredpalmer/formik/issues/1580
          formikPropsRef.current.setSubmitting(false);
          return Object.keys(formikPropsRef.current.errors).length === 0;
        });
      const validateNonFormikStatePromises = registeredPartialFormsRef.current.flatMap(
        ({ validateNonFormikState }) => {
          return validateNonFormikState
            ? [Promise.resolve(validateNonFormikState)]
            : [];
        }
      );
      const results = await Promise.all([
        validateFormikStatePromise,
        ...validateNonFormikStatePromises
      ]);
      return results.every(result => result);
    }
  });

  // If we called getInitialValues as the partial forms are registered it would lead to
  // a new re-render for every partial form. So after every render of the extension view
  // we check if there are any uninitialized partial forms and initialized them all
  // together. Calling formikProps.setValues once only triggers one re-render.
  useEffect(async () => {
    if (
      !initInfo ||
      registeredPartialFormsRef.current.every(
        ({ initialized: _initialized }) => _initialized
      )
    ) {
      return;
    }
    const allInitialValues = await Promise.all(
      registeredPartialFormsRef.current
        .filter(({ initialized: _initialized }) => !_initialized)
        .map(async ({ getInitialValues, initializedName }) => {
          const initialValues = await Promise.resolve(
            getInitialValues({ initInfo })
          );
          setValue(initialValues, initializedName, true);
          return initialValues;
        })
    );
    const newValues = deepAssign(
      {},
      formikPropsRef.current.values,
      ...allInitialValues
    );
    // No need to trigger a new validation round here
    formikPropsRef.current.setValues(newValues, false);
    if (!initialized) {
      setInitialized(true);
    }
  });

  const { current: context } = useRef({
    registerPartialForm(partialForm) {
      registeredPartialFormsRef.current.push(partialForm);
    },
    dropPartialForm(partialForm) {
      registeredPartialFormsRef.current = registeredPartialFormsRef.current.filter(
        other => other !== partialForm
      );
    },
    // TODO: make a resetField and use that instead
    resetForm(initialValues) {
      formikPropsRef.current.resetForm({ initialValues });
    }
  });
  context.initInfo = initInfo;

  // Don't render anything until extension bridge calls init
  if (!initInfo) {
    return null;
  }

  return (
    <>
      <ExtensionViewContext.Provider value={context}>
        <Form>
          <FormikProvider value={formikProps}>{children}</FormikProvider>
        </Form>
      </ExtensionViewContext.Provider>
      {!initialized && (
        <FillParentAndCenterChildren>
          <ProgressCircle size="L" aria-label="Loading..." isIndeterminate />
        </FillParentAndCenterChildren>
      )}
    </>
  );
};

ExtensionView.propTypes = {
  children: PropTypes.node.isRequired
};

export default ExtensionView;
