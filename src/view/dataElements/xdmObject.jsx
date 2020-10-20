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
import React, { useCallback, useState } from "react";
import PropTypes from "prop-types";
import Alert from "@react/react-spectrum/Alert";
import ComboBox from "@react/react-spectrum/ComboBox";
import Select from "@react/react-spectrum/Select";
import FieldLabel from "@react/react-spectrum/FieldLabel";
import Wait from "@react/react-spectrum/Wait";
import debounce from "debounce";
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
import getSchemaOptions from "./xdmObject/helpers/getSchemaOptions";
import "./xdmObject.styl";
import InfoTipLayout from "../components/infoTipLayout";

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
  setSchemasMeta,
  schemaOptions,
  setSchemaOptions,
  schemaSearchInProgress,
  setSchemaSearchInProgress,
  schemasMetaSearch,
  schemasMetaStatus,
  setSchemasMetaSearch,
  setSchemasMetaStatus,
  selectedSchemaMeta,
  setSelectedSchemaMeta,
  showComboMenu,
  setShowComboMenu,
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

  const doSearch = useCallback(
    debounce(({ sandboxName, search }) => {
      setSchemaSearchInProgress(true);
      return fetchSchemasMeta({
        orgId: initInfo.company.orgId,
        imsAccess: initInfo.tokens.imsAccess,
        sandboxName,
        search
      }).then(response => {
        if (!response.results.length) {
          setSchemasMetaStatus(STATUS_ERROR);
          return;
        }
        setSchemasMeta(response.results);
        setSchemaOptions(getSchemaOptions({ schemasMeta: response.results }));
        setSchemaSearchInProgress(false);
        setSchemasMetaStatus(STATUS_LOADED);
      });
    }, SCHEMA_SEARCH_WAIT_MS),
    []
  );

  return (
    <div>
      <div className="u-gapTop">
        <InfoTipLayout
          tip={
            sandboxes.disabled && sandboxes.disabled === true
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
            <ComboBox
              id="schemaField"
              data-test-id="schemaField"
              className="u-widthAuto u-gapBottom u-fieldLong"
              options={schemaOptions}
              value={schemasMetaSearch}
              showMenu={showComboMenu}
              onChange={search => {
                setSchemasMetaSearch(search);
                doSearch({ sandboxName: selectedSandbox.name, search });
              }}
              onSelect={item => {
                setSelectedNodeId(undefined);
                setSelectedSchemaMeta(
                  schemasMeta.find(schemaMeta => schemaMeta.$id === item.value)
                );
              }}
              onMenuToggle={menuState => {
                setShowComboMenu(menuState);
              }}
              placeholder="Search for or select a schema"
            />
            <div className="u-gapTop u-gapLeft">
              {schemaSearchInProgress === true && <Wait size="S" />}
            </div>
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
  setSchemasMeta: PropTypes.func,
  schemaOptions: PropTypes.array,
  setSchemaOptions: PropTypes.func,
  schemaSearchInProgress: PropTypes.bool,
  setSchemaSearchInProgress: PropTypes.func,
  schemasMetaSearch: PropTypes.string,
  schemasMetaStatus: PropTypes.string,
  setSchemasMetaSearch: PropTypes.func,
  setSchemasMetaStatus: PropTypes.func,
  selectedSchemaMeta: PropTypes.object,
  setSelectedSchemaMeta: PropTypes.func,
  schemaStatus: PropTypes.string,
  showComboMenu: PropTypes.bool,
  setShowComboMenu: PropTypes.func
};

const XdmExtensionView = () => {
  const [sandboxes, setSandboxes] = useState();
  const [schemasMeta, setSchemasMeta] = useState([]);
  const [schemaOptions, setSchemaOptions] = useState([]);
  const [schemaSearchInProgress, setSchemaSearchInProgress] = useState();
  const [schemasMetaSearch, setSchemasMetaSearch] = useState();
  const [schemasMetaStatus, setSchemasMetaStatus] = useState();
  const [selectedSandbox, setSelectedSandbox] = useState();
  const [selectedSchemaMeta, setSelectedSchemaMeta] = useState();
  const [showComboMenu, setShowComboMenu] = useState();
  const [schemaStatus, setSchemaStatus] = useState();

  // TODO: break apart this extension view
  return (
    <ExtensionView
      getInitialValues={({ initInfo }) => {
        return fetchSandboxes({
          orgId: initInfo.company.orgId,
          imsAccess: initInfo.tokens.imsAccess
        })
          .then(_sandboxes => {
            let sandbox = { name: null };
            // if sandboxes are returned from the api call
            if (_sandboxes.sandboxes && _sandboxes.sandboxes.length) {
              setSandboxes(_sandboxes);
              // default to the first item in the list
              sandbox = _sandboxes.sandboxes.find(
                _sandbox => _sandbox.isDefault === true
              );

              // if a sandbox exists in settings and is in the list, choose that item
              if (initInfo.settings && initInfo.settings.sandbox) {
                sandbox = _sandboxes.sandboxes.find(
                  _sandbox => _sandbox.name === initInfo.settings.sandbox.name
                );
              }
              setSelectedSandbox(sandbox);
            }

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
              setSchemaOptions(
                getSchemaOptions({ schemasMeta: response.results })
              );
              setSchemasMetaStatus(STATUS_LOADED);

              // if a schema exists in settings, use it
              if (initInfo.settings && initInfo.settings.schema) {
                schemaMeta = response.results.find(
                  _schemaMeta => _schemaMeta.$id === initInfo.settings.schema.id
                );
                if (schemaMeta) {
                  setSchemasMetaSearch(schemaMeta.title);
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
          setSchemasMetaSearch(SCHEMA_SEARCH_DEFAULT);
          fetchSchemasMeta({
            orgId: options.initInfo.company.orgId,
            imsAccess: options.initInfo.tokens.imsAccess,
            sandboxName: sandbox.name
          }).then(response => {
            if (!response.results.length) {
              setSchemasMetaStatus(STATUS_ERROR);
              return;
            }
            setSchemasMeta(response.results);
            setSchemaOptions(
              getSchemaOptions({ schemasMeta: response.results })
            );
            setSelectedSchemaMeta(undefined);
            setSchemasMetaStatus(STATUS_LOADED);
          });
        };

        // TODO: address a suspected race condition where a previous selected item may return before
        //  a secondary selected item
        const onSchemaMetaSelected = schemaMeta => {
          setSelectedSchemaMeta(schemaMeta);
          setSchemasMetaSearch(schemaMeta.title);
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
        };

        return (
          <XdmObject
            {...options}
            sandboxes={sandboxes}
            selectedSandbox={selectedSandbox}
            setSelectedSandbox={onSandboxSelected}
            schemasMeta={schemasMeta}
            setSchemasMeta={setSchemasMeta}
            schemaOptions={schemaOptions}
            setSchemaOptions={setSchemaOptions}
            schemaSearchInProgress={schemaSearchInProgress}
            setSchemaSearchInProgress={setSchemaSearchInProgress}
            schemasMetaSearch={schemasMetaSearch}
            schemasMetaStatus={schemasMetaStatus}
            setSchemasMetaSearch={setSchemasMetaSearch}
            setSchemasMetaStatus={setSchemasMetaStatus}
            selectedSchemaMeta={selectedSchemaMeta}
            setSelectedSchemaMeta={onSchemaMetaSelected}
            showComboMenu={showComboMenu}
            setShowComboMenu={setShowComboMenu}
            schemaStatus={schemaStatus}
            setSchemaStatus={setSchemaStatus}
          />
        );
      }}
    />
  );
};

render(XdmExtensionView);
