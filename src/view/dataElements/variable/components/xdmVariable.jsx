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
import { object } from "yup";
import { Item } from "@adobe/react-spectrum";
import { useField } from "formik";
import PropTypes from "prop-types";
import UserReportableError from "../../../errors/userReportableError";
import DEFAULT_SANDBOX_NAME from "../../xdmObject/constants/defaultSandboxName";
import fetchSandboxes from "../../../utils/fetchSandboxes";
import fetchSchema from "../../xdmObject/helpers/fetchSchema";
import fetchSchemasMeta from "../../xdmObject/helpers/fetchSchemasMeta";
import FormikPicker from "../../../components/formikReactSpectrum3/formikPicker";
import FormikPagedComboBox from "../../../components/formikReactSpectrum3/formikPagedComboBox";
import useReportAsyncError from "../../../utils/useReportAsyncError";

const initializeSandboxes = async ({
  context,
  settings: { sandbox },
  orgId,
  imsAccess
}) => {
  const { results: sandboxes } = await fetchSandboxes({ orgId, imsAccess });

  if (!(sandboxes && sandboxes.length)) {
    throw new UserReportableError("You do not have access to any sandboxes.");
  }

  if (sandbox && !sandboxes.find(s => s.name === sandbox)) {
    context.warning = `Could not find the sandbox selected previously. Either you don't have access or the sandbox was deleted. Push cancel to leave this data element unchanged.`;
  }
  context.sandboxes = sandboxes;
};

const initializeSelectedSchema = async ({
  initialValues,
  settings: { sandbox, schemaId, schemaVersion },
  orgId,
  imsAccess
}) => {
  if (schemaId && schemaVersion && sandbox) {
    const { $id, title, version } = await fetchSchema({
      orgId,
      imsAccess,
      schemaId,
      schemaVersion,
      sandboxName: sandbox
    });
    initialValues.schema = { $id, title, version };
  } else {
    initialValues.schema = null;
  }
};

const initializeSchemas = async ({
  initialValues: { sandbox },
  context,
  orgId,
  imsAccess
}) => {
  const {
    results: schemasFirstPage,
    nextPage: schemasFirstPageCursor
  } = await fetchSchemasMeta({
    orgId,
    imsAccess,
    sandboxName: sandbox
  });

  context.schemasFirstPage = schemasFirstPage;
  context.schemasFirstPageCursor = schemasFirstPageCursor;
};

export const bridge = {
  async getInitialValues({ initInfo, context }) {
    const {
      company: { orgId },
      tokens: { imsAccess }
    } = initInfo;
    const settings = initInfo.settings || {};

    const initialValues = {
      sandbox: settings.sandbox || DEFAULT_SANDBOX_NAME
    };

    const args = {
      initialValues,
      context,
      settings,
      orgId,
      imsAccess
    };

    await Promise.all([
      initializeSandboxes(args),
      initializeSelectedSchema(args),
      initializeSchemas(args)
    ]);

    return initialValues;
  },
  getSettings({ values }) {
    const { sandbox, schema } = values;

    return {
      sandbox,
      schemaId: schema?.$id,
      schemaVersion: schema?.version
    };
  },
  formikStateValidationSchema: object().shape({
    schema: object().required("Please select a schema")
  })
};

const getKey = item => item && `${item.$id}_${item.version}`;
const getLabel = item => item?.title;

const XdmVariable = ({
  context: { sandboxes, schemasFirstPage, schemasFirstPageCursor, warning },
  initInfo
}) => {
  const {
    company: { orgId },
    tokens: { imsAccess }
  } = initInfo;
  const reportAsyncError = useReportAsyncError();

  const [{ value: sandbox }, { touched: sandboxTouched }] = useField("sandbox");

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
      {!sandboxTouched && warning && <h1>Warning: {warning}</h1>}
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
        firstPage={schemasFirstPage}
        firstPageCursor={schemasFirstPageCursor}
      />
    </>
  );
};

XdmVariable.propTypes = {
  initInfo: PropTypes.object,
  context: PropTypes.object
};

export default XdmVariable;
