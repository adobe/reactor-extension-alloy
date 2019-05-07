/***************************************************************************************
 * (c) 2019 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 ****************************************************************************************/

import React, { useState, useEffect } from 'react';
import ErrorBoundary from './errorBoundary';

let registeredGetSettings;
let registeredValidate;

export default ({ viewComponent: ViewComponent }) => {
  const [{ initComplete, settings }, setState] = useState({
    initialized: false
  });

  useEffect(() => {
    window.extensionBridge.register({
      init: (options = {}) => {
        let { settings: s } = options;

        setState({
          initialized: true,
          settings: s
        });
      },
      getSettings: () => (registeredGetSettings ? registeredGetSettings() : {}),
      validate: () => (registeredValidate ? registeredValidate() : true)
    });
  }, []);

  return initComplete ? (
    <ErrorBoundary>
      <ViewComponent
        settings={settings}
        registerGetSettings={fn => {
          registeredGetSettings = fn;
        }}
        registerValidate={fn => {
          registeredValidate = fn;
        }}
      />
    </ErrorBoundary>
  ) : null;
};
