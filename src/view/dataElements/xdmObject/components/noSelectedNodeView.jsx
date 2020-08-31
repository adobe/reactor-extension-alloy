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
import Alert from "@react/react-spectrum/Alert";
import PopulationAmountIndicator from "./populationAmountIndicator";
import { EMPTY, PARTIAL, FULL } from "../constants/populationAmount";

/**
 * Shown when no node is selected within the XDM tree.
 */
const NoSelectedNodeView = props => {
  const { schemaMeta, previouslySavedSchemaInfo } = props;

  // The schema used when the data element was last saved is different
  // from the latest configured schema. Either the customer has since
  // changed which dataset is configured in the edge configuration
  // or they have made changes to the schema itself.
  const isSchemaMismatched =
    previouslySavedSchemaInfo &&
    (previouslySavedSchemaInfo.id !== schemaMeta.$id ||
      previouslySavedSchemaInfo.version !== schemaMeta.version);

  return (
    <div>
      {isSchemaMismatched && (
        <Alert variant="warning" header="Schema Changed">
          The XDM schema has changed since the XDM object was last saved. After
          the next save, any fields that no longer exist on the XDM schema will
          also no longer be included on the XDM object.
        </Alert>
      )}
      <div>
        <p>
          Build an object that complies with your configured schema by selecting
          attributes on the left and providing their values here.
        </p>
        <p className="u-flex u-alignItemsCenter">
          <PopulationAmountIndicator
            populationAmount={EMPTY}
            className="u-gapRight"
          />
          An empty circle like this indicates no attributes have been filled in.
        </p>
        <p className="u-flex u-alignItemsCenter">
          <PopulationAmountIndicator
            populationAmount={PARTIAL}
            className="u-gapRight"
          />
          A partially filled in circle like this indicates some of the
          attributes have been filled in.
        </p>
        <p className="u-flex u-alignItemsCenter">
          <PopulationAmountIndicator
            populationAmount={FULL}
            className="u-gapRight"
          />
          A full circle like this indicates all of the attributes have been
          filled in.
        </p>
        <p>
          Some attributes show that they are already filled in. These attributes
          will be populated automatically, but you are free to overwrite them.
        </p>
        <p>
          You cannot edit attributes that are disabled because the AEP Web SDK
          does not allow you to overwrite these attributes.
        </p>
      </div>
    </div>
  );
};

NoSelectedNodeView.propTypes = {
  schemaMeta: PropTypes.object.isRequired,
  previouslySavedSchemaInfo: PropTypes.shape({
    id: PropTypes.string.isRequired,
    version: PropTypes.string.isRequired
  })
};

export default NoSelectedNodeView;
