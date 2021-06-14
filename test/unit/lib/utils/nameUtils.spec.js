import { getValue, setValue } from "../../../../src/view/utils/nameUtils";

fdescribe("nameUtils", () => {
  describe("setValue", () => {
    it("sets an object property", () => {
      const obj = {};
      setValue(obj, "foo", "bar");
      expect(obj).toEqual({ foo: "bar" });
    });

    it("overwrites an object property", () => {
      const obj = { a: 1, b: 2 };
      setValue(obj, "a", 3);
      expect(obj).toEqual({ a: 3, b: 2 });
    });

    it("sets a nested property on an empty object", () => {
      const obj = {};
      setValue(obj, "a.b", true);
      expect(obj).toEqual({ a: { b: true }});
    });

    it("overwrites a nested object property", () => {
      const obj = { a: { b: 2, c: 3}, d: 4 };
      setValue(obj, "a.c", 5);
      expect(obj).toEqual({ a: { b: 2, c: 5}, d: 4 });
    });

    it("sets an array value", () => {
      const obj = {};
      setValue(obj, "a[0]", 42);
      expect(obj).toEqual({ a: [42] });
    });

    it("sets a property on an array value", () => {
      const obj = {};
      setValue(obj, "a[0].b", 1);
      expect(obj).toEqual({a: [{ b: 1 }]});
    });

    it("sets nested arrays", () => {
      const obj = {};
      setValue(obj, "a[1][0]", "crazy!");
      expect(obj).toEqual({a: [undefined, ["crazy!"]]});
    });
  });

  describe("getValue", () => {
    it("gets undefined", () => {
      expect(getValue({}, "a")).toEqual(undefined);
    });
    it("gets a property", () => {
      expect(getValue({ a: 1 }, "a")).toEqual(1);
    });
    it("gets a nested property", () => {
      expect(getValue({ a: { b: 2 }}, "a.b")).toEqual(2);
    });
    it("gets an array", () => {
      expect(getValue({ a: [1,2,3] }, "a[1]")).toEqual(2);
    });
  })
});
