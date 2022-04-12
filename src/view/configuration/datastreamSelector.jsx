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
import React, { useEffect } from "react";
import { useAsyncList } from "@react-stately/data";
import { Item, Link } from "@adobe/react-spectrum";
import PropTypes from "prop-types";
import { useField } from "formik";
import FormikPicker from "../components/formikReactSpectrum3/formikPicker";
import useReportAsyncError from "../utils/useReportAsyncError";
import fetchConfigs from "./utils/fetchConfigs";
import usePrevious from "../utils/usePrevious";
import Alert from "../components/alert";
import FieldDescriptionAndError from "../components/fieldDescriptionAndError";

const getKey = datastream => datastream && datastream.data.title;
const getLabel = datastream => {
  if (!datastream) {
    return undefined;
  }
  const region = datastream.region
    ? ` (${datastream.region.toUpperCase()})`
    : "";
  return `${datastream.data.title}${region}`;
};

const DatastreamSelector = ({
  name,
  defaultSelectedDatastream,
  initInfo,
  selectedSandbox,
  items,
  label,
  description,
  isRequired,
  environmentType
}) => {
  const [{ value }, , { setValue }] = useField(name);
  const reportAsyncError = useReportAsyncError();
  const previousSelectedSandbox = usePrevious(selectedSandbox);

  const datastreamList = useAsyncList({
    async load({ signal }) {
      let datastreams;
      if (items) {
        datastreams = items;
      } else {
        const {
          company: { orgId },
          tokens: { imsAccess }
        } = initInfo;
        try {
          ({ results: datastreams } = await fetchConfigs({
            orgId,
            imsAccess,
            signal,
            limit: 1000,
            sandbox: selectedSandbox.name
          }));
        } catch (e) {
          if (e.name !== "AbortError") {
            reportAsyncError(e);
          }
          // useAsyncList expects us to throw an error
          // if we can't produce a valid return object.
          throw e;
        }
      }
      return {
        items: datastreams
      };
    },
    getKey,
    initialSelectedKeys: defaultSelectedDatastream
      ? new Set([getKey(defaultSelectedDatastream)])
      : new Set(),
    initialFilterText: defaultSelectedDatastream
      ? getLabel(defaultSelectedDatastream)
      : ""
  });

  useEffect(() => {
    // Reset the datastreams options if the user selects a different sandbox.

    if (previousSelectedSandbox && selectedSandbox) {
      datastreamList.selectedKeys = null;
      if (value) {
        setValue(undefined);
      }
      datastreamList.reload();
    }
  }, [selectedSandbox ? selectedSandbox.name : null]);

  if (!datastreamList.isLoading && !datastreamList.items.length) {
    return (
      <Alert variant="negative" title="No datastreams" width="size-5000">
        No datastreams exist for the selected sandbox. See{" "}
        <Link>
          <a
            href="https://adobe.ly/3dt95he"
            target="_blank"
            rel="noopener noreferrer"
          >
            Configuring a datastream
          </a>
        </Link>{" "}
        for more information.
      </Alert>
    );
  }
  return (
    <FieldDescriptionAndError description="">
      <FormikPicker
        name={name}
        data-test-id={`${environmentType}DatastreamField`}
        label={label}
        placeholder="Select a datastream"
        items={datastreamList.items}
        isLoading={datastreamList.isLoading}
        isDisabled={!datastreamList.isLoading && !datastreamList.items.length}
        width="size-5000"
        description={description}
        isRequired={isRequired}
      >
        {item => {
          // eslint-disable-next-line no-underscore-dangle
          return <Item key={item._system.id}>{getLabel(item)}</Item>;
        }}
      </FormikPicker>
    </FieldDescriptionAndError>
  );
};

DatastreamSelector.propTypes = {
  defaultSelectedDatastream: PropTypes.object,
  label: PropTypes.string,
  initInfo: PropTypes.object,
  name: PropTypes.string,
  selectedSandbox: PropTypes.object,
  description: PropTypes.string,
  items: PropTypes.array,
  isRequired: PropTypes.bool,
  environmentType: PropTypes.string
};

export default DatastreamSelector;
