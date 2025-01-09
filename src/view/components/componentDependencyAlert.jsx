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

import React from "react";
import PropTypes from "prop-types";
import { InlineAlert, Content } from "@adobe/react-spectrum";

const ComponentDependencyAlert = ({
  initInfo,
  requiredComponent,
  componentLabel,
}) => {
  const components = initInfo?.extensionSettings?.components || {};
  const isComponentDisabled = components[requiredComponent] === false;

  if (!isComponentDisabled) {
    return null;
  }

  return (
    <InlineAlert variant="negative">
      <Content>
        This action requires the {componentLabel} component which is currently
        disabled in the extension configuration. Please enable it to use this
        action.
      </Content>
    </InlineAlert>
  );
};

ComponentDependencyAlert.propTypes = {
  initInfo: PropTypes.object.isRequired,
  requiredComponent: PropTypes.string.isRequired,
  componentLabel: PropTypes.string.isRequired,
};

export default ComponentDependencyAlert;
