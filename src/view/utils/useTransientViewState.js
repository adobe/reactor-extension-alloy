import { useContext, useRef } from "react";
import { TransientViewContext } from "../components/transientView";

// returns saved state and a setter for that state
// const [savedInitialValues, setSavedInitialValues] = useTransientViewState();
export default () => {
  const transientViewContext = useContext(TransientViewContext);
  if (!transientViewContext) {
    // this was not called inside of a TransientViewContext.Provider so there is nothing to do
    return [null, () => undefined];
  }

  const ref = useRef();
  if (!ref.current) {
    // calling this function reserves an item in the memento array for this form state.
    ref.current = transientViewContext();
  }

  return ref.current;
};
