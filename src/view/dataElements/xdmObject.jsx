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
import ComboBox from "@react/react-spectrum/ComboBox";
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
  selectedSandboxMeta,
  setSelectedSandboxMeta,
  schemasMeta,
  schemasMetaSearch,
  schemasMetaStatus,
  setSchemasMetaSearch,
  setSchemasMetaStatus,
  selectedSchemaMeta,
  setSelectedSchemaMeta,
  schemaStatus
}) => {
  const { values: formState } = formikProps;
  const [selectedNodeId, setSelectedNodeId] = useState();

  const sandboxOptions = sandboxesMeta.sandboxes
    .filter(sandbox => sandbox.state === "active")
    .map(sandbox => {
      return {
        value: sandbox.name,
        label: `${sandbox.type.toUpperCase()}  ${sandbox.title}${
          sandbox.region ? ` (${sandbox.region.toUpperCase()})` : ""
        }`
      };
    });

  const schemaOptions = schemasMeta.map(schemaMeta => {
    return {
      label: schemaMeta.title,
      value: schemaMeta.$id
    };
  });

  return (
    <div>
      <div className="u-gapTop">
        <InfoTipLayout
          tip={
            sandboxesMeta.disabled && sandboxesMeta.disabled === true
              ? "This option is disabled because your account has not been configured for multiple sandboxes."
              : "Choose a sandbox which contains the schema you wish to use."
          }
        >
          <FieldLabel labelFor="sandboxField" label="Sandbox" />
        </InfoTipLayout>
      </div>
      <div>
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
              sandboxesMeta.sandboxes.find(
                sandboxMeta => sandboxMeta.name === sandboxMetaName
              )
            );
          }}
          disabled={sandboxesMeta.disabled}
          placeholder="PRODUCTION Prod"
        />
      </div>
      {schemasMetaStatus === STATUS_ERROR && (
        <Alert data-test-id="selectedSandboxWarning" variant="warning">
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
            <ComboBox
              id="schemaField"
              data-test-id="schemaField"
              className="u-widthAuto u-gapBottom u-fieldLong"
              placeholder="Search for or select a schema"
              options={schemaOptions}
              value={schemasMetaSearch}
              onChange={search => setSchemasMetaSearch(undefined)}
              onSelect={item => {
                setSelectedNodeId(undefined);
                setSelectedSchemaMeta(
                  schemasMeta.find(schemaMeta => schemaMeta.$id === item.value)
                );
              }}
            />
          </div>
        </div>
      )}
      {schemasMetaStatus === STATUS_LOADED && schemaStatus === STATUS_ERROR && (
        <Alert data-test-id="selectedSchemaError" variant="error">
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
  sandboxesMeta: PropTypes.object,
  selectedSandboxMeta: PropTypes.object,
  setSelectedSandboxMeta: PropTypes.func,
  schemasMeta: PropTypes.array,
  schemasMetaSearch: PropTypes.string,
  schemasMetaStatus: PropTypes.string,
  setSchemasMetaSearch: PropTypes.func,
  setSchemasMetaStatus: PropTypes.func,
  selectedSchemaMeta: PropTypes.object,
  setSelectedSchemaMeta: PropTypes.func,
  schemaStatus: PropTypes.string
};

const XdmExtensionView = () => {
  const [sandboxesMeta, setSandboxesMeta] = useState();
  const [schemasMeta, setSchemasMeta] = useState();
  const [schemasMetaSearch, setSchemasMetaSearch] = useState();
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
              setSandboxesMeta(_sandboxesMeta);
              // default to the first item in the list
              let sandboxMeta = _sandboxesMeta.sandboxes.find(
                _sandboxMeta => _sandboxMeta.isDefault === true
              );

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
              setSchemasMetaStatus(STATUS_ERROR);
              return {};
            }

            setSchemasMetaStatus(STATUS_LOADED);

            // TODO: don't initialize form state if the schema doesn't match
            // let schemaMeta = response.results[0];
            let schemaMeta = null;

            // if a schema exists in settings, use it
            if (initInfo.settings && initInfo.settings.schema) {
              schemaMeta = response.results.find(
                _schemaMeta => _schemaMeta.$id === initInfo.settings.schema.id
              );
            }

            if (!schemaMeta) {
              return null;
            }

            setSchemasMetaSearch(schemaMeta.title);
            setSelectedSchemaMeta(schemaMeta);
            setSchemaStatus(STATUS_LOADING);

            const { sandboxName } = response;

            return fetchSchema({
              orgId: initInfo.company.orgId,
              imsAccess: initInfo.tokens.imsAccess,
              schemaMeta,
              sandboxName
            })
              .then(schema => {
                setSchemaStatus(STATUS_LOADED);
                return schema;
              })
              .catch(() => {
                setSchemaStatus(STATUS_ERROR);
              });
          })
          .then(schema => {
            const initialValues = getInitialFormState({
              value: (initInfo.settings && initInfo.settings.data) || {},
              schema: schema || {}
            });

            return initialValues;
          });
      }}
      getSettings={({ values }) => {
        let schema = null;
        if (selectedSchemaMeta) {
          schema = {
            id: selectedSchemaMeta.$id,
            version: selectedSchemaMeta.version
          };
        }
        return {
          sandbox: {
            name: selectedSandboxMeta.name
          },
          schema,
          data: getValueFromFormState({ formStateNode: values }) || {}
        };
      }}
      validate={validate}
      render={options => {
        const onSandboxesMetaSelected = sandboxMeta => {
          setSelectedSandboxMeta(sandboxMeta);
          setSchemasMetaStatus(STATUS_LOADING);

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
              setSchemasMetaStatus(STATUS_LOADED);
              setSchemasMeta(response.results);
              setSelectedSchemaMeta(response.results[0]);
            })
            .catch(() => {
              setSchemasMetaStatus(STATUS_ERROR);
            });
        };

        // TODO: address a suspected race condition where a previous selected item may return before
        //  a secondary selected item
        const onSchemaMetaSelected = schemaMeta => {
          setSelectedSchemaMeta(schemaMeta);
          setSchemaStatus(STATUS_LOADING);
          fetchSchema({
            orgId: options.initInfo.company.orgId,
            imsAccess: options.initInfo.tokens.imsAccess,
            schemaMeta,
            sandboxName: selectedSandboxMeta.name
              ? selectedSandboxMeta.name
              : null
          })
            .then(schema => {
              setSchemasMetaSearch(schema.name);
              setSchemaStatus(STATUS_LOADED);
              const initialValues = getInitialFormState({
                value: {},
                schema
              });
              options.resetForm(initialValues);
            })
            .catch(() => {
              setSchemaStatus(STATUS_ERROR);
            });
        };

        return (
          <XdmObject
            {...options}
            sandboxesMeta={sandboxesMeta}
            selectedSandboxMeta={selectedSandboxMeta}
            setSelectedSandboxMeta={onSandboxesMetaSelected}
            schemasMeta={schemasMeta}
            schemasMetaSearch={schemasMetaSearch}
            schemasMetaStatus={schemasMetaStatus}
            setSchemasMetaSearch={setSchemasMetaSearch}
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
