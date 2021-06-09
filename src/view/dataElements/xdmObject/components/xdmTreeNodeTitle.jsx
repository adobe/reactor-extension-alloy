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
import AlertIcon from "@spectrum-icons/workflow/Alert";
import AsteriskIcon from "@spectrum-icons/workflow/Asterisk";
import PopulationAmountIndicator from "./populationAmountIndicator";
import "./xdmTreeNodeTitle.styl";
import { EMPTY, FULL, PARTIAL, BLANK } from "../constants/populationAmount";

const XdmTreeNodeTitle = props => {
  const { displayName, type, populationAmount, error, infoTip } = props;

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
        <div className="u-flex u-alignItemsCenter u-gapRight" title={error}>
          <AlertIcon color="negative" size="S" />
        </div>
      )}
      <PopulationAmountIndicator
        className="u-gapRight"
        populationAmount={populationAmount}
      />
      <span data-test-id="xdmTreeNodeTitleDisplayName" className="u-noWrap">
        {displayName}
      </span>
      {infoTip && (
        <div className="u-flex u-alignItemsCenter u-gapLeft" title={infoTip}>
          <AsteriskIcon size="XS" />
        </div>
      )}
      <span className="XdmTreeNodeTitle-type u-gapLeft u-gapRight">{type}</span>
    </div>
  );
};

XdmTreeNodeTitle.propTypes = {
  displayName: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  populationAmount: PropTypes.oneOf([FULL, PARTIAL, EMPTY, BLANK]),
  error: PropTypes.string,
  infoTip: PropTypes.string
};

export default XdmTreeNodeTitle;
