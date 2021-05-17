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
import React, { useMemo, useState } from "react";
import PropTypes from "prop-types";
import Alert from "@react/react-spectrum/Alert";
import Select from "@react/react-spectrum/Select";
import FieldLabel from "@react/react-spectrum/FieldLabel";
import NoSelectedNodeView from "./xdmObject/components/noSelectedNodeView";
import ExtensionView from "../components/extensionView";
import CompletionComboBox from "../components/completionComboBox";
import XdmTree from "./xdmObject/components/xdmTree";
import getInitialFormState from "./xdmObject/helpers/getInitialFormState";
import getValueFromFormState from "./xdmObject/helpers/getValueFromFormState";
import NodeEdit from "./xdmObject/components/nodeEdit";
import validate from "./xdmObject/helpers/validate";
import render from "../render";
import fetchSandboxes from "./xdmObject/helpers/fetchSandboxes";
import fetchSchema from "./xdmObject/helpers/fetchSchema";
import fetchSchemasMeta from "./xdmObject/helpers/fetchSchemasMeta";
import getSchemaOptions from "./xdmObject/helpers/getSchemaOptions";
import "./xdmObject.styl";
import InfoTipLayout from "../components/infoTipLayout";
import debouncePromise from "../utils/debouncePromise";

const STATUS_LOADING = "loading";
const STATUS_LOADED = "loaded";
const STATUS_ERROR = "error";

const SCHEMA_SEARCH_WAIT_MS = 250;
const SCHEMA_SEARCH_DEFAULT = "";

