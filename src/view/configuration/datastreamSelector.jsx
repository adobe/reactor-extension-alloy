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
import {
  Flex,
  Item,
  Link,
  View,
  Picker,
  ActionButton,
  TooltipTrigger,
  Tooltip
} from "@adobe/react-spectrum";
import PropTypes from "prop-types";
import { useField } from "formik";
import Copy from "@spectrum-icons/workflow/Copy";
import Delete from "@spectrum-icons/workflow/Delete";
import copyToClipboard from "clipboard-copy";
import fetchConfigs from "./utils/fetchConfigs";
import usePrevious from "../utils/usePrevious";
import Alert from "../components/alert";
import { PRODUCTION } from "./constants/environmentType";
import FormikTextField from "../components/formikReactSpectrum3/formikTextField";

// eslint-disable-next-line no-underscore-dangle
const getKey = datastream => datastream && datastream._system.id;
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
  defaultSandboxOnly,
  environmentType,
  description
}) => {
  const [{ value }, { touched, error }, { setValue, setTouched }] = useField(
    name
  );
  const previousSelectedSandbox = usePrevious(selectedSandbox);

  const datastreamList = useAsyncList({
    async load({ signal }) {
      if (items) {
        return { items };
      }

      const {
        company: { orgId },
        tokens: { imsAccess }
      } = initInfo;

      let datastreams;
      try {
        ({ results: datastreams } = await fetchConfigs({
          orgId,
          imsAccess,
          signal,
          limit: 1000,
          sandbox: selectedSandbox.name
        }));
      } catch (e) {
        throw e;
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
    // if the selected sandbox was changed we want to reload the datastreams dropdown and
    // reset the formik value, otherwise in case there the user haven't selected another datastream
    // formik will keep the old datastream value( when the extension was previously set up)
    if (previousSelectedSandbox && selectedSandbox) {
      datastreamList.selectedKeys = null;
      if (value) {
        setValue(undefined);
      }
      datastreamList.reload();
    }
  }, [selectedSandbox ? selectedSandbox.name : null]);

  const datastreamProps = {
    isRequired: defaultSandboxOnly && environmentType === PRODUCTION,
    label: defaultSandboxOnly ? `${environmentType} datastream` : " ",
    "aria-label": `${environmentType} datastream`,
    "data-test-id": `${environmentType}DatastreamField`,
    UNSAFE_className: "CapitalizedLabel"
  };
  const errorLoadingDatastreamsDescription = (
    <>
      {`You do not have enough permissions to fetch the ${
        selectedSandbox.title
      } sandbox configurations. See the documentation for `}
      <Link>
        <a
          href="https://experienceleague.adobe.com/docs/experience-platform/collection/permissions.html"
          target="_blank"
          rel="noopener noreferrer"
        >
          data collection permission management
        </a>
      </Link>{" "}
      for more information.
    </>
  );

  if (datastreamList.loadingState === "error" && !datastreamList.items.length) {
    const errorMessage = datastreamList?.error?.originatingError?.message;

    if (value) {
      return (
        <Flex direction="row" gap="size-100">
          <View>
            <FormikTextField
              data-test-id={`datastreamDisabledField${environmentType}`}
              label="Datastream ID"
              name={name}
              description={errorLoadingDatastreamsDescription}
              width="size-5000"
              isDisabled="true"
            />
          </View>
          <Flex direction="row" gap="size-100" marginTop="size-250">
            <TooltipTrigger>
              <ActionButton
                isQuiet
                isDisabled={!value}
                onPress={() => {
                  copyToClipboard(value);
                }}
              >
                <Copy />
              </ActionButton>
              <Tooltip> Copy datastream ID to clipboard. </Tooltip>
            </TooltipTrigger>
          </Flex>
        </Flex>
      );
    }
    return (
      <Alert
        data-test-id={`${environmentType}ErrorFetchingDatastreamsAlert`}
        variant={environmentType === PRODUCTION ? "negative" : "informative"}
        title={`Error fetching datastreams for ${selectedSandbox.name} sandbox`}
        width="size-5000"
        marginTop="size-100"
      >
        {errorMessage}
      </Alert>
    );
  }

  if (!datastreamList.isLoading && !datastreamList.items.length) {
    return (
      <Alert
        variant={environmentType === PRODUCTION ? "negative" : "informative"}
        title="No datastreams"
        width="size-5000"
        marginTop="size-100"
      >
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
    <Flex direction="row" gap="size-100">
      <View>
        <Picker
          {...datastreamProps}
          selectedKey={value}
          onSelectionChange={setValue}
          onBlur={() => {
            setTouched(true);
          }}
          validationState={touched && error ? "invalid" : undefined}
          width="size-5000"
          placeholder="Select a datastream"
          isLoading={datastreamList.isLoading}
          isDisabled={!datastreamList.isLoading && !datastreamList.items.length}
          items={datastreamList.items}
          description={touched && error ? "" : description}
          errorMessage={touched && error ? error : undefined}
        >
          {item => {
            return <Item key={getKey(item)}>{getLabel(item)}</Item>;
          }}
        </Picker>
      </View>

      <Flex
        direction="row"
        marginTop={defaultSandboxOnly ? "size-250" : "size-150"}
      >
        <TooltipTrigger>
          <ActionButton
            isQuiet
            isDisabled={!value}
            onPress={() => {
              copyToClipboard(value);
            }}
            aria-label="Copy datastream ID to clipboard"
          >
            <Copy />
          </ActionButton>
          <Tooltip> Copy datastream ID to clipboard. </Tooltip>
        </TooltipTrigger>
        <TooltipTrigger>
          <ActionButton
            isQuiet
            onPress={() => {
              setValue("");
            }}
            isDisabled={!value}
            aria-label="Reset datastream ID"
          >
            <Delete />
          </ActionButton>
          <Tooltip> Reset datastream ID. </Tooltip>
        </TooltipTrigger>
      </Flex>
    </Flex>
  );
};

DatastreamSelector.propTypes = {
  defaultSelectedDatastream: PropTypes.object,
  initInfo: PropTypes.object,
  name: PropTypes.string,
  selectedSandbox: PropTypes.object,
  defaultSandboxOnly: PropTypes.bool,
  environmentType: PropTypes.string,
  items: PropTypes.array,
  description: PropTypes.string
};

export default DatastreamSelector;
