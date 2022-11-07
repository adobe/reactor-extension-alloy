const clone = require("./clone");

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

const followPath = (parent, key, path, i) => {
  if (i === path.length) {
    return [parent, key];
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
  parent[key] = value;
  return followPath(value, pathElement, path, i + 1);
};

const createOperation = onLeafNode => (mixed, pathString, value) => {
  const container = { value: mixed };
  const [parent, key] = followPath(
    container,
    "value",
    resolvePath(pathString),
    0
  );
  onLeafNode(parent, key, value);
  return container.value;
};

exports.setValue = createOperation((parent, key, value) => {
  parent[key] = clone(value);
});

exports.deletePath = createOperation((parent, key) => {
  if (Array.isArray(parent)) {
    parent.splice(key, 1);
  } else {
    delete parent[key];
  }
});

exports.pushUndefined = createOperation((parent, key) => {
  parent[key] = toArray(parent[key]);
  parent[key].push(undefined);
});
