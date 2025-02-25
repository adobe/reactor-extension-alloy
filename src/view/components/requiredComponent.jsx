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
import camelCaseToTitleCase from "../utils/camelCaseToTitleCase";

const RequiredComponent = ({
  initInfo,
  requiredComponent,
  title,
  whole = false,
  deprecated = false,
  children,
}) => {
  const components = initInfo?.extensionSettings?.components || {};
  const isComponentDisabled = components[requiredComponent] === false;

  if (!isComponentDisabled) {
    return children;
  }

  const componentLabel = camelCaseToTitleCase(requiredComponent);

  if (whole) {
    const isNew = initInfo?.settings == null;

    if (isNew) {
      // This is returned when the component is disabled and the item is new. We want
      // to only show the error.
      return (
        <InlineAlert
          variant="negative"
          width="size-5000"
          data-test-id="requiredComponentError"
        >
          <Heading>Custom build component disabled</Heading>
          <Content>
            You cannot create {title} because a custom build component is
            disabled on this property. To create this, first enabled the{" "}
            {componentLabel} component in the custom build section of the Web
            SDK extension configuration.
          </Content>
        </InlineAlert>
      );
    }
    // This is returned when the component is diabled and the item is existing. We want
    // to still show the form, but with a warning.
    return (
      <>
        <InlineAlert
          variant="notice"
          width="size-5000"
          data-test-id="requiredComponentWarning"
        >
          <Heading>Custom build component disabled</Heading>
          <Content>
            Warning, {title} will not function correctly because a custom build
            component is disabled on this property. To fix this, first enable
            the {componentLabel} component in the custom build section of the
            Web SDK extension configuration.
          </Content>
        </InlineAlert>
        {children}
      </>
    );
  }
  if (!deprecated) {
    return (
      <InlineAlert width="size-5000">
        <Heading>Custom build component disabled</Heading>
        <Content>
          This part of the configuration is hidden because a custom build
          component is disabled on this property. To set {title}, enable the{" "}
          {componentLabel} component in the custom build section of the Web SDK
          extension configuration.
        </Content>
      </InlineAlert>
    );
  }

  return null;
};

RequiredComponent.propTypes = {
  initInfo: PropTypes.object.isRequired,
  requiredComponent: PropTypes.string.isRequired,
  title: PropTypes.string,
  whole: PropTypes.bool,
  deprecated: PropTypes.bool,
  children: PropTypes.node,
};

export default RequiredComponent;
