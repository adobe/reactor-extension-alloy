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
import fetchInstancesBySchemaMap from "./xdmObject/helpers/fetchInstancesBySchemaMap";
import "./xdmObject.styl";
import getMajorVersionFromSchemaVersion from "./xdmObject/helpers/getMajorVersionFromSchemaVersion";
import findKeyInMap from "../utils/findKeyInMap";
import FieldLabel from "@react/react-spectrum/FieldLabel";

const XdmObject = ({
  initInfo,
  formikProps,
  instancesBySchemaMap,
  selectedSchema,
  setSelectedSchema
}) => {
  const { values: formState } = formikProps;
  const [selectedNodeId, setSelectedNodeId] = useState();

  if (!instancesBySchemaMap.size) {
    return (
      <div className="u-flex u-fullHeight u-alignItemsCenter u-justifyContentCenter">
        <Alert variant="error" header="No Schema Found">
          No configured XDM schema was found. Please ensure you have created an
          edge configuration with a production environment.
        </Alert>
      </div>
    );
  }

  // TODO: Use this to only show the version number if there's more than one version
  // of the same schema.
  // const numMajorVersionsBySchemaId = {};

  // TODO: If there's only one instance, don't show the select.

  const schemaOptions = [];
  instancesBySchemaMap.forEach((instances, schema) => {
    const schemaTitle = schema.title;
    const schemaMajorVersion = getMajorVersionFromSchemaVersion(schema.version);
    const instanceNamesCommaDelimited = instances
      .map(instance => instance.name)
      .join(", ");
    const label = `${schemaTitle} (v${schemaMajorVersion}) (${instanceNamesCommaDelimited})`;

    const option = {
      value: schema,
      label
    };

    schemaOptions.push(option);
  });

  return (
    <div className="u-flex u-flexColumn u-fullHeight">
      <FieldLabel
        className="u-flex"
        labelFor="schemaField"
        label="Schema"
        position="left"
      >
        <Select
          id="schemaField"
          className="u-widthAuto u-gapBottom"
          options={schemaOptions}
          value={selectedSchema}
          onChange={schema => {
            setSelectedNodeId(undefined);
            setSelectedSchema(schema);
          }}
        />
      </FieldLabel>
      <div className="u-flex u-minHeight0">
        <div className="XdmObject-treeContainer u-flexShrink0 u-overflowXAuto u-overflowYAuto">
          <XdmTree
            formikProps={formikProps}
            selectedNodeId={selectedNodeId}
            onSelect={setSelectedNodeId}
          />
        </div>
        <div className="u-gapLeft2x">
          <div>
            {selectedNodeId ? (
              <NodeEdit
                formState={formState}
                onNodeSelect={setSelectedNodeId}
                selectedNodeId={selectedNodeId}
              />
            ) : (
              <NoSelectedNodeView
                schema={selectedSchema}
                previouslySavedSchemaInfo={
                  initInfo.settings && initInfo.settings.schema
                }
              />
            )}
          </div>
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
  const [instancesBySchemaMap, setInstancesBySchemaMap] = useState();
  const [selectedSchema, setSelectedSchema] = useState();

  return (
    <ExtensionView
      getInitialValues={({ initInfo }) => {
        // TODO: If we've already loaded the schemas, then don't load the
        // schemas again. Just call getInitialValues with the newly
        // selected schema and return the result.
        return fetchInstancesBySchemaMap({
          extensionSettings: initInfo.extensionSettings,
          orgId: initInfo.company.orgId,
          imsAccess: initInfo.tokens.imsAccess
        }).then(_instancesBySchemaMap => {
          setInstancesBySchemaMap(_instancesBySchemaMap);

          if (!_instancesBySchemaMap.size) {
            return {};
          }

          const { settings } = initInfo;

          let matchingSchema;

          // TODO: Break out into a different function?
          if (settings && settings.schema) {
            const { id, version } = settings.schema;
            const majorVersion = getMajorVersionFromSchemaVersion(version);

            matchingSchema = findKeyInMap(_instancesBySchemaMap, schema => {
              const instanceSchemaMajorVersion = getMajorVersionFromSchemaVersion(
                schema.version
              );
              return (
                id === schema.id && majorVersion === instanceSchemaMajorVersion
              );
            });
          }

          if (!matchingSchema) {
            // Use the first schema.
            matchingSchema = _instancesBySchemaMap.keys().next().value;
          }

          setSelectedSchema(matchingSchema);

          const initialValues = getInitialFormState({
            data: (settings && settings.data) || {},
            schema: matchingSchema
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
          const initialValues = getInitialFormState({
            data: {},
            schema
          });
          props.resetForm(initialValues);
        };

        return (
          <XdmObject
            {...props}
            // schema={schema}
            instancesBySchemaMap={instancesBySchemaMap}
            selectedSchema={selectedSchema}
            setSelectedSchema={onSchemaSelected}
          />
        );
      }}
    />
  );
};

render(XdmExtensionView);
