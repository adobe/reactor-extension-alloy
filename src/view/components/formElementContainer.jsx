import React from "react";
import { Flex } from "@adobe/react-spectrum";
import PropTypes from "prop-types";
import "./formElementContainer.styl";

const FormElementContainer = ({ children, ...otherProps }) => {
  return (
    <Flex
      direction="column"
      UNSAFE_className="FormElementContainer"
      {...otherProps}
    >
      {children}
    </Flex>
  );
};

FormElementContainer.propTypes = {
  children: PropTypes.node
};

export default FormElementContainer;
