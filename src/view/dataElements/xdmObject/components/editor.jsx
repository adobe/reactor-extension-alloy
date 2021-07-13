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

import React from "react";
import PropTypes from "prop-types";
import { Flex, View } from "@adobe/react-spectrum";
import XdmTree from "./xdmTree";
import NodeEdit from "./nodeEdit";
import NoSelectedNodeView from "./noSelectedNodeView";

const Editor = ({
  selectedNodeId,
  setSelectedNodeId,
  schema,
  previouslySavedSchemaInfo
}) => {
  return (
    <Flex
      data-test-id="editor"
      marginTop="size-100"
      minHeight={0}
      gap="size-200"
    >
      <View width="size-3600" flexShrink={0} overflow="auto">
        <XdmTree selectedNodeId={selectedNodeId} onSelect={setSelectedNodeId} />
      </View>
      <div>
        {selectedNodeId ? (
          <NodeEdit
            onNodeSelect={setSelectedNodeId}
            selectedNodeId={selectedNodeId}
          />
        ) : (
          <NoSelectedNodeView
            schema={schema}
            previouslySavedSchemaInfo={previouslySavedSchemaInfo}
          />
        )}
      </div>
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
  })
};

export default Editor;
