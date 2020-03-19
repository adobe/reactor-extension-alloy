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
import switchToIframe from "../../../helpers/switchToIframe";
import {
  createTestIdSelector,
  createTestIdSelectorString
} from "../../../helpers/dataTestIdSelectors";

const xdmTree = createTestIdSelector("xdmTree");

const getNode = async title => {
  await switchToIframe();
  return xdmTree
    .find(createTestIdSelectorString("xdmTreeNodeTitleDisplayName"))
    .withText(title)
    .parent(createTestIdSelectorString("xdmTreeNodeTitle"))
    .nth(0);
};

export default {
  click: async title => {
    const node = await getNode(title);
    await t.click(node);
  },
  toggleExpansion: async title => {
    const node = await getNode(title);
    await t.click(
      node
        .parent("li")
        .nth(0)
        .find(".ant-tree-switcher")
    );
  }
};
