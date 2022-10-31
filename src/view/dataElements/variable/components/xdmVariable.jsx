/*
Copyright 2022 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
*/

import React from "react";
import { object, string } from "yup";
import { Item } from "@adobe/react-spectrum";
import { useField } from "formik";
import PropTypes from "prop-types";
import UserReportableError from "../../../errors/userReportableError";
import DEFAULT_SANDBOX_NAME from "../../xdmObject/constants/defaultSandboxName";
import fetchSandboxes from "../../xdmObject/helpers/fetchSandboxes";
import fetchSchema from "../../xdmObject/helpers/fetchSchema";
import fetchSchemasMeta from "../../xdmObject/helpers/fetchSchemasMeta";
import FormikPicker from "../../../components/formikReactSpectrum3/formikPicker";
import FormikPagedComboBox from "../../../components/formikReactSpectrum3/formikPagedComboBox";
import useReportAsyncError from "../../../utils/useReportAsyncError";

export const bridge = {
  async getInitialValues({ initInfo, context }) {
    const { sandbox = null, schemaId = null, schemaVersion = null } =
      initInfo.settings || {};

    const {
      company: { orgId },
      tokens: { imsAccess }
    } = initInfo;

    const sandboxesResponse = await fetchSandboxes({ orgId, imsAccess });
    context.sandboxes = sandboxesResponse.results;

    const { sandboxes } = context;
    if (!(sandboxes && sandboxes.length)) {
      throw new UserReportableError("You do not have access to any sandboxes.");
    }

    if (sandbox && !sandboxes.find(s => s.name === sandbox)) {
      throw new UserReportableError(
        "Could not find sandbox selected previously"
      );
    }
    const selectedSandbox = sandbox || DEFAULT_SANDBOX_NAME;

    if (!schemaId || !schemaVersion || !sandbox) {
      const schemasResponse = await fetchSchemasMeta({
        orgId,
        imsAccess,
        sandboxName: selectedSandbox
      });
      context.schemasFirstPage = schemasResponse.results;
      context.schemasFirstPageCursor = schemasResponse.nextPage;
    } else {
      context.schema = await fetchSchema({
        orgId,
        imsAccess,
        schemaId,
        schemaVersion,
        selectedSandbox
      });
      context.schemasDefaultSelectedItem = {
        $id: context.schema.$id,
        title: context.schema.title,
        version: context.schema.version
      };
    }

    return {
      sandbox: selectedSandbox,
      schema: schemaId ? `${schemaId}_${schemaVersion}` : ""
    };
  },
  getSettings({ values }) {
    const { sandbox, schema: schemaAndVersion } = values;

    const [schemaId, schemaVersion] = schemaAndVersion.split("_");

    return {
      sandbox,
      schemaId,
      schemaVersion
    };
  },
  formikStateValidationSchema: object().shape({
    schema: string().required("Please select a schema")
  })
};

const getKey = item => item && `${item.$id}_${item.version}`;
const getLabel = item => item?.title;

const XdmVariable = ({
  context: { sandboxes, schemasDefaultSelectedItem },
  initInfo
}) => {
  const {
    company: { orgId },
    tokens: { imsAccess }
  } = initInfo;
  const reportAsyncError = useReportAsyncError();

  const [{ value: sandbox }] = useField("sandbox");

  const loadItems = async ({ filterText, cursor, signal }) => {
    let results;
    let nextPage;
    try {
      ({ results, nextPage } = await fetchSchemasMeta({
        orgId,
        imsAccess,
        sandboxName: sandbox,
        search: filterText,
        start: cursor,
        signal
      }));
    } catch (e) {
      if (e.name !== "AbortError") {
        reportAsyncError(e);
      }
      // usePagedComboBox expects us to throw an error
      // if we can't produce a valid return object.
      throw e;
    }
    return {
      items: results,
      cursor: nextPage
    };
  };

  return (
    <>
      <FormikPicker
        data-test-id="sandboxField"
        name="sandbox"
        label="Sandbox"
        items={sandboxes}
        width="size-5000"
        description="Choose a sandbox containing the schema you wish to use."
      >
        {item => {
          const region = item.region ? ` (${item.region.toUpperCase()})` : "";
          const label = `${item.type.toUpperCase()} ${item.title}${region}`;
          return <Item key={item.name}>{label}</Item>;
        }}
      </FormikPicker>
      <FormikPagedComboBox
        data-test-id="schemaField"
        name="schema"
        label="Schema"
        width="size-5000"
        description="Choose an XDM schema for this variable."
        loadItems={loadItems}
        getKey={getKey}
        getLabel={getLabel}
        dependencies={[sandbox]}
        defaultSelectedItem={schemasDefaultSelectedItem}
      />
    </>
  );
};

XdmVariable.propTypes = {
  initInfo: PropTypes.object,
  context: PropTypes.object
};

export default XdmVariable;
