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
import NoSelectedNodeView from "./xdmObject/components/noSelectedNodeView";
import ExtensionView from "../components/extensionView";
import XdmTree from "./xdmObject/components/xdmTree";
import getInitialFormState from "./xdmObject/helpers/getInitialFormState";
import getValueFromFormState from "./xdmObject/helpers/getValueFromFormState";
import NodeEdit from "./xdmObject/components/nodeEdit";
import validate from "./xdmObject/helpers/validate";
import render from "../render";
import fetchSchema from "./xdmObject/helpers/fetchSchema";
import "./xdmObject.styl";

const getInitialValues = ({ settings, schema }) => {
  const value = (settings && settings.data) || {};
  return getInitialFormState({ schema, value });
};

const XdmObject = ({ initInfo, formikProps, schema, resetForm }) => {
  const { values: formState } = formikProps;
  const [selectedNodeId, setSelectedNodeId] = useState();

  if (!schema) {
    return (
      <div className="u-flex u-fullHeight u-alignItemsCenter u-justifyContentCenter">
        <Alert variant="error" header="No Schema Found">
          No configured XDM schema was found. Please ensure you have created an
          edge configuration with a production environment.
        </Alert>
      </div>
    );
  }

  return (
    <div className="u-flex u-fullHeight">
      {
        // Select Here? On change, call resetForm()
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
  const [schema, setSchema] = useState();
  const [instancesInfo, setInstancesInfo] = useState();

  return (
    <ExtensionView
      getInitialValues={({ initInfo }) => {
        // TODO: If we've already loaded the schemas, then don't load the
        // schemas again. Just call getInitialValues with the newly
        // selected schema and return the result.
        return fetchSchema({
          configId: initInfo.extensionSettings.instances[0].configId,
          orgId: initInfo.company.orgId,
          imsAccess: initInfo.tokens.imsAccess
        }).then(fetchedSchema => {
          setSchema(fetchedSchema);

          if (!fetchedSchema) {
            return {};
          }

          const initialValues = getInitialValues({
            settings: initInfo.settings,
            schema: fetchedSchema
          });

          return initialValues;
        });
      }}
      getSettings={({ values }) => {
        return {
          schema: {
            id: schema.$id,
            version: schema.version
          },
          data: getValueFromFormState({ formStateNode: values }) || {}
        };
      }}
      validate={validate}
      render={props => <XdmObject {...props} schema={schema} />}
    />
  );
};

render(XdmExtensionView);
