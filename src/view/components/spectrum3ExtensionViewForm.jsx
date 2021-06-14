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

// This component wires up Launch's extension bridge, and creates the
// ExtensionViewContext. It should be used for each view inside an extension.
const ExtensionView = ({ children }) => {
  const [initInfo, setInitInfo] = useState();
  const [initCalls, setInitCalls] = useState(0);
  const [initialized, setInitialized] = useState(false);

  const registeredImperativeFormsRef = useRef([]);
  const formikPropsRef = useRef();
  const initialValuesRef = useRef({});

  const formikProps = useFormik({
    initialValues: initialValuesRef.current,
    enableReinitialize: true,
    onSubmit: () => {},
    validate: async values => {
      // TODO: add error logging see "wrapValidationWithErrorLogging"
      const errorObjects = await Promise.all(
        registeredImperativeFormsRef.current.map(
          ({ validateFormikState = () => undefined }) => {
            return Promise.resolve(validateFormikState(values));
          }
        )
      );
      return errorObjects.reduce((errors, errorObject) => {
        return deepAssign(errors, errorObject);
      }, {});
    },
    validationSchema: () => {
      return registeredImperativeFormsRef.current.reduce(
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
      setInitCalls(initCalls + 1);
      setInitialized(false);
    },
    getSettings() {
      return registeredImperativeFormsRef.current.reduce(
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
      const validateNonFormikStatePromises = registeredImperativeFormsRef.current.map(
        ({ validateNonFormikState = () => true }) => {
          return Promise.resolve(validateNonFormikState);
        }
      );
      const results = await Promise.all([
        validateFormikStatePromise,
        ...validateNonFormikStatePromises
      ]);
      return results.every(result => result);
    }
  });

  useEffect(async () => {
    if (initCalls === 0) {
      return undefined;
    }
    let canceled = false;
    const allInitialValues = await Promise.all(
      registeredImperativeFormsRef.current.map(({ getInitialValues }) => {
        return Promise.resolve(getInitialValues({ initInfo }));
      })
    );
    if (!canceled) {
      const initialValues = deepAssign({}, ...allInitialValues);
      formikPropsRef.current.resetForm({ values: initialValues });
      registeredImperativeFormsRef.current.forEach(
        ({ setPreviouslyInitialized }) => {
          setPreviouslyInitialized(true, false);
        }
      );
      setInitialized(true);
    }
    return () => {
      canceled = true;
    };
  }, [initCalls]);

  // Don't render anything until extension bridge calls init
  if (!initInfo) {
    return null;
  }

  const context = {
    registerImperativeForm(imperativeForm) {
      registeredImperativeFormsRef.current.push(imperativeForm);
      if (initialized && !imperativeForm.previouslyInitialized) {
        Promise.resolve(imperativeForm.getInitialValues({ initInfo })).then(
          initialValues => {
            const newInitialValues = deepAssign(
              formikPropsRef.current.values,
              initialValues
            );
            formikPropsRef.current.resetForm({
              values: newInitialValues,
              touched: formikPropsRef.current.touched
            });
            imperativeForm.setPreviouslyInitialized(true);
          }
        );
      }
    },
    deregisterImperativeForm(imperativeForm) {
      registeredImperativeFormsRef.current = registeredImperativeFormsRef.current.filter(
        other => other !== imperativeForm
      );
    },
    initInfo,
    initialized
  };

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
