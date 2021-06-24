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
import { Divider, Heading, Link, View } from "@adobe/react-spectrum";
import PropTypes from "prop-types";

const SectionHeader = ({ children, learnMoreUrl }) => {
  return (
    <View marginBottom="size-200">
      <Heading level={2} marginTop="size-600" marginBottom="size-75">
        {children}
      </Heading>
      <Divider margin={0} size="M" />
      {learnMoreUrl && (
        <Link>
          <a href={learnMoreUrl} target="_blank" rel="noopener noreferrer">
            Learn more
          </a>
        </Link>
      )}
    </View>
  );
};

SectionHeader.propTypes = {
  children: PropTypes.node.isRequired,
  learnMoreUrl: PropTypes.string
};

export default SectionHeader;
