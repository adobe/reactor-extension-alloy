import { describe, it, expect } from "vitest";
import deepSet from "../../../../src/view/utils/deepSet";

describe("deepSet", () => {
  it("should set the value of a nested property", () => {
    const obj = {};
    deepSet(obj, "a.b.c", "value");
    expect(obj).toEqual({
      a: {
        b: {
          c: "value",
        },
      },
    });
  });
  it("should set the value of a nested property when the property already exists", () => {
    const obj = {
      a: {
        b: {
          c: "value",
        },
      },
    };
    deepSet(obj, "a.b.d", "value");
    expect(obj).toEqual({
      a: {
        b: {
          c: "value",
          d: "value",
        },
      },
    });
  });
  it("should set the value of a nested property when the property already exists and is an array", () => {
    const obj = {
      a: {
        b: {
          c: ["value"],
        },
      },
    };
    deepSet(obj, "a.b.c.1", "value");
    expect(obj).toEqual({
      a: {
        b: {
          c: ["value", "value"],
        },
      },
    });
  });
  it("should set the value of a nested property when the property already exists and is an array with a hole", () => {
    const obj = {
      a: {
        b: {
          c: ["value"],
        },
      },
    };
    deepSet(obj, "a.b.c.3", "value");
    expect(obj).toEqual({
      a: {
        b: {
          c: ["value", undefined, undefined, "value"],
        },
      },
    });
  });
  it("should throw an exception if the object is undefined or null or a primitive", () => {
    expect(() => {
      deepSet(undefined, "a.b.c", "value");
    }).toThrowError();
    expect(() => {
      deepSet(null, "a.b.c", "value");
    }).toThrowError();
    expect(() => {
      deepSet(1, "a.b.c", "value");
    }).toThrowError();
    expect(() => {
      deepSet("string", "a.b.c", "value");
    }).toThrowError();
    expect(() => {
      deepSet(true, "a.b.c", "value");
    }).toThrowError();
  });
});
