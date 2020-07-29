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
import fetchSandboxes from "./xdmObject/helpers/fetchSandboxes";
import fetchSchema from "./xdmObject/helpers/fetchSchema";
import fetchSchemasMeta from "./xdmObject/helpers/fetchSchemasMeta";
import "./xdmObject.styl";
import InfoTipLayout from "../components/infoTipLayout";

const STATUS_LOADING = "loading";
const STATUS_LOADED = "loaded";
const STATUS_ERROR = "error";

const XdmObject = ({
  initInfo,
  formikProps,
  sandboxesMeta,
  sandboxOptionsTooltip,
  selectedSandboxMeta,
  setSelectedSandboxMeta,
  schemasMeta,
  schemasMetaStatus,
  setSchemasMetaStatus,
  selectedSchemaMeta,
  setSelectedSchemaMeta,
  schemaStatus
}) => {
  const { values: formState } = formikProps;
  const [selectedNodeId, setSelectedNodeId] = useState();

  const sandboxOptions = sandboxesMeta
    ? sandboxesMeta
        .filter(sandbox => sandbox.state === "active")
        .map(sandbox => {
          return {
            value: sandbox.name,
            label: `${sandbox.type.toUpperCase()}  ${
              sandbox.title
            } (${sandbox.region.toUpperCase()})`
          };
        })
    : [];

  const schemaOptions = schemasMeta.map(schemaMeta => {
    return {
      value: schemaMeta.$id,
      label: schemaMeta.title
    };
  });

  return (
    <div>
      <div className="u-gapTop">
        <InfoTipLayout tip={sandboxOptionsTooltip}>
          <FieldLabel labelFor="sandboxField" label="Sandbox" />
        </InfoTipLayout>
      </div>
      <div>
        {selectedSandboxMeta && (
          <Select
            id="sandboxField"
            data-test-id="sandboxField"
            className="u-widthAuto u-gapBottom u-fieldLong"
            options={sandboxOptions}
            value={selectedSandboxMeta.name}
            onChange={sandboxMetaName => {
              setSelectedNodeId(undefined);
              setSchemasMetaStatus(STATUS_LOADING);
              setSelectedSandboxMeta(
                sandboxesMeta.find(
                  sandboxMeta => sandboxMeta.name === sandboxMetaName
                )
              );
            }}
            disabled={sandboxOptions.length === 0}
            placeholder="PRODUCTION Prod"
          />
        )}
      </div>
      {schemasMetaStatus === STATUS_ERROR && (
        <Alert variant="warning">
          Unable to load schemas for the selected sandbox. Please check the
          settings or choose a different sandbox.
        </Alert>
      )}

      {schemasMetaStatus === STATUS_LOADED && (
        <div>
          <div className="u-gapTop">
            <InfoTipLayout tip="Choose a schema which contains the xdm object you wish to use.">
              <FieldLabel labelFor="schemaField" label="Schema" />
            </InfoTipLayout>
          </div>
          <div>
            <Select
              id="schemaField"
              data-test-id="schemaField"
              className="u-widthAuto u-gapBottom u-fieldLong"
              options={schemaOptions}
              value={selectedSchemaMeta.$id}
              onChange={schemaMetaId => {
                setSelectedNodeId(undefined);
                setSelectedSchemaMeta(
                  schemasMeta.find(
                    schemaMeta => schemaMeta.$id === schemaMetaId
                  )
                );
              }}
            />
          </div>
        </div>
      )}
      {schemasMetaStatus === STATUS_LOADED && schemaStatus === STATUS_ERROR && (
        <Alert variant="error">
          An error occurred while loading the selected schema. Please try again
          or choose a different schema.
        </Alert>
      )}
      {schemasMetaStatus === STATUS_LOADED && schemaStatus === STATUS_LOADED && (
        <div className="u-flex u-gapTop u-minHeight0">
          <div className="XdmObject-treeContainer u-flexShrink0 u-overflowXAuto u-overflowYAuto">
            <InfoTipLayout tip="Here you can use the form to explore and edit the xdm object of the selected schema.">
              <FieldLabel labelFor="xdmTree" label="XDM Object" />
            </InfoTipLayout>
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
                  sandboxMeta={selectedSandboxMeta}
                  schemaMeta={selectedSchemaMeta}
                  previouslySavedSchemaInfo={
                    initInfo.settings && initInfo.settings.schema
                  }
                />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

XdmObject.propTypes = {
  initInfo: PropTypes.object.isRequired,
  formikProps: PropTypes.object.isRequired,
  sandboxesMeta: PropTypes.array,
  sandboxOptionsTooltip: PropTypes.string,
  selectedSandboxMeta: PropTypes.object,
  setSelectedSandboxMeta: PropTypes.func,
  schemasMeta: PropTypes.array,
  schemasMetaStatus: PropTypes.string,
  setSchemasMetaStatus: PropTypes.func,
  selectedSchemaMeta: PropTypes.object,
  setSelectedSchemaMeta: PropTypes.func,
  schemaStatus: PropTypes.string
};

const XdmExtensionView = () => {
  const [sandboxesMeta, setSandboxesMeta] = useState();
  const [sandboxOptionsTooltip, setSandboxOptionsTooltip] = useState();
  const [schemasMeta, setSchemasMeta] = useState();
  const [schemasMetaStatus, setSchemasMetaStatus] = useState();
  const [selectedSandboxMeta, setSelectedSandboxMeta] = useState();
  const [selectedSchemaMeta, setSelectedSchemaMeta] = useState();
  const [schemaStatus, setSchemaStatus] = useState();

  // TODO: break apart this extension view
  return (
    <ExtensionView
      getInitialValues={({ initInfo }) => {
        return fetchSandboxes({
          orgId: initInfo.company.orgId,
          imsAccess: initInfo.tokens.imsAccess
        })
          .then(_sandboxesMeta => {
            let sandboxName = null;
            // if sandboxes are returned from the api call
            if (_sandboxesMeta.sandboxes && _sandboxesMeta.sandboxes.length) {
              setSandboxesMeta(_sandboxesMeta.sandboxes);
              // default to the first item in the list
              let sandboxMeta = _sandboxesMeta.sandboxes[0];
              // if a sandbox exists in settings and is in the list, choose that item
              if (initInfo.settings && initInfo.settings.sandbox) {
                sandboxMeta = _sandboxesMeta.sandboxes.find(
                  _sandboxMeta =>
                    _sandboxMeta.name === initInfo.settings.sandbox.name
                );
              }
              if (sandboxMeta && sandboxMeta.name) {
                sandboxName = sandboxMeta.name;
              }
              setSelectedSandboxMeta(sandboxMeta);
              setSandboxOptionsTooltip(
                "Choose a sandbox which contains the schema you wish to use."
              );
            } else {
              // no sandboxes are available
              const defaultSandbox = { name: "PRODUCTION Prod" };
              setSelectedSandboxMeta(defaultSandbox);
              setSandboxOptionsTooltip(
                "This option is disabled because your account has not been configured for multiple sandboxes."
              );
            }

            return fetchSchemasMeta({
              orgId: initInfo.company.orgId,
              imsAccess: initInfo.tokens.imsAccess,
              sandboxName
            });
          })
          .then(response => {
            setSchemasMeta(response.results);

            if (!response.results.length) {
              setSchemasMetaStatus(STATUS_ERROR || null);
              return {};
            }

            setSchemasMetaStatus(STATUS_LOADED || null);

            // TODO: don't initialize form state if the schema doesn't match
            let schemaMeta = response.results[0];

            // if a schema exists in settings, use it
            if (initInfo.settings && initInfo.settings.schema) {
              schemaMeta = response.results.find(
                _schemaMeta => _schemaMeta.$id === initInfo.settings.schema.id
              );
            }

            setSelectedSchemaMeta(schemaMeta);
            setSchemaStatus(STATUS_LOADING || null);

            const { sandboxName } = response;
            return fetchSchema({
              orgId: initInfo.company.orgId,
              imsAccess: initInfo.tokens.imsAccess,
              schemaMeta,
              sandboxName
            })
              .then(schema => {
                setSchemaStatus(STATUS_LOADED || null);

                return schema;
              })
              .catch(() => {
                setSchemaStatus(STATUS_ERROR || null);
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
          sandbox: {
            name: selectedSandboxMeta ? selectedSandboxMeta.name : null
          },
          schema: {
            id:
              selectedSchemaMeta && selectedSchemaMeta.$id
                ? selectedSchemaMeta.$id
                : null,
            version:
              selectedSchemaMeta && selectedSchemaMeta.version
                ? selectedSchemaMeta.version
                : null
          },
          data: getValueFromFormState({ formStateNode: values }) || {}
        };
      }}
      validate={validate}
      render={options => {
        const onSandboxesMetaSelected = sandboxMeta => {
          setSelectedSandboxMeta(sandboxMeta);
          setSchemasMetaStatus(STATUS_LOADING || null);

          fetchSchemasMeta({
            orgId: options.initInfo.company.orgId,
            imsAccess: options.initInfo.tokens.imsAccess,
            sandboxName:
              sandboxMeta && sandboxMeta.name ? sandboxMeta.name : null
          })
            .then(response => {
              if (!response.results.length) {
                throw new Error("No schemas found");
              }
              setSchemasMetaStatus(STATUS_LOADED || null);
              setSchemasMeta(response.results);
              setSelectedSchemaMeta(response.results[0]);
            })
            .catch(() => {
              setSchemasMetaStatus(STATUS_ERROR || null);
            });
        };

        // TODO: address a suspected race condition where a previous selected item may return before
        //  a secondary selected item
        const onSchemaMetaSelected = schemaMeta => {
          setSelectedSchemaMeta(schemaMeta);
          setSchemaStatus(STATUS_LOADING || null);
          fetchSchema({
            orgId: options.initInfo.company.orgId,
            imsAccess: options.initInfo.tokens.imsAccess,
            schemaMeta,
            sandboxName: selectedSandboxMeta.name
              ? selectedSandboxMeta.name
              : null
          })
            .then(schema => {
              setSchemaStatus(STATUS_LOADED || null);
              const initialValues = getInitialFormState({
                value: {},
                schema
              });
              options.resetForm(initialValues);
            })
            .catch(() => {
              setSchemaStatus(STATUS_ERROR || null);
            });
        };

        return (
          <XdmObject
            {...options}
            sandboxesMeta={sandboxesMeta}
            sandboxOptionsTooltip={sandboxOptionsTooltip}
            selectedSandboxMeta={selectedSandboxMeta}
            setSelectedSandboxMeta={onSandboxesMetaSelected}
            schemasMeta={schemasMeta}
            schemasMetaStatus={schemasMetaStatus}
            setSchemasMetaStatus={setSchemasMetaStatus}
            selectedSchemaMeta={selectedSchemaMeta}
            setSelectedSchemaMeta={onSchemaMetaSelected}
            schemaStatus={schemaStatus}
            setSchemaStatus={setSchemaStatus}
          />
        );
      }}
    />
  );
};

render(XdmExtensionView);
