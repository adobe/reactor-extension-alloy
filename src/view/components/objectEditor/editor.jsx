/*
Copyright 2021 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
*/

import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useFormikContext } from "formik";
import { Flex, View } from "@adobe/react-spectrum";
import XdmTree, { scrollNodeIntoView } from "./xdmTree";
import NodeEdit from "./nodeEdit";
import NoSelectedNodeView from "./noSelectedNodeView";
import getNodeEditData from "./helpers/getNodeEditData";
import { ARRAY, OBJECT } from "./constants/schemaType";

const fetchNodeIdsForDepth = (formStateNode, depth) => {
  if (depth === 0) {
    return [];
  }
  const {
    schema: { type },
    properties,
    items,
    id
  } = formStateNode;
  if (type === OBJECT && properties) {
    return Object.keys(properties).reduce(
      (nodeIds, key) => {
        return nodeIds.concat(fetchNodeIdsForDepth(properties[key], depth - 1));
      },
      [id]
    );
  }
  if (type === ARRAY && items) {
    return Array.keys(items).reduce(
      (nodeIds, i) => {
        return nodeIds.concat(fetchNodeIdsForDepth(items[i], depth - 1));
      },
      [id]
    );
  }
  return [];
};

const Editor = ({
  selectedNodeId,
  setSelectedNodeId,
  schema,
  previouslySavedSchemaInfo,
  initialExpandedDepth = 0
}) => {
  const { values: formState } = useFormikContext();
  const [expandedNodeIdsInTree, setExpandedNodeIdsInTree] = useState(() => {
    // There is a root node with the id node-1. We don't want that.
    return fetchNodeIdsForDepth(formState, initialExpandedDepth + 1).slice(1);
  });
  const [
    nodeIdToScrollIntoViewInTree,
    setNodeIdToScrollIntoViewInTree
  ] = useState();

  const expandNodeAndAncestorsInTree = nodeId => {
    if (!nodeId) {
      return;
    }
    const {
      breadcrumb,
      formStateNode: {
        schema: { type }
      }
    } = getNodeEditData({
      formState,
      nodeId
    });
    if (type !== OBJECT && type !== ARRAY) {
      // don't add the nodeId of the last item in the breadcrumbs if it is a leaf node
      breadcrumb.pop();
    }
    const newExpandedNodeIds = breadcrumb.reduce((memo, breadcrumbItem) => {
      const { nodeId: breadcrumbItemNodeId } = breadcrumbItem;
      if (!memo.includes(breadcrumbItemNodeId)) {
        memo.push(breadcrumbItemNodeId);
      }
      return memo;
    }, expandedNodeIdsInTree.slice());
    setExpandedNodeIdsInTree(newExpandedNodeIds);
  };

  useEffect(() => {
    if (nodeIdToScrollIntoViewInTree) {
      scrollNodeIntoView(nodeIdToScrollIntoViewInTree);
      setNodeIdToScrollIntoViewInTree(undefined);
    }
  }, [nodeIdToScrollIntoViewInTree]);

  return (
    <Flex
      data-test-id="editor"
      marginTop="size-100"
      minHeight={0}
      gap="size-200"
    >
      {
        // Minimum of 300px wide, but can expand. This is for when the user
        // has nodes with really long text or they expand several nodes, making
        // the tree very wide. Another option is to limit the width, but show a
        // horizontal scrollbar. Be aware that limiting the width has an interesting
        // side effect in Safari, because Safari doesn't allow you to scroll the page by
        // scrolling the scroll wheel or swiping when the cursor is over an element
        // that has a scrollbar (vertical or horizontal).
      }
      <View flex="1 0 300px">
        <XdmTree
          selectedNodeId={selectedNodeId}
          expandedNodeIds={expandedNodeIdsInTree}
          setExpandedNodeIds={setExpandedNodeIdsInTree}
          onSelect={nodeId => {
            setSelectedNodeId(nodeId);
            expandNodeAndAncestorsInTree(nodeId);
          }}
        />
      </View>
      {
        // By default, this flex child will stretch to the height of the
        // flex container. In our case, we want the flex child to shrink
        // to its content so that it can float within the parent using
        // position="sticky". This is why we have alignSelf="flex-start".
        // We have 450px as min width because the tree can stretch in width
        // and we don't want to shrink too much. If there isn't enough
        // space on the page, the page will receive a horizontal scrollbar.
      }
      <View flex="1 0 450px" alignSelf="flex-start" position="sticky" top={0}>
        {selectedNodeId ? (
          <NodeEdit
            onNodeSelect={nodeId => {
              setSelectedNodeId(nodeId);
              expandNodeAndAncestorsInTree(nodeId);
              setNodeIdToScrollIntoViewInTree(nodeId);
            }}
            selectedNodeId={selectedNodeId}
          />
        ) : (
          <NoSelectedNodeView
            schema={schema}
            previouslySavedSchemaInfo={previouslySavedSchemaInfo}
          />
        )}
      </View>
    </Flex>
  );
};

Editor.propTypes = {
  selectedNodeId: PropTypes.string,
  setSelectedNodeId: PropTypes.func.isRequired,
  schema: PropTypes.object,
  previouslySavedSchemaInfo: PropTypes.shape({
    id: PropTypes.string.isRequired,
    version: PropTypes.string.isRequired
  }),
  initialExpandedDepth: PropTypes.number
};

export default Editor;
