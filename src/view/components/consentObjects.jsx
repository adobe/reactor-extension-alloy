import React, { useContext, useRef } from "react";
import { FieldArray, useField } from "formik";
import ExtensionViewContext from "./extensionViewContext";
import ExtensionViewForm from "./extensionViewForm";
import { TextField } from "./formikReactSpectrum3";
import { Button } from "@adobe/react-spectrum";
import Delete from "@spectrum-icons/workflow/Delete";
import MyComponent from "./myComponent";
import TransientView from "./transientView";
import ImperativeForm from "./imperativeForm";



const ConsentObjects = () => {

  const { initInfo } = useContext(ExtensionViewContext);

  const getInitialValues = () => {
    console.log("consent objects getInitialValues called");
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

  const ADOBE = { value: "adobe", label: "Adobe" };
  const IAB_TCF = { value: "iab_tcf", label: "IAB TCF" };

  const [{ value: consent }] = useField("consent");

  return (
    <ImperativeForm
      getInitialValues={getInitialValues}
      getSettings={getSettings}
      name="consentObjects"
      render={() => {
        return (
          <FieldArray
            name="consent"
            render={arrayHelpers => {
              return (
                <>
                  {consent.map((value, index) => {
                    return (
                      <div key={index}>
                        <>
                          <Picker
                            data-test-id="standardSelect"
                            name={`consent.${index}.standard`}
                            label="Standard"
                            description="The consent standard for this consent object"
                            items={[ADOBE, IAB_TCF]}
                            width="size-5000"
                            isRequired
                          >
                            {item => <Item key={item.value}>{item.label}</Item>}
                          </Picker>
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
                        </>
                      </div>
                    );
                  })}
                  <Button
                    variant="secondary"
                    data-test-id="addConsentButton"
                    onPress={() => {
                      arrayHelpers.push({ field1: "" });
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

