import { deepAssign } from "../../../../src/view/utils/deepAssign";

describe("deepAssign", () => {
  it("should assign a value to a property path on an object without modifying nearby properties", () => {
    const obj = { a: { b: { e: 2 }, d: 1 } };
    deepAssign(obj, "a.b.c", 1);
    expect(obj).toEqual({ a: { b: { c: 1, e: 2 }, d: 1 } });
  });

  it("should overwrite existing values", () => {
    const obj = { a: { b: { e: 2 }, d: 1 } };
    deepAssign(obj, "a.b.e", 3);
    expect(obj).toEqual({ a: { b: { e: 3 }, d: 1 } });
  });

  it("should throw an error when a non-object is encountered in the path", () => {
    expect(() => {
      deepAssign(1, "a.b.c", 1);
    }).toThrow();
  });
});
