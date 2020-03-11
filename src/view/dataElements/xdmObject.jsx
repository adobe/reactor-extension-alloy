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
import Breadcrumbs from "@react/react-spectrum/Breadcrumbs";
import Alert from "@react/react-spectrum/Alert";
import NoSelectedNodeView from "./xdmObject/components/noSelectedNodeView";
import ExtensionView from "../components/extensionView";
import XdmTree from "./xdmObject/components/xdmTree";
import getInitialFormState from "./xdmObject/helpers/getInitialFormState";
import getValueFromFormState from "./xdmObject/helpers/getValueFromFormState";
import getNodeEditData from "./xdmObject/helpers/getNodeEditData";
import XdmForm from "./xdmObject/components/xdmForm";
import validate from "./xdmObject/helpers/validate";
import render from "../render";
import fetchSchema from "./xdmObject/helpers/fetchSchema";
import "./xdmObject.styl";

const getInitialValues = ({ settings, schema }) => {
  const value = (settings && settings.data) || {};
  return getInitialFormState({ schema, value });
};

const XdmObject = ({ initInfo, formikProps, schema }) => {
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

  const { formStateNode, fieldName, breadcrumb } = selectedNodeId
    ? getNodeEditData({
        formState,
        nodeId: selectedNodeId
      })
    : {};

  return (
    <div className="u-flex u-fullHeight">
      <div className="XdmObject-treeContainer u-flexShrink0 u-fullHeight u-overflowXAuto u-overflowYAuto">
        <XdmTree
          formikProps={formikProps}
          selectedNodeId={selectedNodeId}
          onSelect={setSelectedNodeId}
        />
      </div>
      <div className="u-gapLeft2x">
        {breadcrumb && (
          <Breadcrumbs
            className="u-gapLeftNegative"
            items={breadcrumb}
            onBreadcrumbClick={item => setSelectedNodeId(item.nodeId)}
          />
        )}
        <div className="u-gapTop2x">
          {formStateNode ? (
            <XdmForm
              formStateNode={formStateNode}
              fieldName={fieldName}
              onSelect={setSelectedNodeId}
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

  return (
    <ExtensionView
      getInitialValues={({ initInfo }) => {
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
