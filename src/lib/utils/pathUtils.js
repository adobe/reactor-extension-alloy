const IS_NUMBER_REGEX = /^-?[0-9]+$/;

const resolvePath = path => {
  return path
    .split(".")
    .map(pathElement => {
      if (IS_NUMBER_REGEX.test(pathElement)) {
        return parseInt(pathElement, 10);
      }
      return pathElement;
    })
    .filter(pathElement => pathElement !== "");
};

const toObject = mixed => {
  const obj = mixed || {};
  if (typeof obj !== "object") {
    return {};
  }
  return obj;
};

const toArray = mixed => {
  const array = mixed || [];
  if (!Array.isArray(array)) {
    return [];
  }
  return array;
};

const setValue = (parent, key, value) => {
  if (typeof key === "number") {
    const newArray = parent.slice();
    newArray[key] = value;
    return newArray;
  }
  return {
    ...parent,
    [key]: value
  };
};

const deletePath = (parent, key) => {
  if (typeof key === "number") {
    return [...parent.slice(0, key), ...parent.slice(key + 1)];
  }
  const returnObject = {
    ...parent
  };
  delete returnObject[key];
  return returnObject;
};

const run = (parent, key, path, i, onLeafNode) => {
  if (i === path.length) {
    return onLeafNode(parent, key);
  }

  let value;
  let pathElement = path[i];

  if (typeof pathElement === "number") {
    value = toArray(parent[key]);
    pathElement = pathElement < 0 ? value.length + pathElement : pathElement;
    pathElement = pathElement < 0 ? 0 : pathElement;
  } else {
    value = toObject(parent[key]);
  }
  return setValue(
    parent,
    key,
    run(value, pathElement, path, i + 1, onLeafNode)
  );
};

const createOperation = onLeafNode => (mixed, pathString, value) => {
  return run(
    { value: mixed },
    "value",
    resolvePath(pathString),
    0,
    (parent, key) => {
      return onLeafNode(parent, key, value);
    }
  ).value;
};

exports.setValue = createOperation(setValue);
exports.deletePath = createOperation(deletePath);
