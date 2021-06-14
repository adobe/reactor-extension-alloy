/*
Utils to get and set values using . and bracket syntax to traverse
objects and arrays. (i.e. "a.b", "a[1].b")

This is the parsing grammar used:

name -> id nameTail
nameTail -> "[" number "]" nameTail
            "." key
            end
id -> /[^\[\]\.]+/
number -> /[0-9]+/
*/

import { object } from "yup";

const LEFT_BRACKET = value => value === "[";
const RIGHT_BRACKET = value => value === "]";
const DOT = value => value === ".";
const IDENTIFIER = value => value !== "[" && value !== "]" && value !== "." && value !== null;
const NUMBER = value => /^[0-9]+$/.test(value);
const END = value => value === null;

const next = (tokens, expected = () => true) => {
  const { value, done } = tokens.next();
  const token = done ? null : value;
  if (!expected(token)) {
    throw new Error("Invalid name");
  }
  return token;
};

const lex = name => {
  return name.match(/\[|\]|\.|[^\[\]\.]+/g).values();
};

const toObject = mixed => {
  const obj = mixed || {};
  if (typeof obj !== "object") {
    throw new Error("Expected an object");
  }
  return obj;
};

const toArray = mixed => {
  const array = mixed || [];
  if (!Array.isArray(array)) {
    throw new Error("Expected an array");
  }
  return array;
}

const setRules = {
  onObjectProperty(obj, id, recursiveReturn) {
    obj[id] = recursiveReturn;
    return obj;
  },
  onArrayProperty(array, index, recursiveReturn) {
    array[index] = recursiveReturn;
    return array;
  },
  onFinalValue(oldValue, newValue) {
    return newValue;
  }
};

const getRules = {
  onObjectProperty(obj, id, recursiveReturn) {
    return recursiveReturn;
  },
  onArrayProperty(array, index, recursiveReturn) {
    return recursiveReturn;
  },
  onFinalValue(oldValue, newValue) {
    return oldValue;
  }
};

const validationSchemaRules = {
  onObjectProperty(obj, id, recursiveReturn) {
    return object().shape({ [id]: recursiveReturn });
  },
  onArrayProperty(array, index, recursiveReturn) {
    return array().
  }
};

const parseName = (mixed, value, tokens, rules) => {
  const obj = toObject(mixed);
  const id = next(tokens, IDENTIFIER);
  const recursiveReturn = parseNameTail(obj[id], value, tokens, rules);
  return rules.onObjectProperty(obj, id, recursiveReturn);
};

const parseNameTail = (mixed, value, tokens, rules) => {
  const firstToken = next(tokens);
  if (LEFT_BRACKET(firstToken)) {
    const index = next(tokens, NUMBER);
    next(tokens, RIGHT_BRACKET);
    const array = toArray(mixed);
    const recursiveReturn = parseNameTail(array[index], value, tokens, rules);
    return rules.onArrayProperty(array, index, recursiveReturn);
  }
  if (DOT(firstToken)) {
    return parseName(mixed, value, tokens, rules);
  }
  if (END(firstToken)) {
    return rules.onFinalValue(mixed, value);
  }
  throw new Error("Invalid name");
};

export const getValue = (obj, name) => {
  return parseName(obj, null, lex(name), getRules);
};

export const setValue = (obj, name, value) => {
  return parseName(obj, value, lex(name), setRules);
};
