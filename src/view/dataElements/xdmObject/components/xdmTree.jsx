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

import React, { useState } from "react";
import PropTypes from "prop-types";
import { Tree } from "antd";
import "antd/es/tree/style/css";
import "./xdmTree.styl";
import generateTreeStructure from "../helpers/generateTreeStructure";
import getNodeIdsToExpandForValidation from "../helpers/getNodeIdsToExpandForValidation";
import XdmTreeNodeTitle from "./xdmTreeNodeTitle";
import useNewlyValidatedFormSubmission from "../helpers/useNewlyValidatedFormSubmission";

const { TreeNode } = Tree;

const renderTreeNodes = (nodes = []) => {
  return nodes.map(node => {
    const {
      id,
      disabled,
      children,
      displayName,
      type,
      isPopulated,
      error
    } = node;
    return (
      <TreeNode
        title={
          <XdmTreeNodeTitle
            displayName={displayName}
            type={type}
            isPopulated={isPopulated}
            error={error}
          />
        }
        key={id}
        disabled={disabled}
      >
        {children ? renderTreeNodes(children) : null}
      </TreeNode>
    );
  });
};

const XdmTree = props => {
  const { formikProps, selectedNodeId, onSelect = () => {} } = props;
  const { values: formState, errors, touched } = formikProps;
  const [expandedNodeIds, setExpandedNodeIds] = useState([]);
  const treeStructure = generateTreeStructure({
    formState,
    errors,
    touched
  });

  // Expand invalid items when the user attempts to submit the form, but
  // not when validation occurs as a result of a user changing the value
  // of a field (it's jarring).
  useNewlyValidatedFormSubmission({
    formikProps,
    callback: () => {
      const nodeIdsContainingError = getNodeIdsToExpandForValidation(
        treeStructure
      );

      if (nodeIdsContainingError.length) {
        setExpandedNodeIds(nodeIdsContainingError);
      }
    }
  });

  const onTreeSelect = newSelectedNodeIds => {
    onSelect(newSelectedNodeIds[0]);
  };

  const onTreeExpand = newExpandedNodeIds => {
    setExpandedNodeIds(newExpandedNodeIds);
  };

  return (
    <Tree
      data-test-id="xdmTree"
      className="XdmTree"
      onSelect={onTreeSelect}
      onExpand={onTreeExpand}
      selectedKeys={selectedNodeId ? [selectedNodeId] : []}
      expandedKeys={expandedNodeIds}
      showLine
    >
      {renderTreeNodes(treeStructure.children)}
    </Tree>
  );
};

XdmTree.propTypes = {
  formikProps: PropTypes.object.isRequired,
  selectedNodeId: PropTypes.string,
  onSelect: PropTypes.func
};

export default XdmTree;
