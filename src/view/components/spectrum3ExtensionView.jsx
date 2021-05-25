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

import React, { useState, useRef } from "react";
import PropTypes from "prop-types";
import useExtensionBridge from "../utils/useExtensionBridge";
import ExtensionViewContext from "./extensionViewContext";
import applyClaimedFields from "../utils/applyClaimedFields";

// This component wires up Launch's extension bridge, and creates the
// ExtensionViewContext. It should be used for each view inside an extension.
const ExtensionView = ({ render }) => {
  // initInfo is the initial info passed in through the extension bridge
  const [initInfo, setInitInfo] = useState();
  // settings is the initial settings object, but changes when ExtensionViewForm
  // components are un-mounted.
  const [settings, setSettings] = useState();

  const registeredGetSettingsRef = useRef([]);
  const registeredValidateRef = useRef([]);
  const saveSubsetRef = useRef();

  useExtensionBridge({
    init({ initInfo: _initInfo }) {
      setSettings(_initInfo.settings || {});
      setInitInfo(_initInfo);
    },
    getSettings() {
      // start with the current settings object, and apply all the claimedFields from
      // currently rendered ExtensionViewForms
      return registeredGetSettingsRef.current.reduce(
        (to, { getSettings, claimedFields }) => {
          const settingsSubset = getSettings();
          return applyClaimedFields(to, settingsSubset, claimedFields);
        },
        settings
      );
    },
    validate() {
      // Check if all currently rendered ExtensionViewForms are valid
      return Promise.all(
        registeredValidateRef.current.map(validate => validate())
      ).then(areValid => areValid.every(isValid => isValid));
    }
  });

  if (!initInfo) {
    return null;
  }

  saveSubsetRef.current = (settingsSubset, claimedFields) => {
    setSettings(applyClaimedFields(settings, settingsSubset, claimedFields));
  };

  const context = {
    registerGetSettings(getSettings, claimedFields) {
      registeredGetSettingsRef.current.push({ getSettings, claimedFields });
    },
    deregisterGetSettings(getSettings) {
      registeredGetSettingsRef.current = registeredGetSettingsRef.current.filter(
        other => {
          if (other.getSettings !== getSettings) {
            return true;
          }
          saveSubsetRef.current(other.getSettings(), other.claimedFields);
          return false;
        }
      );
    },
    registerValidate(validate) {
      registeredValidateRef.current.push(validate);
    },
    deregisterValidate(validate) {
      registeredValidateRef.current = registeredValidateRef.current.filter(
        other => other !== validate
      );
    },
    initInfo,
    settings
  };

  return (
    <ExtensionViewContext.Provider value={context}>
      {render({ initInfo, settings })}
    </ExtensionViewContext.Provider>
  );
};

ExtensionView.propTypes = {
  render: PropTypes.func.isRequired
};

export default ExtensionView;
