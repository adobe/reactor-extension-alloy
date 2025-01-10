import { describe, it, expect } from "vitest";
import deepDelete from "../../../../src/view/utils/deepDelete";

describe("deepDelete", () => {
  it("should delete a leaf node", () => {
    const obj = {
      a: {
        b: {
          c: "value",
        },
      },
    };
    deepDelete(obj, "a.b.c");
    expect(obj).toEqual({
      a: {
        b: {},
      },
    });
  });
  it("should delete a node in the middle", () => {
    const obj = {
      a: {
        b: {
          c: "value",
        },
      },
    };
    deepDelete(obj, "a.b");
    expect(obj).toEqual({
      a: {},
    });
  });
  it("should delete a node at the root", () => {
    const obj = {
      a: {
        b: {
          c: "value",
        },
      },
    };
    deepDelete(obj, "a");
    expect(obj).toEqual({});
  });
  it("should do nothing if the property does not exist", () => {
    const obj = {
      a: {
        b: {
          c: "value",
        },
      },
    };
    deepDelete(obj, "a.b.d");
    expect(obj).toEqual({
      a: {
        b: {
          c: "value",
        },
      },
    });
  });
});
