/*
Copyright 2023 Adobe. All rights reserved.
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
import { mixed } from "yup";
import ComponentDependency from "../components/requiredComponent";
import form from "./form";

/** @typedef {import("./form").Form} Form */
/**
 * This create a notice as part of a form
 * @param {object} options - Options for the notice
 * @param {string} options.requiredComponent - The name of the required component (camelCase)
 * @param {string} options.title - The title of the notice
 * @param {boolean} [options.whole] - Is this notice for the whole form? If so, this will disable creating new items and show slightly different alerts.
 * @param {boolean} [options.deprecated] - Whether or not this is a deprecated component.
 * @param {boolean} [options.formOptions] - Options to pass to the children form.
 * @param {Form[]} children - The children to show and hide based on the required component.
 * @returns {Form} A notice form element.
 */
const RequiredComponent = (
  {
    requiredComponent,
    title,
    whole = false,
    deprecated = false,
    ...formOptions
  },
  children = [],
) => {
  const wrapGetValidationShape =
    (wrapped) =>
    ({ initInfo, existingValidationShape }) => {
      const components = initInfo?.extensionSettings?.components || {};
      const isComponentDisabled = components[requiredComponent] === false;
      const isNew = initInfo?.settings == null;

      if (isComponentDisabled && isNew && whole) {
        return {
          requiredComponent: mixed().test(
            "requiredComponent",
            `The ${requiredComponent} component is disabled.`,
            () => false,
          ),
        };
      }

      if (isComponentDisabled && !whole) {
        // No need for any validation because the child form will never be shown
        return {};
      }

      return wrapped({ initInfo, existingValidationShape });
    };

  const {
    getInitialValues,
    getSettings,
    getValidationShape,
    Component: ChildComponent,
  } = form({ ...formOptions, wrapGetValidationShape }, children);

  const Component = (props) => {
    const { initInfo } = props;
    return (
      <ComponentDependency
        initInfo={initInfo}
        requiredComponent={requiredComponent}
        title={title}
        whole={whole}
        deprecated={deprecated}
      >
        <ChildComponent {...props} />
      </ComponentDependency>
    );
  };

  Component.propTypes = {
    initInfo: PropTypes.object.isRequired,
  };

  return {
    getInitialValues,
    getSettings,
    getValidationShape,
    Component,
  };
};

RequiredComponent.propTypes = {
  requiredComponent: PropTypes.string.isRequired,
  title: PropTypes.string,
  whole: PropTypes.bool,
  deprecated: PropTypes.bool,
};

export default RequiredComponent;
