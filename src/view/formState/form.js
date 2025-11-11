
// props:
// - type, onChange, onBlur, subscribe, getSnapshot, ...other options

import singleDataElementRegex from "../constants/singleDataElementRegex";

// snapshot: Things that change. It could be more than a single value?
// - value, error, touched

// external methods:
// getProps
//



export default function Form({}, children = []) {

}

const cell = () => {
  let value = null;
  const subscriptions = new Set();
  const notify = () => subscriptions.forEach(subscription => subscription());

  return {
    subscribe: (callback) => {
      subscriptions.add(callback);
      return () => subscriptions.delete(callback);
    },
    getValue: () => {
      return snapshot;
    },
    setValue: (newValue) => {
      if (value === newValue) {
        return;
      }
      value = newValue;
      notify();
    },
  };
}

const executeCells = (func, cells) => {
  const values = cells.map(cell => cell.getValue());
  return func(...values);
}

const watchCells = (func, cells) => {
  const callback = () => executeCells(func, cells);
  const unsubscribes = cells.map(cell => cell.subscribe(callback));
  return () => unsubscribes.forEach(unsubscribe => unsubscribe());
}

const getSnapshotCells = (cells) => () => {
  return Object.keys(cells).reduce((acc, key) => {
    return Object.assign(acc, { [key]: cells[key].getValue() });
  }, {});
};

const subscribeCells = (cells) => (callback) => {
  const unsubscribes = Object.keys(cells).map(key => cells[key].subscribe(callback));
  return () => unsubscribes.forEach(unsubscribe => unsubscribe());
}

const conditionalStore = (condition, args, stores) => {
  const child = aggregateStore(stores);
  const children = cell();
  const visible = cell();

  watchCells((...argValues) => {
    visible.setValue(condition(...argValues));
  }, args);

  const unsubscribeChildren = () => undefined;
  visible.subscribe(() => {
    unsubscribeChildren();
    if (visible.getValue()) {
      unsubscribeChildren = child.cells.children.subscribe(() => {
        children.setValue(child.cells.children.getValue());
      });
      children.setValue(child.cells.children.getValue());
    } else {
      unsubscribeChildren = () => undefined;
      children.setValue([]);
    }
  });

  return {
    cells: {
      visible,
      children,
    },
    reset: (initInfo, setting) => {
      child.reset(initInfo, setting);
    },
    getSetting: () => {
      if (visible.getValue()) {
        return child.getSetting();
      }
      return undefined;
    },
    validate: () => {
      if (visible.getValue()) {
        return child.validate();
      }
      return true;
    },
  }
}

const dataElementStore = ({ isRequired = false }) => {

  const valueCell = cell();
  const dataElementCell = cell();
  const dataElementRadioCell = cell();
  const errorCell = cell();
  const touchedCell = cell();

  const cells = {
    value: valueCell,
    dataElement: dataElementCell,
    dataElementRadio: dataElementRadioCell,
    error: errorCell,
    touched: touchedCell,
  };



  return {
    cells,
    reset: (initInfo, setting) => {
      const value = setting || defaultValue;
      if (singleDataElementRegex.test(value)) {
        value.setValue(value);
        dataElement.setValue("");
        dataElementRadio.setValue("dataElement");
      } else {
        value.setValue(value);
        dataElement.setValue("");
        dataElementRadio.setValue("form");
      }

      touchedCell.set(false);

      unsubscribe();
      unsubscribe = watchCells((value, dataElementValue, dataElementRadio) => {
        if (dataElementRadio === "dataElement") {
          if (!dataElementValue.match(singleDataElementRegex)) {
            errorCell.set("Invalid data element.");
          } else {
            errorCell.set(null);
          }
        } else {
          if (isRequired && !value) {
            errorCell.set("This field is required.");
          } else {
            errorCell.set(null);
          }
        }
      }, [valueCell, dataElementCell, dataElementRadioCell]);
    },
    getSetting: () => {
      return executeCells((value, dataElementValue, dataElementRadio) => {
        if (value === defaultValue) {
          return undefined;
        } else if (dataElementRadio === "dataElement") {
          return dataElementValue;
        } else {
          return value;
        }
      }, [valueCell, dataElementCell, dataElementRadioCell]);
    },
    validate: () => {
      touchedCell.set(true);
      return errorCell.getValue() === null;
    },
  };
}

const enumStore = ({ items, isRequired, dataElementSupported, allowCustomValue, defaultValue }) => {
  const selectedKey = cell();
  const value = cell();
  const error = cell();
  const touched = cell();

  // update the selected key based on the value
  watchCells((items, value) => {
    const matchingItem = items.getValue().find(item => item.key === value);
    if (matchingItem) {
      selectedKey.setValue(matchingItem.key);
    } else {
      selectedKey.setValue(null);
    }
  }, [items, value]);

  // update the error based on the value and selected key
  watchCells((value, selectedKey) => {
    if (selectedKey !== null) {
      error.setValue(null);
    } else if (value === "" && isRequired) {
      error.setValue("This field is required.");
    } else if (!singleDataElementRegex.test(value) && dataElementSupported) {
      error.setValue("Please select an option or specify a data element.");
    } else if (!allowsCustomValue) {
      error.setValue("Please select an option from the list.");
    } else {
     error.setValue(null);
    }
  }, [value, selectedKey]);

  // update the touched based on the value
  watchCells(() => {
    touched.setValue(true);
  }, [value]);

  return {
    cells: {
      selectedKey,
      value,
      error,
      touched,
    },
    reset: (settings, key) => {
      value.setValue(settings?.[key] || defaultValue);
      touched.setValue(false);
    },
    getSettings: () => {
      const selectedKey = selectedKey.getValue();

      if (selectedKey !== null) {
        return {}
      return { selectedKey: selectedKey.getValue(), value: value.getValue(), error: error.getValue(), touched: touched.getValue() };
    },

}

const aggregateStore = (stores = {}) => {
  // We use a cell to store the children for consistency, even though the
  // children will never change.
  const children = cell();

  children.setValue(Object.keys(stores).map(key => {
    return {
      key,
      getSnapshot: getSnapshotCells(stores[key].cells),
      subscribe: subscribeCells(stores[key].cells)
    };
  }));

  return {
    cells: { children },
    setSettings: (initInfo, settings) => {
      Object.keys(stores).forEach(key => stores[key].setSettings(initInfo, settings, key));
    },
    getSettings: () => {
     return Object.keys(stores).reduce((acc, childKey) => {
        const settings = stores[childKey].getSettings(childKey);
        if (settings === undefined) {
          return acc;
        }
        return Object.assign(acc, settings);
     }, {});
    },
    validate: () => {
      return Object.keys(stores).every(key => stores[key].validate());
    },
  };
};

const nestedStore = (stores = {}) => {
  const store = aggregateStore(stores);

  return {
    cells: store.cells,
    setSettings: (initInfo, settings, key) => {
      store.setSettings(initInfo, settings?.[key]);
    },
    getSettings: (key) => {
      return { [key]: store.getSettings(key) };
    }
  }
}
