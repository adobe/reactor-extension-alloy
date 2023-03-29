import {
  ARRAY,
  BOOLEAN,
  INTEGER,
  NUMBER,
  OBJECT
} from "../constants/schemaType";
import arrayHelpers from "./array";
import booleanHelpers from "./boolean";
import integerHelpers from "./integer";
import numberHelpers from "./number";
import objectHelpers from "./object";
import stringHelpers from "./string";

export default schemaType => {
  switch (schemaType) {
    case ARRAY:
      return arrayHelpers;
    case BOOLEAN:
      return booleanHelpers;
    case INTEGER:
      return integerHelpers;
    case NUMBER:
      return numberHelpers;
    case OBJECT:
      return objectHelpers;
    default:
      return stringHelpers;
  }
};
