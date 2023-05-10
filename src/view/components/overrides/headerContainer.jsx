import { Heading } from "@adobe/react-spectrum";
import PropTypes from "prop-types";
import React from "react";
import SectionHeader from "../sectionHeader";

/**
 * The header for the Overrides Section. Can be standalone, with a bottom border
 * (aka largeHeader), or inline with the other overrides (aka smallHeader).
 * @param {Object} options
 * @param {boolean} [options.largeHeader=false] Use a large or small header. Defaults to false.
 * @param {string | React.Element | React.Element[]} options.children
 * @returns {React.Element}
 */
const HeaderContainer = ({ largeHeader = false, children, ...props }) => {
  if (largeHeader) {
    return <SectionHeader {...props}>{children}</SectionHeader>;
  }
  return (
    <Heading
      {...props}
      level={5}
      margin="0"
      UNSAFE_style={{
        fontWeight: "normal",
        color:
          "var(--spectrum-fieldlabel-text-color, var(--spectrum-alias-label-text-color) )"
      }}
    >
      {children}
    </Heading>
  );
};

HeaderContainer.propTypes = {
  largeHeader: PropTypes.bool,
  children: PropTypes.node.isRequired
};

export default HeaderContainer;
