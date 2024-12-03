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

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import xdmTree from '../../../../helpers/objectEditor/xdmTree';
import stringEdit from '../../../../helpers/objectEditor/stringEdit';
import arrayEdit from '../../../../helpers/objectEditor/arrayEdit';
import booleanEdit from '../../../../helpers/objectEditor/booleanEdit';
import integerEdit from '../../../../helpers/objectEditor/integerEdit';
import numberEdit from '../../../../helpers/objectEditor/numberEdit';
import objectEdit from '../../../../helpers/objectEditor/objectEdit';
import initializeExtensionView from '../../../../helpers/objectEditor/initializeExtensionView';
import { createTestPage } from '../../../../helpers/utils/testUtils';

const schema = {
  id: "https://ns.adobe.com/unifiedjsqeonly/schemas/8f9fc4c28403e4428bbe7b97436322c44a71680349dfd489",
  version: "1.5",
  type: "object",
  properties: {
    stringField: {
      type: "string",
      title: "String Field"
    },
    numberField: {
      type: "number",
      title: "Number Field"
    },
    integerField: {
      type: "integer",
      title: "Integer Field"
    },
    booleanField: {
      type: "boolean",
      title: "Boolean Field"
    },
    arrayField: {
      type: "array",
      title: "Array Field",
      items: {
        type: "string"
      }
    },
    objectField: {
      type: "object",
      title: "Object Field",
      properties: {
        nestedField: {
          type: "string",
          title: "Nested Field"
        }
      }
    }
  }
};

describe('XDM Object Editing', () => {
  beforeEach(async () => {
    createTestPage();
    await initializeExtensionView(null, schema);
  });

  afterEach(() => {
    cleanup();
  });

  it('edits string field', async () => {
    const node = xdmTree.node('String Field');
    await node.click();
    await stringEdit.enterValue('test value');
    await stringEdit.expectValue('test value');
  });

  it('edits number field', async () => {
    const node = xdmTree.node('Number Field');
    await node.click();
    await numberEdit.enterValue('42.5');
    await numberEdit.expectValue('42.5');
  });

  it('edits integer field', async () => {
    const node = xdmTree.node('Integer Field');
    await node.click();
    await integerEdit.enterValue('42');
    await integerEdit.expectValue('42');
  });

  it('edits boolean field', async () => {
    const node = xdmTree.node('Boolean Field');
    await node.click();
    await booleanEdit.check();
    await booleanEdit.expectChecked();
  });

  it('edits array field', async () => {
    const node = xdmTree.node('Array Field');
    await node.click();
    await arrayEdit.addItem();
    await arrayEdit.enterItemValue(0, 'item 1');
    await arrayEdit.expectItemValue(0, 'item 1');
  });

  it('edits object field', async () => {
    const node = xdmTree.node('Object Field');
    await node.click();
    await node.toggleExpansion();

    const nestedNode = xdmTree.node('Nested Field');
    await nestedNode.click();
    await stringEdit.enterValue('nested value');
    await stringEdit.expectValue('nested value');
  });

  it('validates required fields', async () => {
    const node = xdmTree.node('String Field');
    await node.click();
    await stringEdit.enterValue('');
    await node.expectIsNotValid();
  });

  it('shows population indicators', async () => {
    const node = xdmTree.node('String Field');
    await node.click();
    await stringEdit.enterValue('test value');
    await node.populationIndicator.expectFull();

    const emptyNode = xdmTree.node('Number Field');
    await emptyNode.populationIndicator.expectEmpty();
  });
}); 