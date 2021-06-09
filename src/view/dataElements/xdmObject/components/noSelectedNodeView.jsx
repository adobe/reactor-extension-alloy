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
import { Flex } from "@adobe/react-spectrum";
import AsteriskIcon from "@spectrum-icons/workflow/Asterisk";
import Alert from "../../../components/alert";
import PopulationAmountIndicator from "./populationAmountIndicator";
import { EMPTY, PARTIAL, FULL } from "../constants/populationAmount";
import IndicatorDescription from "./indicatorDescription";

/**
 * Shown when no node is selected within the XDM tree.
 */
const NoSelectedNodeView = ({ schema, previouslySavedSchemaInfo }) => {
  // The schema used when the data element was last saved is different
  // from the latest configured schema. Either the customer has since
  // changed which dataset is configured in the edge configuration
  // or they have made changes to the schema itself.
  const isSchemaMismatched =
    previouslySavedSchemaInfo &&
    (previouslySavedSchemaInfo.id !== schema.$id ||
      previouslySavedSchemaInfo.version !== schema.version);

  return (
    <div>
      {isSchemaMismatched && (
        <Alert variant="notice" title="Schema Changed" className="u-gapBottom">
          The XDM schema has changed since the XDM object was last saved. After
          the next save, any fields that no longer exist on the XDM schema will
          also no longer be included on the XDM object.
        </Alert>
      )}
      <div>
        <p>
          Build an object that complies with your configured schema by selecting
          attributes on the left and providing their values.
        </p>
        <Flex direction="column" gap="size-100">
          <IndicatorDescription
            indicator={<PopulationAmountIndicator populationAmount={EMPTY} />}
          >
            An empty circle indicates no attributes have been populated.
          </IndicatorDescription>
          <IndicatorDescription
            indicator={<PopulationAmountIndicator populationAmount={PARTIAL} />}
          >
            A partially filled in circle indicates some of the attributes have
            been populated.
          </IndicatorDescription>
          <IndicatorDescription
            indicator={<PopulationAmountIndicator populationAmount={FULL} />}
          >
            A full circle indicates all of the attributes have been populated.
          </IndicatorDescription>
          <IndicatorDescription indicator={<AsteriskIcon size="XS" />}>
            Fields that may be auto-populated when this data element is passed
            to the XDM option of the &quot;Send Event&quot; action have this
            icon. Hovering over the icon shows a popup explaining when the field
            will be auto-populated.
          </IndicatorDescription>
        </Flex>
      </div>
    </div>
  );
};

NoSelectedNodeView.propTypes = {
  schema: PropTypes.object.isRequired,
  previouslySavedSchemaInfo: PropTypes.shape({
    id: PropTypes.string.isRequired,
    version: PropTypes.string.isRequired
  })
};

export default NoSelectedNodeView;
