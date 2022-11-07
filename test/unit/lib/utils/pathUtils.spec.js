/*
Copyright 2022 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0
Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
*/

import {
  setValue,
  deletePath,
  pushUndefined
} from "../../../../src/lib/utils/pathUtils";

describe("pathUtils", () => {
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
      expect(obj).toEqual({ a: { b: true } });
    });

    it("overwrites a nested object property", () => {
      const obj = { a: { b: 2, c: 3 }, d: 4 };
      setValue(obj, "a.c", 5);
      expect(obj).toEqual({ a: { b: 2, c: 5 }, d: 4 });
    });

    it("sets an array value", () => {
      const obj = {};
      setValue(obj, "a.0", 42);
      expect(obj).toEqual({ a: [42] });
    });

    it("sets a property on an array value", () => {
      const obj = {};
      setValue(obj, "a.0.b", 1);
      expect(obj).toEqual({ a: [{ b: 1 }] });
    });

    it("sets nested arrays", () => {
      const obj = {};
      setValue(obj, "a.1.0", "crazy!");
      expect(obj).toEqual({ a: [undefined, ["crazy!"]] });
    });
  });

  describe("deletePath", () => {
    it("deletes the whole thing", () => {
      expect(deletePath({ a: "b" }, "")).toEqual(undefined);
    });
    it("deletes an element in an object", () => {
      const obj = { a: "b", c: "d" };
      deletePath(obj, "a");
      expect(Object.keys(obj)).toEqual(["c"]);
    });
    it("deletes an element in an array", () => {
      const arr = [1, 2, 3];
      deletePath(arr, "1");
      expect(arr).toEqual([1, 3]);
    });
    it("deletes an element in a nested array", () => {
      const obj = {};
      setValue(obj, "a.b.c", "hello");
      deletePath(obj, "a.b.c");
      expect(obj).toEqual({ a: { b: {} } });
    });
    it("deletes an element that isn't there", () => {
      const obj = {};
      deletePath(obj, "a.b.0");
      expect(obj).toEqual({ a: { b: [] } });
    });
  });

  describe("push", () => {
    it("adds an element", () => {
      const obj = {};
      pushUndefined(obj, "a.b");
      pushUndefined(obj, "a.b");
      setValue(obj, "a.b.-1", "value2");
      expect(obj).toEqual({ a: { b: [undefined, "value2"] } });
    });
  });
});
