import React from "react";
import ExtensionView from "../components/spectrum3ExtensionView";
import { Form, Item } from "@adobe/react-spectrum";
import {
  Picker,
  TextField,
  Checkbox
} from "../components/formikReactSpectrum3";
import { object } from "yup";
import render from "../spectrum3Render";
import Subform1 from "../components/subform1";

const defaultValues = {
  field1: "item2"
};
const getInitialValues = ({ initInfo }) => {
  return new Promise(resolve => setTimeout(() => {
    resolve(initInfo.settings || defaultValues);
  }, 3000));
};
const getSettings = ({ values }) => values;
const validationSchema = object();

const SubformTest = () => {
  return (
    <ExtensionView
      getInitialValues={getInitialValues}
      getSettings={getSettings}
      render={({ initInfo }) => {
        return (
          <Form>
            <Picker
              name="field1"
              label="Field 1"
              items={[{label: "Item 1", value: "item1"},{label: "Item 2", value: "item2"}]}
              width="size-5000"
              isRequired
            >
              { item => <Item key={item.value}>{item.label}</Item> }
            </Picker>
            <Subform1 />
          </Form>
        );
      }}
    />
  )
}

render(SubformTest);
