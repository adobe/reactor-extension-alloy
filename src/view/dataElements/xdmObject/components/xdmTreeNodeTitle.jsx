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
import PropTypes from "prop-types";
import classNames from "classnames";
import IconTip, {
  ICON_SIZE_S,
  VARIANT_ERROR
} from "../../../components/iconTip";
import PopulationAmountIndicator from "./populationAmountIndicator";
import "./xdmTreeNodeTitle.styl";
import { EMPTY, FULL, PARTIAL } from "../constants/populationAmount";

/**
 * The display for a specific node within the XDM tree.
 * @param {Object} props
 * @param {string} props.displayName The node's user-friendly name.
 * @param {string} props.type The node type (object, array, string, etc.)
 * @param {boolean} props.isPopulated Whether the node has been directly
 * populated (if using the WHOLE population method) or at least one of its
 * descendants has been populated (if using the PARTS population method).
 * @param {string} [error] The validation error message pertaining to
 * this node, if any.
 */
const XdmTreeNodeTitle = props => {
  const { displayName, type, populationAmount, error } = props;

  return (
    <div
      data-test-id="xdmTreeNodeTitle"
      className={classNames(
        "XdmTreeNodeTitle",
        "u-flex",
        "u-alignItemsCenter",
        {
          "is-invalid": error
        }
      )}
    >
      {error && (
        <IconTip
          variant={VARIANT_ERROR}
          iconSize={ICON_SIZE_S}
          className="u-gapRight"
        >
          {error}
        </IconTip>
      )}
      <PopulationAmountIndicator
        className="u-gapRight"
        populationAmount={populationAmount}
      />
      <span data-test-id="xdmTreeNodeTitleDisplayName">{displayName}</span>
      <span className="XdmTreeNodeTitle-type u-gapLeft u-gapRight">{type}</span>
    </div>
  );
};

XdmTreeNodeTitle.propTypes = {
  displayName: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  populationAmount: PropTypes.oneOf([FULL, PARTIAL, EMPTY]),
  error: PropTypes.string
};

export default XdmTreeNodeTitle;
