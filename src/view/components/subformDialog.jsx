import React, { useContext } from "react";
import { object, string } from "yup";
import {
  DialogTrigger,
  ActionButton,
  Dialog,
  Heading,
  Divider,
  Content,
  ButtonGroup,
  Button
} from "@adobe/react-spectrum";
import PropTypes from "prop-types";
import { TextField } from "./formikReactSpectrum3";
import ExtensionViewForm from "./extensionViewForm";
import Subform1 from "./subform1";
import ExtensionViewContext from "./extensionViewContext";

const validationSchema = object().shape({
  text: string().required()
});

const SubformDialog = ({ name }) => {
  const { settings } = useContext(ExtensionViewContext);

  const initialValues = { text: "" };
  if (settings && settings[name]) {
    initialValues.text = settings[name];
  }

  const getSettings = ({ values }) => {
    return {
      [name]: values.text
    };
  };

  return (
    <ExtensionViewForm
      initialValues={initialValues}
      getSettings={getSettings}
      claimedFields={[name]}
      validationSchema={validationSchema}
      render={() => {
        return (
          <DialogTrigger type="modal">
            <ActionButton>Edit</ActionButton>
            {close => (
              <Dialog size="fullscreen">
                <Heading>Edit Text</Heading>
                <Divider />
                <Content>
                  <TextField
                    name="text"
                    label="Text"
                    description="Enter some text"
                    width="size-5000"
                  />
                  <Subform1 name="dialogNames" />
                </Content>
                <ButtonGroup>
                  <Button
                    variant="secondary"
                    onPress={() => {
                      close();
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="cta"
                    onPress={() => {
                      close();
                    }}
                  >
                    Save
                  </Button>
                </ButtonGroup>
              </Dialog>
            )}
          </DialogTrigger>
        );
      }}
    />
  );
};

SubformDialog.propTypes = {
  name: PropTypes.string.isRequired
};

export default SubformDialog;
