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
import classNames from "classnames";
import { Heading, Flex, View } from "@adobe/react-spectrum";
import AlertIcon from "@spectrum-icons/workflow/Alert";
import InfoIcon from "@spectrum-icons/workflow/Info";
import CheckmarkCircle from "@spectrum-icons/workflow/CheckmarkCircle";
import "./alert.styl";
import PropTypes from "prop-types";

const iconByVariant = {
  neutral: () => {
    return null;
  },
  informative: InfoIcon,
  positive: CheckmarkCircle,
  notice: AlertIcon,
  negative: AlertIcon
};

const Alert = ({ variant = "neutral", title, children, width, className }) => {
  const Icon = iconByVariant[variant];
  return (
    <Flex
      direction="column"
      gap="size-100"
      width={width}
      UNSAFE_className={classNames("Alert", `Alert--${variant}`, className)}
    >
      <Flex>
        <View flexGrow={1}>
          <Heading level={4} UNSAFE_className="Alert-title">
            {title}
          </Heading>
        </View>
        <View>
          <Icon size="S" color={variant} />
        </View>
      </Flex>
      <div className="Alert-description">{children}</div>
    </Flex>
  );
};

Alert.propTypes = {
  variant: PropTypes.oneOf([
    "neutral",
    "informative",
    "positive",
    "notice",
    "negative"
  ]),
  title: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  width: PropTypes.string,
  className: PropTypes.string
};

export default Alert;
