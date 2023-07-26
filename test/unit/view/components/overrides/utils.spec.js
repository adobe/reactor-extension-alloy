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
import { isDataElement } from "../../../../../src/view/components/overrides/utils";

describe("overrides/utils.js", () => {
  describe("isDataElement()", () => {
    /**
     * [testName, testValue]
     * @type {[string, string][]}
     */
    [
      ["should validate data element", "%my data element%"],
      [
        "should validate data elements with characters in front",
        "abc%my data element%"
      ],
      [
        "should validate data elements with characters in back",
        "%my data element%abc"
      ],
      [
        "should validate data elements with characters in front and back",
        "abc%my data element%abc"
      ],
      [
        "should validate multiple data elements in the same string",
        "%my data element% %my other data element%"
      ]
    ].forEach(([testName, testValue]) => {
      it(testName, () => {
        expect(isDataElement(testValue)).toBe(true);
      });
    });
  });
});
