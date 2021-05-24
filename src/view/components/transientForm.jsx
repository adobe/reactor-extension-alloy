import React, { useRef } from "react";
import PropTypes from "prop-types";
import TransientFormContext from "./transientFormContext";

const TransientForm = ({ memento, children }) => {
  const nextIndex = useRef(0);

  memento.current = memento.current || [];

  const context = () => {
    const index = nextIndex.current;
    nextIndex.current += 1;
    if (memento.current.length >= index) {
      memento.current.push(undefined);
    }
    return {
      get value() {
        return memento.current[index];
      },
      set value(newValue) {
        memento.current[index] = newValue;
      }
    };
  };

  return (
    <TransientFormContext.Provider value={context}>
      {children}
    </TransientFormContext.Provider>
  );
};

TransientForm.propTypes = {
  memento: PropTypes.object.isRequired,
  children: PropTypes.node.isRequired
};

export default TransientForm;
