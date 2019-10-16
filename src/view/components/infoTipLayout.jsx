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
import PropTypes from "prop-types";
import InfoTip from "./infoTip";

/**
 * Strives to provide an InfoTip that's laid out nicely next to provided children.
 */
const InfoTipLayout = ({ children, className, tip }) => (
  <div className={classNames("u-flex", "u-alignItemsCenter", className)}>
    {children}
    {tip ? <InfoTip className="u-gapLeft">{tip}</InfoTip> : null}
  </div>
);

InfoTipLayout.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  tip: PropTypes.string
};

export default InfoTipLayout;
