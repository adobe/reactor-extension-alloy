/*
Copyright 2020 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
*/

import { t } from "testcafe";
import {
  createTestIdSelector,
  createTestIdSelectorString
} from "../../../helpers/dataTestIdSelectors";

const xdmTree = createTestIdSelector("xdmTree");

export default {
  node: title => {
    const node = xdmTree
      .find(createTestIdSelectorString("xdmTreeNodeTitleDisplayName"))
      .withText(title)
      .parent(createTestIdSelectorString("xdmTreeNodeTitle"))
      .nth(0);
    const populationIndicator = node.find(
      createTestIdSelectorString("populationAmountIndicator")
    );
    const expansionToggle = node
      .parent(".ant-tree-treenode")
      .nth(0)
      .find(".ant-tree-switcher");
    return {
      click: async () => {
        await t.click(node);
      },
      toggleExpansion: async () => {
        await t.click(expansionToggle);
      },
      populationIndicator: {
        expectFull: async () => {
          await t.expect(populationIndicator.hasClass("is-full")).ok();
        },
        expectPartial: async () => {
          return t.expect(populationIndicator.hasClass("is-partial")).ok();
        },
        expectEmpty: async () => {
          await t.expect(populationIndicator.hasClass("is-empty")).ok();
        },
        expectBlank: async () => {
          await t.expect(populationIndicator.exists).notOk();
        }
      },
      expectIsValid: async () => {
        await t.expect(node.hasClass("is-invalid")).notOk();
      },
      expectIsNotValid: async () => {
        await t.expect(node.hasClass("is-invalid")).ok();
      },
      expectExists: async () => {
        await t.expect(node.exists).ok();
      },
      expectNotExists: async () => {
        await t.expect(node.exists).notOk();
      }
    };
  }
};
