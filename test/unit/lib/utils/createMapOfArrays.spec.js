/*
Copyright 2023 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0
Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
*/

import createMapOfArrays from "../../../../src/lib/utils/createMapOfArrays";

describe("createMapOfArrays", () => {
  let subject;
  beforeEach(() => {
    subject = createMapOfArrays();
  });

  it("returns empty array for unknown keys", () => {
    expect(subject.getKeys(["key1"])).toEqual([]);
  });

  it("returns empty array for getAll", () => {
    expect(subject.getAll()).toEqual([]);
  });

  it("sets the pairs", () => {
    subject.setPairs(
      ["key1", "key2"],
      [["key1", "a"], ["key2", "b"], ["key1", "c"]]
    );
    expect(subject.getAll()).toEqual(["a", "c", "b"]);
    expect(subject.getKeys(["key1"])).toEqual(["a", "c"]);
    expect(subject.getKeys(["key2"])).toEqual(["b"]);
    expect(subject.getKeys(["key1", "key2"])).toEqual(["a", "c", "b"]);
    expect(subject.getKeys(["key2", "key1"])).toEqual(["b", "a", "c"]);
    expect(subject.getKeys(["key2", "key3"])).toEqual(["b"]);
  });

  it("overwrites old values", () => {
    subject.setPairs(
      ["key1", "key2"],
      [["key1", "a"], ["key2", "b"], ["key1", "c"]]
    );
    subject.setPairs(["key1", "key2", "key3"], [["key2", "e"], ["key3", "f"]]);
    expect(subject.getAll()).toEqual(["e", "f"]);
    expect(subject.getKeys(["key1"])).toEqual([]);
    expect(subject.getKeys(["key2"])).toEqual(["e"]);
    expect(subject.getKeys(["key3"])).toEqual(["f"]);
  });
});
