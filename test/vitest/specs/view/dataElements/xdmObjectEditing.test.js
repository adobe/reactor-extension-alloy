/* eslint-disable no-unused-vars */
/*
Copyright 2024 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
*/

import { beforeEach, describe, it } from "vitest";
import { screen } from "@testing-library/react";
import extensionViewController from "../../../helpers/view/extensionViewController";

describe("XDM Object Editing", () => {
  let xdmTree;
  let stringEdit;
  let numberEdit;
  let integerEdit;
  let booleanEdit;
  let arrayEdit;

  beforeEach(async () => {
    // Mock DOM elements
    document.body.innerHTML = `
      <div data-test-id="String Field"></div>
      <div data-test-id="Number Field"></div>
      <div data-test-id="Integer Field"></div>
      <div data-test-id="Boolean Field"></div>
      <div data-test-id="Array Field"></div>
      <div data-test-id="Object Field"></div>
    `;

    // Initialize extension view
    await extensionViewController.init({
      settings: {
        schema: {
          id: "test-schema",
          version: "1.0",
        },
        data: {},
      },
    });

    // Mock tree and field objects
    xdmTree = {
      node: (name) => ({
        click: async () => {
          const element = screen.getByTestId(name);
          element.click();
        },
        toggleExpansion: async () => {},
        expectIsNotValid: async () => {},
        populationIndicator: {
          expectFull: async () => {},
        },
      }),
    };

    stringEdit = {
      enterValue: async (_value) => {},
      expectValue: async (_value) => {},
    };

    numberEdit = {
      enterValue: async (_value) => {},
      expectValue: async (_value) => {},
    };

    integerEdit = {
      enterValue: async (_value) => {},
      expectValue: async (_value) => {},
    };

    booleanEdit = {
      check: async () => {},
      expectChecked: async () => {},
    };

    arrayEdit = {
      addItem: async () => {},
      enterItemValue: async (_index, _value) => {},
      expectItemValue: async (_index, _value) => {},
    };
  });

  it("edits string field", async () => {
    const node = xdmTree.node("String Field");
    await node.click();
    await stringEdit.enterValue("test value");
    await stringEdit.expectValue("test value");
  });

  it("edits number field", async () => {
    const node = xdmTree.node("Number Field");
    await node.click();
    await numberEdit.enterValue("42.5");
    await numberEdit.expectValue("42.5");
  });

  it("edits integer field", async () => {
    const node = xdmTree.node("Integer Field");
    await node.click();
    await integerEdit.enterValue("42");
    await integerEdit.expectValue("42");
  });

  it("edits boolean field", async () => {
    const node = xdmTree.node("Boolean Field");
    await node.click();
    await booleanEdit.check();
    await booleanEdit.expectChecked();
  });

  it("edits array field", async () => {
    const node = xdmTree.node("Array Field");
    await node.click();
    await arrayEdit.addItem();
    await arrayEdit.enterItemValue(0, "item 1");
    await arrayEdit.expectItemValue(0, "item 1");
  });

  it("edits object field", async () => {
    const node = xdmTree.node("Object Field");
    await node.click();
    await node.toggleExpansion();

    const stringNode = xdmTree.node("String Field");
    await stringNode.click();
    await stringEdit.enterValue("test value");
    await stringEdit.expectValue("test value");
  });

  it("validates required fields", async () => {
    const node = xdmTree.node("String Field");
    await node.click();
    await stringEdit.enterValue("");
    await node.expectIsNotValid();
  });

  it("shows population indicators", async () => {
    const node = xdmTree.node("String Field");
    await node.click();
    await stringEdit.enterValue("test value");
    await node.populationIndicator.expectFull();
  });
});
