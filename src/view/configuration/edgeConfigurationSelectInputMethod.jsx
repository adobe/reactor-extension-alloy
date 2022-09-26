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
import { Link } from "@adobe/react-spectrum";
import EdgeConfigEnvironment from "./edgeConfigEnvironment";
import { DEVELOPMENT, PRODUCTION, STAGING } from "./constants/environmentType";
import Alert from "../components/alert";

const EdgeConfigurationSelectInputMethod = ({ name, initInfo, context }) => {
  const { current } = context;
  const { sandboxes, datastreams } = current;
  if (!sandboxes || !datastreams) {
    return (
      <Alert
        variant="informative"
        title="Error loading configurations for this organisation."
        width="size-5000"
        marginTop="size-100"
      >
        You do not have enough permissions to fetch the organisation
        configurations. See{" "}
        <Link>
          <a
            href="https://experienceleague.adobe.com/docs/experience-platform/collection/permissions.html"
            target="_blank"
            rel="noopener noreferrer"
          >
            Permission management for data collection in Experience Platform
          </a>
        </Link>{" "}
        for more information.
      </Alert>
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
