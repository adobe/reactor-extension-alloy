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
import EnvironmentField from "./environmentField";
import Alert from "../components/alert";

const EnvironmentsSelector = ({
  name,
  edgeConfig,
  firstPageOfEachEnvironmentType
}) => {
  return (
    <>
      {firstPageOfEachEnvironmentType.production.length > 0 ? (
        <EnvironmentField
          data-test-id="productionEnvironmentComboBox"
          label="Production Environment"
          name={`${name}.productionEnvironment`}
          description="This datastream environment will be used when the Launch library is in a production environment."
          type="production"
          edgeConfigId={edgeConfig.id}
          isDisabled={firstPageOfEachEnvironmentType.production.length === 1}
          isRequired
        />
      ) : (
        <Alert
          variant="negative"
          title="No production environments"
          width="size-5000"
        >
          No production environment exists for this datastream. Please add a
          production environment to your datastream.
        </Alert>
      )}
      {firstPageOfEachEnvironmentType.staging.length > 0 ? (
        <EnvironmentField
          data-test-id="stagingEnvironmentComboBox"
          label="Staging Environment"
          name={`${name}.stagingEnvironment`}
          description="This datastream environment will be used when the Launch library is in a staging environment."
          type="staging"
          edgeConfigId={edgeConfig.id}
          isDisabled={firstPageOfEachEnvironmentType.staging.length === 1}
        />
      ) : (
        <Alert
          variant="notice"
          title="No staging environments"
          width="size-5000"
        >
          No staging environment exists for this datastream. The production
          environment will be used for the Launch staging environment.
        </Alert>
      )}
      {firstPageOfEachEnvironmentType.development.length > 0 ? (
        <EnvironmentField
          data-test-id="developmentEnvironmentComboBox"
          label="Development Environment"
          name={`${name}.developmentEnvironment`}
          description="This datastream environment will be used when the Launch library is in a development environment."
          type="development"
          edgeConfigId={edgeConfig.id}
          isDisabled={firstPageOfEachEnvironmentType.development.length === 1}
        />
      ) : (
        <Alert
          variant="notice"
          title="No development environments"
          width="size-5000"
        >
          No development environment exists for this datastream. The production
          environment will be used for the Launch development environment.
        </Alert>
      )}
    </>
  );
};

EnvironmentsSelector.propTypes = {
  name: PropTypes.string.isRequired,
  edgeConfig: PropTypes.object.isRequired,
  firstPageOfEachEnvironmentType: PropTypes.object.isRequired
};

export default EnvironmentsSelector;
