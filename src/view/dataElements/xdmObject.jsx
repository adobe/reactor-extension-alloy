/*
Copyright 2019 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
*/

import "regenerator-runtime"; // needed for some of react-spectrum
import React, { useState } from "react";
import PropTypes from "prop-types";
import Alert from "@react/react-spectrum/Alert";
import Select from "@react/react-spectrum/Select";
import NoSelectedNodeView from "./xdmObject/components/noSelectedNodeView";
import ExtensionView from "../components/extensionView";
import XdmTree from "./xdmObject/components/xdmTree";
import getInitialFormState from "./xdmObject/helpers/getInitialFormState";
import getValueFromFormState from "./xdmObject/helpers/getValueFromFormState";
import NodeEdit from "./xdmObject/components/nodeEdit";
import validate from "./xdmObject/helpers/validate";
import render from "../render";
import fetchInstancesMeta from "./xdmObject/helpers/fetchInstancesMeta";
import "./xdmObject.styl";
import getMajorVersionFromSchemaVersion from "./xdmObject/helpers/getMajorVersionFromSchemaVersion";

const getInitialValues = ({ data = {}, schema }) => {
  return getInitialFormState({ schema, value: data });
};

const XdmObject = ({
  initInfo,
  formikProps,
  instancesMeta,
  selectedSchema,
  setSelectedSchema
}) => {
  const { values: formState } = formikProps;
  const [selectedNodeId, setSelectedNodeId] = useState();

  if (!instancesMeta.length) {
    return (
      <div className="u-flex u-fullHeight u-alignItemsCenter u-justifyContentCenter">
        <Alert variant="error" header="No Schema Found">
          No configured XDM schema was found. Please ensure you have created an
          edge configuration with a production environment.
        </Alert>
      </div>
    );
  }

  const schemaOptions = instancesMeta.reduce(
    (schemaOptionsMemo, instanceMeta) => {
      const matchingOption = schemaOptionsMemo.find(schemaOption => {
        return schemaOption.value.id === instanceMeta.schema.id;
      });

      if (!matchingOption) {
      }
    },
    []
  );

  return (
    <div className="u-flex u-fullHeight">
      <Select
        options={schemaOptions}
        value={selectedSchema}
        onChange={option => setSelectedSchema(option.value)}
      />
      {
        // Select Here? On change, call resetForm()
        // Use a react-spectrum Select without Formik
        // Use instancesMeta to show all the options.
        // Let selectedInstanceMeta to determine which option is selected.
        // Call setSelectedInstanceMeta when a new option is selected.
      }
      <div className="XdmObject-treeContainer u-flexShrink0 u-fullHeight u-overflowXAuto u-overflowYAuto">
        <XdmTree
          formikProps={formikProps}
          selectedNodeId={selectedNodeId}
          onSelect={setSelectedNodeId}
        />
      </div>
      <div className="u-gapLeft2x">
        <div className="u-gapTop2x">
          {selectedNodeId ? (
            <NodeEdit
              formState={formState}
              onNodeSelect={setSelectedNodeId}
              selectedNodeId={selectedNodeId}
            />
          ) : (
            <NoSelectedNodeView
              schema={schema}
              previouslySavedSchemaInfo={
                initInfo.settings && initInfo.settings.schema
              }
            />
          )}
        </div>
      </div>
    </div>
  );
};

XdmObject.propTypes = {
  initInfo: PropTypes.object.isRequired,
  formikProps: PropTypes.object.isRequired,
  schema: PropTypes.object
};

const XdmExtensionView = () => {
  const [instancesMeta, setInstancesMeta] = useState();
  const [selectedSchema, setSelectedSchema] = useState();

  return (
    <ExtensionView
      getInitialValues={({ initInfo }) => {
        // TODO: If we've already loaded the schemas, then don't load the
        // schemas again. Just call getInitialValues with the newly
        // selected schema and return the result.
        return fetchInstancesMeta({
          extensionSettings: initInfo.extensionSettings,
          orgId: initInfo.company.orgId,
          imsAccess: initInfo.tokens.imsAccess
        }).then(fetchedInstancesMeta => {
          setInstancesMeta(fetchedInstancesMeta);

          if (!fetchedInstancesMeta.length) {
            return {};
          }

          const { settings } = initInfo;

          let matchingInstanceMeta;

          if (settings && settings.schema) {
            const { id, version } = settings.schema;
            const majorVersion = getMajorVersionFromSchemaVersion(version);

            matchingInstanceMeta = fetchedInstancesMeta.find(instanceMeta => {
              const instanceSchemaMajorVersion = getMajorVersionFromSchemaVersion(
                instanceMeta.schema.version
              );
              return (
                id === instanceMeta.schema.id &&
                majorVersion === instanceSchemaMajorVersion
              );
            });
          }

          if (!matchingInstanceMeta) {
            [matchingInstanceMeta] = fetchedInstancesMeta;
          }

          setSelectedSchema(matchingInstanceMeta);

          const initialValues = getInitialValues({
            data: settings && settings.data,
            schema: matchingInstanceMeta.schema
          });

          return initialValues;
        });
      }}
      getSettings={({ values }) => {
        return {
          schema: {
            id: selectedSchema.$id,
            version: selectedSchema.version
          },
          data: getValueFromFormState({ formStateNode: values }) || {}
        };
      }}
      validate={validate}
      render={props => {
        const onSchemaSelected = schema => {
          setSelectedSchema(schema);
          // reset form using props.resetForm()
        };

        return (
          <XdmObject
            {...props}
            // schema={schema}
            instancesMeta={instancesMeta}
            selectedSchema={selectedSchema}
            setSelectedSchema={onSchemaSelected}
          />
        );
      }}
    />
  );
};

render(XdmExtensionView);
