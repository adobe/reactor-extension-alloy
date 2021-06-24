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

import React, { useEffect, useContext, useState } from "react";
import { Flex, Link, ProgressCircle } from "@adobe/react-spectrum";
import PropTypes from "prop-types";
import ExtensionViewContext from "../components/extensionViewContext";
import fetchConfigs from "./utils/fetchConfigs";
import Alert from "../components/alert";
import EdgeConfigurationField from "./edgeConfigurationField";

const EdgeConfigurationSelector = ({
  defaultSelectedEdgeConfig,
  touched,
  error,
  setTouched,
  onSelectionChange
}) => {
  const [firstPageOfEdgeConfigs, setFirstPageOfEdgeConfigs] = useState();
  const {
    initInfo: {
      company: { orgId },
      tokens: { imsAccess }
    }
  } = useContext(ExtensionViewContext);

  useEffect(async () => {
    const { results } = await fetchConfigs({
      orgId,
      imsAccess
    });

    setFirstPageOfEdgeConfigs(results);
  }, []);

  if (!firstPageOfEdgeConfigs) {
    return (
      <Flex justifyContent="center" width="size-5000">
        <ProgressCircle size="M" aria-label="Loading..." isIndeterminate />
      </Flex>
    );
  }

  if (firstPageOfEdgeConfigs.length) {
    return (
      <EdgeConfigurationField
        defaultSelectedEdgeConfig={defaultSelectedEdgeConfig}
        touched={touched}
        error={error}
        setTouched={setTouched}
        onSelectionChange={onSelectionChange}
      />
    );
  }

  return (
    <Alert variant="negative" title="No Datastreams" width="size-5000">
      No datastreams exist for your organization. See{" "}
      <Link>
        <a
          href="https://adobe.ly/3dt95he"
          target="_blank"
          rel="noopener noreferrer"
        >
          Configuring a Datastream
        </a>
      </Link>{" "}
      for more information.
    </Alert>
  );
};

EdgeConfigurationSelector.propTypes = {
  defaultSelectedEdgeConfig: PropTypes.object,
  touched: PropTypes.bool,
  error: PropTypes.string,
  setTouched: PropTypes.func.isRequired,
  onSelectionChange: PropTypes.func.isRequired
};

export default EdgeConfigurationSelector;
