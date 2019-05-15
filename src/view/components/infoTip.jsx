/*
Copyright 2019 Adobe. All rights reserved.
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
import Tooltip from "@react/react-spectrum/Tooltip";
import OverlayTrigger from "@react/react-spectrum/OverlayTrigger";

import "./infoTip.styl";
import PropTypes from "prop-types";

const InfoTip = ({ className, placement, children }) => (
  <div className={classNames(className, "InfoTip")}>
    <OverlayTrigger placement={placement || "right"} trigger="hover">
      <span>
        <InfoIcon className="InfoTip-icon" size="XS" />
      </span>
      <Tooltip className="InfoTip-tooltip">{children}</Tooltip>
    </OverlayTrigger>
  </div>
);

InfoTip.propTypes = {
  className: PropTypes.string,
  placement: PropTypes.oneOf(["top", "right", "bottom", "left"]),
  children: PropTypes.node.isRequired
};

export default InfoTip;
