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

import React, { useContext, useState, useEffect } from "react";
import { useField } from "formik";
import { Flex, ProgressCircle } from "@adobe/react-spectrum";
import PropTypes from "prop-types";
import EdgeConfigurationSelector from "./edgeConfigurationSelector";
import ExtensionViewContext from "../components/extensionViewContext";
import EnvironmentsSelector from "./environmentsSelector";
import fetchFirstPageOfEachEnvironmentType from "./utils/fetchFirstPageOfEachEnvironmentType";
import UserReportableError from "../errors/userReportableError";
import useReportAsyncError from "../utils/useReportAsyncError";
import useAbortPreviousRequestsAndCreateSignal from "../utils/useAbortPreviousRequestsAndCreateSignal";

const useLoadInitialFirstPageOfEnvironmentsByType = ({
  orgId,
  imsAccess,
  edgeConfig,
  setIsEnvironmentDataLoading,
  setFirstPageOfEachEnvironmentType,
  abortPreviousRequestsAndCreateSignal
}) => {
  const reportAsyncError = useReportAsyncError();
  useEffect(async () => {
    if (edgeConfig) {
      setIsEnvironmentDataLoading(true);
      let newFirstPageOfEachEnvironmentType;

      try {
        newFirstPageOfEachEnvironmentType = await fetchFirstPageOfEachEnvironmentType(
          {
            orgId,
            imsAccess,
            edgeConfigId: edgeConfig.id,
            signal: abortPreviousRequestsAndCreateSignal()
          }
        );
      } catch (e) {
        if (e.name !== "AbortError") {
          reportAsyncError(
            new UserReportableError(`Failed to load datastream environments.`, {
              originatingError: e
            })
          );
        }
        return;
      }

      setFirstPageOfEachEnvironmentType(newFirstPageOfEachEnvironmentType);
    }
    setIsEnvironmentDataLoading(false);
  }, []);
};

const useOnEdgeConfigurationSelectionChange = ({
  orgId,
  imsAccess,
  name,
  setIsEnvironmentDataLoading,
  setFirstPageOfEachEnvironmentType,
  abortPreviousRequestsAndCreateSignal
}) => {
  const reportAsyncError = useReportAsyncError();
  const [, , { setValue: setEdgeConfig }] = useField(`${name}.edgeConfig`);
  const [, , { setValue: setProductionEnvironment }] = useField(
    `${name}.productionEnvironment`
  );
  const [, , { setValue: setStagingEnvironment }] = useField(
    `${name}.stagingEnvironment`
  );
  const [, , { setValue: setDevelopmentEnvironment }] = useField(
    `${name}.developmentEnvironment`
  );

  return async edgeConfig => {
    setIsEnvironmentDataLoading(true);
    setEdgeConfig(edgeConfig);
    setProductionEnvironment(null);
    setStagingEnvironment(null);
    setDevelopmentEnvironment(null);
    let newFirstPageOfEachEnvironmentType;

    try {
      newFirstPageOfEachEnvironmentType = await fetchFirstPageOfEachEnvironmentType(
        {
          orgId,
          imsAccess,
          edgeConfigId: edgeConfig.id,
          signal: abortPreviousRequestsAndCreateSignal()
        }
      );
    } catch (e) {
      if (e.name !== "AbortError") {
        reportAsyncError(
          new UserReportableError(`Failed to load datastream environments.`, {
            originatingError: e
          })
        );
      }
      return;
    }

    setFirstPageOfEachEnvironmentType(newFirstPageOfEachEnvironmentType);
    const {
      production,
      staging,
      development
    } = newFirstPageOfEachEnvironmentType;
    setProductionEnvironment(production.length === 1 ? production[0] : null);
    setStagingEnvironment(staging.length === 1 ? staging[0] : null);
    setDevelopmentEnvironment(development.length === 1 ? development[0] : null);
    setIsEnvironmentDataLoading(false);
  };
};

const EdgeConfigurationSelectInputMethod = ({ name }) => {
  const abortPreviousRequestsAndCreateSignal = useAbortPreviousRequestsAndCreateSignal();
  const {
    initInfo: {
      company: { orgId },
      tokens: { imsAccess }
    }
  } = useContext(ExtensionViewContext);
  const [
    firstPageOfEachEnvironmentType,
    setFirstPageOfEachEnvironmentType
  ] = useState();
  const [isEnvironmentDataLoading, setIsEnvironmentDataLoading] = useState(
    true
  );
  const [
    { value: edgeConfig },
    { touched: edgeConfigTouched, error: edgeConfigError },
    { setTouched: setEdgeConfigTouched }
  ] = useField(`${name}.edgeConfig`);

  useLoadInitialFirstPageOfEnvironmentsByType({
    orgId,
    imsAccess,
    edgeConfig,
    setIsEnvironmentDataLoading,
    setFirstPageOfEachEnvironmentType,
    abortPreviousRequestsAndCreateSignal
  });

  const onEdgeConfigSelectionChange = useOnEdgeConfigurationSelectionChange({
    orgId,
    imsAccess,
    name,
    setIsEnvironmentDataLoading,
    setFirstPageOfEachEnvironmentType,
    abortPreviousRequestsAndCreateSignal
  });

  let environmentSelectorContent = null;

  if (isEnvironmentDataLoading) {
    environmentSelectorContent = (
      <Flex justifyContent="center" width="size-5000">
        <ProgressCircle size="M" aria-label="Loading..." isIndeterminate />
      </Flex>
    );
  } else if (edgeConfig) {
    environmentSelectorContent = (
      <EnvironmentsSelector
        name={name}
        edgeConfig={edgeConfig}
        firstPageOfEachEnvironmentType={firstPageOfEachEnvironmentType}
      />
    );
  }

  return (
    <>
      <EdgeConfigurationSelector
        defaultSelectedEdgeConfig={edgeConfig}
        touched={edgeConfigTouched}
        error={edgeConfigError}
        setTouched={setEdgeConfigTouched}
        onSelectionChange={onEdgeConfigSelectionChange}
      />
      {environmentSelectorContent}
    </>
  );
};

EdgeConfigurationSelectInputMethod.propTypes = {
  name: PropTypes.string.isRequired
};

export default EdgeConfigurationSelectInputMethod;
