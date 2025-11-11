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
import form from "./form";
import { Tabs, TabList, TabPanels, Item, Flex } from "@adobe/react-spectrum";

/** @typedef {import("./form").Form} Form */
/**
 * This function is used to create a form that conditionally renders
 * other form based on a conditional function.
 * @param {object} options The options for the conditional form.
 * @param {Array | string} options.args The name of the formik state field or fields
 * that will be passed to the conditional function as arguments.
 * @param {Function} options.condition If this function returns true, the part's
 * Components will be rendered, the part's schema will be used, and the part's
 * settings will be returned.
 * @param  {Form[]} children The form fragments that will be used when
 * the conditional returns true.
 * @returns {Form} A form that conditionally renders other forms.
 */
// tabLabels and children arrays should be the same length
export default function tabs({label, tabLabels, ...formOptions}, children) {
  // we don't need the Component part of the subForm because we're using the
  // TabPanels component to render the subForm's Component.
  const innerParts = form(formOptions, children);

  const parts = {
    // getInitialValues should run regardless of the condition so that the
    // default formik state can be set up.
    ...innerParts,
    Component: (props) => {
      return (
        <Tabs aria-label={label}>
          <TabList>
            {tabLabels.map((label, i) => (
              <Item key={`tab-${i}`}>{label}</Item>
            ))}
          </TabList>
          <TabPanels>
            {children.map(({ Component }, i) => (
              <Item key={`tab-${i}`}>
                <Flex direction="column" marginTop="size-100">
                  <Component {...props} />
                </Flex>
              </Item>
            ))}
          </TabPanels>
        </Tabs>
      )
    },
  };
  parts.Component.propTypes = {
    namePrefix: PropTypes.string,
  };

  return parts;
}
