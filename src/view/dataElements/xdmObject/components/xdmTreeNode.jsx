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
import Checkmark from "@react/react-spectrum/Icon/Checkmark";
import classNames from "classnames";
import IconTip, {
  ICON_SIZE_S,
  VARIANT_ERROR
} from "../../../components/iconTip";
import "./xdmTreeNode.styl";

const XdmTreeNode = props => {
  const { title, type, isPopulated, error } = props;

  const populatedIcon = isPopulated ? (
    <Checkmark size="XS" className="u-gapRight" />
  ) : null;

  return (
    <div
      data-test-id="xdmTreeNode"
      className={classNames("XdmTreeNode", "u-flex", "u-alignItemsCenter", {
        "is-invalid": error
      })}
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
      {populatedIcon}
      <span data-test-id="xdmTreeNodeTitle">{title}</span>
      <span className="XdmTreeNode-type u-gapLeft u-gapRight">{type}</span>
    </div>
  );
};

XdmTreeNode.propTypes = {
  title: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  isPopulated: PropTypes.bool.isRequired,
  error: PropTypes.string
};

export default XdmTreeNode;
