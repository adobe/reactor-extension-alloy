import React, { useContext, useRef } from "react";
import { FieldArray } from "formik";
import ExtensionViewContext from "./extensionViewContext";
import ExtensionViewForm from "./extensionViewForm";
import { TextField } from "./formikReactSpectrum3";
import { Button } from "@adobe/react-spectrum";
import Delete from "@spectrum-icons/workflow/Delete";
import MyComponent from "./myComponent";
import TransientView from "./transientView";



const ConsentObjects = () => {

  const { initInfo } = useContext(ExtensionViewContext);

  const getInitialValues = () => {
    const {
      consent
    } = initInfo.settings || {};

    if (!Array.isArray(consent)) {
      return { consent: [] };
    }

    return {
      consent: consent.map(({ field1 = "" }) => { field1 } )
    };
  };

  const getSettings = ({ values }) => {
    return { consent: values };
  };

  return (
    <ExtensionViewForm
      initialValues={getInitialValues()}
      getSettings={getSettings}
      render={({ formikProps }) => {
        return (
          <FieldArray
            name="consent"
            render={arrayHelpers => {
              return (
                <>
                  {formikProps.values.consent.map((value, index) => {
                    return (
                      <div key={index}>
                        <TransientView memento={value.memento}>
                          <TextField
                              data-test-id={`consent${index}Field1Field`}
                              name={`consent.${index}.field1`}
                              width="size-5000"
                              aria-label="Field 1"
                          />
                          <MyComponent name={`myComponentField${index}`}/>
                          <Button
                            isQuiet
                            variant="secondary"
                            onPress={() => {
                              arrayHelpers.remove(index)
                            }}
                            aria-label="Delete"
                          >
                            <Delete />
                          </Button>
                        </TransientView>
                      </div>
                    );
                  })}
                  <Button
                    variant="secondary"
                    data-test-id="addConsentButton"
                    onPress={() => {
                      arrayHelpers.push({ field1: "", memento: {} });
                    }}
                  >
                    Add Consent Object
                  </Button>
                </>
              );
            }}
          />
        );
      }}
    />
  );
};

export default ConsentObjects;

