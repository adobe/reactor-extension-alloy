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
import PropTypes from "prop-types";
import EdgeConfigEnvironment from "./edgeConfigEnvironment";
import { DEVELOPMENT, PRODUCTION, STAGING } from "./constants/environmentType";

const EdgeConfigurationSelectInputMethod = ({ name, initInfo, context }) => {
  const { current } = context;
  const { sandboxes, datastreams } = current;
  if (!sandboxes || !datastreams) {
    return (
      <>
        <h2>There was an issue while fetching configurations</h2>
      </>
    );
  }
  return (
    <>
      <EdgeConfigEnvironment
        name={`${name}.productionEnvironment`}
        initInfo={initInfo}
        context={context}
        environmentType={PRODUCTION}
      />
      <EdgeConfigEnvironment
        name={`${name}.stagingEnvironment`}
        initInfo={initInfo}
        context={context}
        environmentType={STAGING}
      />
      <EdgeConfigEnvironment
        name={`${name}.developmentEnvironment`}
        initInfo={initInfo}
        context={context}
        environmentType={DEVELOPMENT}
      />
    </>
  );
};

EdgeConfigurationSelectInputMethod.propTypes = {
  name: PropTypes.string.isRequired,
  initInfo: PropTypes.object.isRequired,
  context: PropTypes.object
};

export default EdgeConfigurationSelectInputMethod;
