import React, { createContext, useRef } from "react";
import PropTypes from "prop-types";

export const TransientViewContext = createContext();

// This renders a context which is used to save state for something that is transient
// Any ExtensionViewForms under this context will use this to save its values.
// memento is just a ref from a parent that will always render
//
// const option1Memento = useRef();
// const option2Memento = useRef();
//
// if (option1) {
//   return (
//     <TransientView memento={option1Memento}>
//       ...
//     </TransientView>
//   );
// } else {
//   return (
//     <TransientView memento={option2Memento}>
//       ...
//     </TransientView>
//   );
// }
const TransientView = ({ memento, children }) => {

  const nextIndex = useRef(0);
  console.log("TransientView memento", memento, nextIndex);
  memento.current = memento.current || [];

  const context = () => {
    const index = nextIndex.current;
    nextIndex.current += 1;
    if (memento.current.length >= index) {
      memento.current.push(undefined);
    }
    return [
      memento.current[index],
      newValue => {
        memento.current[index] = newValue;
      }
    ];
  };

  return (
    <TransientViewContext.Provider value={context}>
      {children}
    </TransientViewContext.Provider>
  );
};

TransientView.propTypes = {
  memento: PropTypes.object.isRequired,
  children: PropTypes.node.isRequired
};

export default TransientView;