const XdmObject = ({
  initInfo,
  formikProps,
  sandboxes,
  selectedSandbox,
  setSelectedSandbox,
  schemasMeta,
  schemasMetaStatus,
  schemaOptionsSearch,
  setSchemaOptionsSearch,
  selectedSchemaMeta,
  setSelectedSchemaMeta,
  schemaStatus
}) => {
  const { values: formState } = formikProps;
  const [selectedNodeId, setSelectedNodeId] = useState();

  const sandboxOptions = sandboxes.sandboxes
    .filter(sandbox => sandbox.state === "active")
    .map(sandbox => {
      return {
        value: sandbox.name,
        label: `${sandbox.type.toUpperCase()}  ${sandbox.title}${
          sandbox.region ? ` (${sandbox.region.toUpperCase()})` : ""
        }`
      };
    });

  const getCompletions = useMemo(() => {
    let lastSearch;
    let lastResults;
    return debouncePromise(search => {
      if (lastSearch === search) {
        return Promise.resolve(lastResults);
      }

      lastSearch = search;
      return fetchSchemasMeta({
        orgId: initInfo.company.orgId,
        imsAccess: initInfo.tokens.imsAccess,
        sandboxName: selectedSandbox.name,
        search
      }).then(response => {
        if (lastSearch === search) {
          if (!response.results.length) {
            lastResults = [];
          } else {
            lastResults = getSchemaOptions({ schemasMeta: response.results });
          }
        }
        return lastResults;
      });
    }, SCHEMA_SEARCH_WAIT_MS);
  }, [selectedSandbox.name]);

  return (
    <div>
      <div className="u-gapTop">
        <InfoTipLayout
          tip={
            sandboxes.disabled === true
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
          value={selectedSandbox.name}
          onChange={sandboxName => {
            setSelectedNodeId(undefined);
            setSelectedSandbox(
              sandboxes.sandboxes.find(sandbox => sandbox.name === sandboxName)
            );
          }}
          disabled={sandboxes.disabled}
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
          <div className="u-flex">
            <CompletionComboBox
              id="schemaField"
              data-test-id="schemaField"
              className="u-widthAuto u-gapBottom u-fieldLong"
              getCompletions={getCompletions}
              value={schemaOptionsSearch}
              onChange={search => {
                setSchemaOptionsSearch(search);
              }}
              onSelect={item => {
                setSelectedNodeId(undefined);
                setSelectedSchemaMeta(
                  schemasMeta.find(schemaMeta => schemaMeta.$id === item.value)
                );
              }}
              onBlur={() => {
                if (
                  !selectedSchemaMeta ||
                  !schemaOptionsSearch ||
                  schemaOptionsSearch === ""
                ) {
                  setSelectedNodeId(undefined);
                  setSelectedSchemaMeta(undefined);
                }
              }}
              placeholder="Search for or select a schema"
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
      {selectedSchemaMeta &&
        schemasMetaStatus === STATUS_LOADED &&
        schemaStatus === STATUS_LOADED && (
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
                    sandbox={selectedSandbox}
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
  sandboxes: PropTypes.object,
  selectedSandbox: PropTypes.object,
  setSelectedSandbox: PropTypes.func,
  schemasMeta: PropTypes.array,
  schemasMetaStatus: PropTypes.string,
  selectedSchemaMeta: PropTypes.object,
  setSelectedSchemaMeta: PropTypes.func,
  schemaOptionsSearch: PropTypes.string,
  setSchemaOptionsSearch: PropTypes.func,
  schemaStatus: PropTypes.string
};

const XdmExtensionView = () => {
  const [sandboxes, setSandboxes] = useState();
  const [schemasMeta, setSchemasMeta] = useState([]);
  const [schemaOptionsSearch, setSchemaOptionsSearch] = useState();
  const [schemasMetaStatus, setSchemasMetaStatus] = useState();
  const [selectedSandbox, setSelectedSandbox] = useState();
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
          .then(response => {
            let sandbox;
            // if sandboxes are returned from the api call
            if (response.sandboxes && response.sandboxes.length) {
              setSandboxes(response);

              // if a sandbox exists in settings and is in the list, choose that item
              if (initInfo.settings && initInfo.settings.sandbox) {
                sandbox = response.sandboxes.find(
                  _sandbox => _sandbox.name === initInfo.settings.sandbox.name
                );
              }

              // default to the first item in the list
              if (!sandbox) {
                sandbox = response.sandboxes.find(
                  _sandbox => _sandbox.isDefault
                );
              }

              if (!sandbox) {
                [sandbox] = response.sandboxes;
              }
            }

            setSelectedSandbox(sandbox);

            return sandbox;
          })
          .then(sandbox => {
            return fetchSchemasMeta({
              orgId: initInfo.company.orgId,
              imsAccess: initInfo.tokens.imsAccess,
              sandboxName: sandbox.name
            });
          })
          .then(response => {
            let schemaMeta = null;
            if (!response.results.length) {
              setSchemasMetaStatus(STATUS_ERROR);
            } else {
              setSchemasMeta(response.results);
              setSchemasMetaStatus(STATUS_LOADED);

              // if a schema exists in settings, use it
              if (initInfo.settings && initInfo.settings.schema) {
                schemaMeta = response.results.find(
                  _schemaMeta => _schemaMeta.$id === initInfo.settings.schema.id
                );
                if (schemaMeta) {
                  setSchemaOptionsSearch(schemaMeta.title);
                  setSelectedSchemaMeta(schemaMeta);
                }
              }
            }
            if (schemaMeta) {
              return fetchSchema({
                orgId: initInfo.company.orgId,
                imsAccess: initInfo.tokens.imsAccess,
                schemaMeta,
                sandboxName: response.sandboxName ? response.sandboxName : null
              });
            }

            return {};
          })
          .then(schema => {
            if (schema) {
              setSchemaStatus(STATUS_LOADED);
            }
            const initialValues = getInitialFormState({
              value: (initInfo.settings && initInfo.settings.data) || {},
              schema
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
            name: selectedSandbox.name
          },
          schema,
          data: getValueFromFormState({ formStateNode: values }) || {}
        };
      }}
      validate={validate}
      render={options => {
        const onSandboxSelected = sandbox => {
          setSelectedSandbox(sandbox);
          setSchemaOptionsSearch(SCHEMA_SEARCH_DEFAULT);
          fetchSchemasMeta({
            orgId: options.initInfo.company.orgId,
            imsAccess: options.initInfo.tokens.imsAccess,
            sandboxName: sandbox.name
          })
            .then(response => {
              if (!response.results.length) {
                throw new Error("No schemas found");
              }
              setSchemasMeta(response.results);
              setSelectedSchemaMeta(undefined);
              setSchemasMetaStatus(STATUS_LOADED);
            })
            .catch(() => {
              setSchemasMetaStatus(STATUS_ERROR);
            });
        };

        // TODO: address a suspected race condition where a previous selected item may return before
        //  a secondary selected item
        const onSchemaMetaSelected = schemaMeta => {
          setSelectedSchemaMeta(schemaMeta);
          if (schemaMeta) {
            setSchemaOptionsSearch(schemaMeta.title);
            setSchemaStatus(STATUS_LOADING);
            fetchSchema({
              orgId: options.initInfo.company.orgId,
              imsAccess: options.initInfo.tokens.imsAccess,
              schemaMeta,
              sandboxName: selectedSandbox.name ? selectedSandbox.name : null
            })
              .then(schema => {
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
          } else {
            setSchemaStatus(STATUS_LOADED);
          }
        };

        return (
          <XdmObject
            {...options}
            sandboxes={sandboxes}
            selectedSandbox={selectedSandbox}
            setSelectedSandbox={onSandboxSelected}
            schemasMeta={schemasMeta}
            schemasMetaStatus={schemasMetaStatus}
            selectedSchemaMeta={selectedSchemaMeta}
            setSelectedSchemaMeta={onSchemaMetaSelected}
            schemaOptionsSearch={schemaOptionsSearch}
            setSchemaOptionsSearch={setSchemaOptionsSearch}
            schemaStatus={schemaStatus}
            setSchemaStatus={setSchemaStatus}
          />
        );
      }}
    />
  );
};

render(XdmExtensionView);
