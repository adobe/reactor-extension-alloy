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
import FieldLabel from "@react/react-spectrum/FieldLabel";
import NoSelectedNodeView from "./xdmObject/components/noSelectedNodeView";
import ExtensionView from "../components/extensionView";
import XdmTree from "./xdmObject/components/xdmTree";
import getInitialFormState from "./xdmObject/helpers/getInitialFormState";
import getValueFromFormState from "./xdmObject/helpers/getValueFromFormState";
import NodeEdit from "./xdmObject/components/nodeEdit";
import validate from "./xdmObject/helpers/validate";
import render from "../render";
import fetchSchema from "./xdmObject/helpers/fetchSchema";
import fetchSchemasMeta from "./xdmObject/helpers/fetchSchemasMeta";
import "./xdmObject.styl";

const XdmObject = ({
  initInfo,
  formikProps,
  schemasMeta,
  selectedSchemaMeta,
  setSelectedSchemaMeta
}) => {
  const { values: formState } = formikProps;
  const [selectedNodeId, setSelectedNodeId] = useState();

  if (!schemasMeta.length) {
    return (
      <div className="u-flex u-fullHeight u-alignItemsCenter u-justifyContentCenter">
        <Alert variant="error" header="No Schema Found">
          No XDM schema was found. Please ensure you have created an XDM schema
          within Adobe Experience Platform.
        </Alert>
      </div>
    );
  }

  const schemaOptions = schemasMeta.map(schemaMeta => {
    return {
      value: schemaMeta.$id,
      label: schemaMeta.title
    };
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
          data-test-id="schemaField"
          className="u-widthAuto u-gapBottom"
          options={schemaOptions}
          value={selectedSchemaMeta.$id}
          onChange={schemaMetaId => {
            setSelectedNodeId(undefined);
            setSelectedSchemaMeta(
              schemasMeta.find(schemaMeta => schemaMeta.$id === schemaMetaId)
            );
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
                schemaMeta={selectedSchemaMeta}
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
  schemasMeta: PropTypes.array,
  selectedSchemaMeta: PropTypes.object,
  setSelectedSchemaMeta: PropTypes.func
};

const XdmExtensionView = () => {
  const [schemasMeta, setSchemasMeta] = useState();
  const [selectedSchemaMeta, setSelectedSchemaMeta] = useState();

  // TODO: break apart this extension view
  return (
    <ExtensionView
      getInitialValues={({ initInfo }) => {
        return fetchSchemasMeta({
          orgId: initInfo.company.orgId,
          imsAccess: initInfo.tokens.imsAccess
        })
          .then(_schemasMeta => {
            setSchemasMeta(_schemasMeta);

            if (!_schemasMeta.length) {
              return {};
            }

            // TODO: don't initialize form state if the schema doesn't match
            let schemaMeta = _schemasMeta[0];

            if (initInfo.settings && initInfo.settings.schema) {
              schemaMeta = _schemasMeta.find(
                _schemaMeta => _schemaMeta.$id === initInfo.settings.schema.id
              );
            }

            setSelectedSchemaMeta(schemaMeta);

            return fetchSchema({
              orgId: initInfo.company.orgId,
              imsAccess: initInfo.tokens.imsAccess,
              schemaMeta
            });
          })
          .then(schema => {
            const initialValues = getInitialFormState({
              value: (initInfo.settings && initInfo.settings.data) || {},
              schema
            });

            return initialValues;
          });
      }}
      getSettings={({ values }) => {
        return {
          schema: {
            id: selectedSchemaMeta.$id,
            version: selectedSchemaMeta.version
          },
          data: getValueFromFormState({ formStateNode: values }) || {}
        };
      }}
      validate={validate}
      render={options => {
        // TODO: address a suspected race condition where a previous selected item may return before
        //  a secondary selected item
        const onSchemaMetaSelected = schemaMeta => {
          setSelectedSchemaMeta(schemaMeta);
          fetchSchema({
            orgId: options.initInfo.company.orgId,
            imsAccess: options.initInfo.tokens.imsAccess,
            schemaMeta
          }).then(schema => {
            const initialValues = getInitialFormState({
              value: {},
              schema
            });
            options.resetForm(initialValues);
          });
        };

        return (
          <XdmObject
            {...options}
            schemasMeta={schemasMeta}
            selectedSchemaMeta={selectedSchemaMeta}
            setSelectedSchemaMeta={onSchemaMetaSelected}
          />
        );
      }}
    />
  );
};

render(XdmExtensionView);
