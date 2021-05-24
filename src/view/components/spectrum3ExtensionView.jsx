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
import useSettings from "../utils/useSettings";

// This component wires up Launch's extension bridge, and creates the
// ExtensionViewContext. It should be used for each view inside an extension.
const ExtensionView = ({
  render
}) => {

  const [initInfo, setInitInfo] = useState();
  const [settings, setSettings, saveSubset, applySubset] = useSettings();

  const registeredGetSettingsRef = useRef([]);
  const registeredValidateRef = useRef([]);

  useExtensionBridge({
    init({ initInfo: _initInfo }) {
      console.log("Setting initInfo", _initInfo);
      setInitInfo(_initInfo);
      setSettings(_initInfo.settings);
    },
    getSettings() {
      return registeredGetSettingsRef.current.reduce((to, { getSettings, claimedFields }) => {
        const settingsSubset = getSettings();
        return applySubset(to, settingsSubset, claimedFields);
      }, settings);
    },
    validate() {
      return Promise.all(registeredValidateRef.current.map(validate => validate()))
        .then(areValid => areValid.every(isValid => isValid));
    }
  });

  if (!initInfo) {
    return (null);
  }

  const context = {
    registerGetSettings(getSettings, claimedFields) {
      registeredGetSettingsRef.current.push({ getSettings, claimedFields });
    },
    deregisterGetSettings(getSettings, shouldApply) {
      console.log("Deregister Get Settings, shouldApply:", shouldApply);
      registeredGetSettingsRef.current = registeredGetSettingsRef.current.filter(other => {
        if (other.getSettings !== getSettings) {
          return true;
        }
        if (shouldApply) {
          saveSubset(other.getSettings(), other.claimedFields);
        }
        return false;
      });
    },
    registerValidate(validate) {
      registeredValidateRef.current.push(validate);
    },
    deregisterValidate(validate) {
      registeredValidateRef.current = registeredValidateRef.current.filter(other => other !== validate);
    },
    initInfo,
    settings
  };

  return (
    <ExtensionViewContext.Provider value={context}>
      {render()}
    </ExtensionViewContext.Provider>
  );
};

ExtensionView.propTypes = {
  render: PropTypes.func.isRequired
};

export default ExtensionView;
