import React from "react";
import { Flex } from "@adobe/react-spectrum";
import PropTypes from "prop-types";

const FormElementContainer = ({ children, ...otherProps }) => {
  return (
    <Flex direction="column" gap="size-100" {...otherProps}>
      {children}
    </Flex>
  );
};

FormElementContainer.propTypes = {
  children: PropTypes.node
};

export default FormElementContainer;
