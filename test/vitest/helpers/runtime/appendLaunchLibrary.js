/*
Copyright 2024 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
*/
/* eslint-disable no-console */
/*
Copyright 2024 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
*/

/**
 * Appends the Launch library to the document.
 * @param {Object} container The container configuration.
 * @returns {Promise<void>}
 */
export default async function appendLaunchLibrary(container) {
  console.log("Appending Launch library...");

  try {
    // Initialize _satellite
    if (!window._satellite) {
      console.log("Initializing _satellite object");
      window._satellite = {
        container,
        logger: {
          log: console.log,
          info: console.info,
          warn: console.warn,
          error: console.error,
        },
      };
    }

    // Add container configuration
    console.log("Adding container configuration");
    const configScript = document.createElement("script");
    configScript.type = "text/javascript";
    configScript.textContent = `
      window._satellite = window._satellite || {};
      window._satellite.container = ${JSON.stringify(container)};
    `;
    document.head.appendChild(configScript);

    // Mock Launch library load
    console.log("Mocking Launch library load");
    const mockLaunchLibrary = `
      window._satellite = window._satellite || {};
      window._satellite.pageBottom = function() {
        console.log('Page bottom called');
      };
      window._satellite.track = function(identifier) {
        console.log('Track called with:', identifier);
      };
      window._satellite.buildInfo = ${JSON.stringify(container.buildInfo)};
      
      // Store XDM data
      window._satellite.xdmData = {};
      
      // Execute rules
      if (window._satellite.container.rules) {
        console.log('Executing rules');
        window._satellite.container.rules.forEach(function(rule) {
          if (rule.events && rule.events[0].modulePath === 'sandbox/pageTop.js') {
            console.log('Executing page top rule:', rule.name);
            rule.actions.forEach(function(action) {
              console.log('Executing action:', action.modulePath);
              
              // Execute updateVariable action
              if (action.modulePath === 'adobe-alloy/dist/lib/actions/updateVariable/index.js') {
                console.log('Executing updateVariable action with settings:', action.settings);
                const { dataElementCacheId, data } = action.settings;
                if (dataElementCacheId) {
                  window._satellite.xdmData[dataElementCacheId] = data;
                  console.log('Updated XDM data:', window._satellite.xdmData);
                }
              }
              
              // Execute sendEvent action
              if (action.modulePath === 'adobe-alloy/dist/lib/actions/sendEvent/index.js') {
                console.log('Executing sendEvent action with settings:', action.settings);
                const instanceName = action.settings.instanceName || 'alloy';
                if (!window[instanceName]) {
                  window[instanceName] = {
                    sendEvent: function() {
                      console.log(instanceName + ' sendEvent called');
                      const url = 'https://edge.adobedc.net/v1/interact?configId=bc1a10e0-aee4-4e0e-ac5b-cdbb9abbec83:AditiTest';
                      console.log('Making request to:', url);
                      
                      return new Promise((resolve, reject) => {
                        const xhr = new XMLHttpRequest();
                        xhr.open('POST', url);
                        xhr.setRequestHeader('Content-Type', 'application/json');
                        
                        xhr.onload = function() {
                          if (xhr.status >= 200 && xhr.status < 300) {
                            console.log('Request completed with status:', xhr.status);
                            resolve(JSON.parse(xhr.responseText));
                          } else {
                            console.error('Request failed with status:', xhr.status);
                            reject(new Error('Request failed'));
                          }
                        };
                        
                        xhr.onerror = function() {
                          console.error('Request failed');
                          reject(new Error('Request failed'));
                        };
                        
                        // Get XDM data from data element if specified
                        let xdmData = {};
                        if (action.settings.xdm) {
                          const dataElementName = action.settings.xdm.replace(/%/g, '');
                          const dataElement = window._satellite.container.dataElements[dataElementName];
                          if (dataElement && dataElement.settings.cacheId) {
                            xdmData = window._satellite.xdmData[dataElement.settings.cacheId] || {};
                          }
                        }
                        
                        const requestBody = {
                          events: [{
                            xdm: xdmData
                          }]
                        };
                        
                        console.log('Sending request with body:', JSON.stringify(requestBody));
                        xhr.send(JSON.stringify(requestBody));
                      });
                    }
                  };
                }
                window[instanceName].sendEvent().catch(function(error) {
                  console.error('sendEvent failed:', error);
                });
              }
            });
          }
        });
      }
      
      // Trigger page load event
      const event = new Event('load');
      window.dispatchEvent(event);
    `;

    const launchScript = document.createElement("script");
    launchScript.type = "text/javascript";
    launchScript.textContent = mockLaunchLibrary;
    document.head.appendChild(launchScript);

    console.log("Launch library appended successfully");
    return Promise.resolve();
  } catch (error) {
    console.error("Error appending Launch library:", error);
    return Promise.reject(error);
  }
}
