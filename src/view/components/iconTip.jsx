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

import React from "react";
import classNames from "classnames";
import InfoIcon from "@react/react-spectrum/Icon/Info";
import AlertIcon from "@react/react-spectrum/Icon/Alert";
import Tooltip from "@react/react-spectrum/Tooltip";
import OverlayTrigger from "@react/react-spectrum/OverlayTrigger";

import "./iconTip.styl";
import PropTypes from "prop-types";

export const VARIANT_INSPECT = "inspect";
export const VARIANT_ERROR = "error";

export const PLACEMENT_TOP = "top";
export const PLACEMENT_RIGHT = "right";
export const PLACEMENT_BOTTOM = "bottom";
export const PLACEMENT_LEFT = "left";

export const ICON_SIZE_XS = "XS";
export const ICON_SIZE_S = "S";
export const ICON_SIZE_M = "M";
export const ICON_SIZE_L = "L";
export const ICON_SIZE_XL = "XL";

/**
 * Displays an icon that, when hovered over, displays a tooltip.
 */
const IconTip = ({
  className,
  variant = VARIANT_INSPECT,
  placement = PLACEMENT_RIGHT,
  iconSize = ICON_SIZE_XS,
  children
}) => {
  const Icon = variant === VARIANT_ERROR ? AlertIcon : InfoIcon;
  return (
    <div
      className={classNames(className, "IconTip", {
        "IconTip--error": variant === VARIANT_ERROR
      })}
    >
      <OverlayTrigger placement={placement} trigger="hover">
        <span className="u-flex">
          <Icon className="IconTip-icon" size={iconSize} />
        </span>
        <Tooltip variant={variant} className="IconTip-tooltip">
          {children}
        </Tooltip>
      </OverlayTrigger>
    </div>
  );
};

IconTip.propTypes = {
  className: PropTypes.string,
  variant: PropTypes.oneOf([VARIANT_INSPECT, VARIANT_ERROR]),
  placement: PropTypes.oneOf([
    PLACEMENT_TOP,
    PLACEMENT_RIGHT,
    PLACEMENT_BOTTOM,
    PLACEMENT_LEFT
  ]),
  iconSize: PropTypes.oneOf([
    ICON_SIZE_XS,
    ICON_SIZE_S,
    ICON_SIZE_M,
    ICON_SIZE_L,
    ICON_SIZE_XL
  ]),
  children: PropTypes.node.isRequired
};

export default IconTip;
