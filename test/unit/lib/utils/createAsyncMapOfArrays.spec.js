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

import createAsyncMapOfArrays from "../../../../src/lib/utils/createAsyncMapOfArrays";

describe("createAsyncMapOfArrays", () => {
  let subject;
  beforeEach(() => {
    subject = createAsyncMapOfArrays();
  });

  it("returns empty array when nothing was added for flushKeys", async () => {
    const propositions = await subject.flushKeys(["myscope"]);
    expect(propositions).toEqual([]);
  });

  it("returns empty array when nothing was added for flushAll", async () => {
    const propositions = await subject.flushAll();
    expect(propositions).toEqual([]);
  });

  it("adds a key and retrieves with flushKeys", async () => {
    subject.addTo(
      ["mykey1"],
      Promise.resolve([["mykey1", "myvalueA"], ["mykey1", "myvalueB"]])
    );
    const values1 = await subject.flushKeys(["mykey1"]);
    expect(values1).toEqual(["myvalueA", "myvalueB"]);
    const values2 = await subject.flushKeys(["mykey1"]);
    expect(values2).toEqual([]);
  });

  it("adds a key and retrieves with flushAll", async () => {
    subject.addTo(
      ["mykey1"],
      Promise.resolve([["mykey1", "myvalueA"], ["mykey1", "myvalueB"]])
    );
    const values1 = await subject.flushAll(["mykey1"]);
    expect(values1).toEqual(["myvalueA", "myvalueB"]);
    const values2 = await subject.flushAll(["mykey1"]);
    expect(values2).toEqual([]);
  });

  it("adds a key and retrieves with flushKeys concurrently", async () => {
    const values0Promise = subject.flushKeys(["mykey1"]);
    subject.addTo(
      ["mykey1"],
      Promise.resolve([["mykey1", "myvalueA"], ["mykey1", "myvalueB"]])
    );
    const values1Promise = subject.flushKeys(["mykey1"]);
    const values2Promise = subject.flushKeys(["mykey1"]);
    const values0 = await values0Promise;
    const values1 = await values1Promise;
    const values2 = await values2Promise;
    expect(values0).toEqual([]);
    expect(values1).toEqual(["myvalueA", "myvalueB"]);
    expect(values2).toEqual([]);
  });

  it("adds a key and retrieves with flushAll concurrently", async () => {
    const values0Promise = subject.flushAll();
    subject.addTo(
      ["mykey1"],
      Promise.resolve([["mykey1", "myvalueA"], ["mykey1", "myvalueB"]])
    );
    const values1Promise = subject.flushAll();
    const values2Promise = subject.flushAll();
    const values0 = await values0Promise;
    const values1 = await values1Promise;
    const values2 = await values2Promise;
    expect(values0).toEqual([]);
    expect(values1).toEqual(["myvalueA", "myvalueB"]);
    expect(values2).toEqual([]);
  });

  it("adds multiple keys and retrieves with flushKeys", async () => {
    subject.addTo(
      ["a", "b", "c"],
      Promise.resolve([["a", "a1"], ["b", "b1"], ["a", "a2"]])
    );
    const values1 = await subject.flushKeys(["a", "c"]);
    const values2 = await subject.flushKeys(["a", "b"]);
    expect(values1).toEqual(["a1", "a2"]);
    expect(values2).toEqual(["b1"]);
  });

  it("adds multiple keys and retrieves with flushAll", async () => {
    subject.addTo(
      ["a", "b", "c"],
      Promise.resolve([["a", "a1"], ["b", "b1"], ["a", "a2"]])
    );
    const values1 = await subject.flushAll();
    const values2 = await subject.flushKeys(["a"]);
    expect(values1).toEqual(["a1", "a2", "b1"]);
    expect(values2).toEqual([]);
  });
});
