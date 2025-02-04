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
import { InlineAlert, Content, Heading } from "@adobe/react-spectrum";

const ComponentDependency = ({
  initInfo,
  requiredComponent,
  componentLabel,
  children,
}) => {
  const components = initInfo?.extensionSettings?.components || {};
  const isComponentDisabled = components[requiredComponent] === false;
  const isNew = initInfo?.settings == null;

  if (!isComponentDisabled) {
    return children;
  }

  if (isNew) {
    // This is returned when the component is disabled and the item is new. We want
    // to only show the error.
    return (
      <InlineAlert variant="negative">
        <Heading>Missing Component</Heading>
        <Content>
          To use this please enable the {componentLabel} component in the
          extension configuration.
        </Content>
      </InlineAlert>
    );
  }

  // This is returned with the component is diabled and the item is existing. We want
  // to still show the form, but with a warning.
  return (
    <>
      <InlineAlert variant="notice">
        <Heading>Missing Component</Heading>
        <Content>
          If you do not enable the {componentLabel} component in the extension
          configuration, this will not work.
        </Content>
      </InlineAlert>
      {children}
    </>
  );
};

ComponentDependency.propTypes = {
  initInfo: PropTypes.object.isRequired,
  requiredComponent: PropTypes.string.isRequired,
  componentLabel: PropTypes.string.isRequired,
  children: PropTypes.node,
};

export default ComponentDependency;
