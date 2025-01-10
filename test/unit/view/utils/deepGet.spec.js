import { describe, it, expect } from "vitest";
import deepGet from "../../../../src/view/utils/deepGet";

describe("deepGet", () => {
  it("should return the value of a nested property", () => {
    const obj = {
      a: {
        b: {
          c: "value",
        },
      },
    };
    expect(deepGet(obj, "a.b.c")).toBe("value");
  });
  it("should return undefined if the property does not exist", () => {
    const obj = {
      a: {
        b: {
          c: "value",
        },
      },
    };
    expect(deepGet(obj, "a.b.d")).toBe(undefined);
  });
  it("should return undefined if the object is undefined", () => {
    expect(deepGet(undefined, "a.b.c")).toBe(undefined);
  });
  it("should return the object if the path is empty", () => {
    const obj = {
      a: {
        b: {
          c: "value",
        },
      },
    };
    expect(deepGet(obj, "")).toBe(obj);
  });
});
