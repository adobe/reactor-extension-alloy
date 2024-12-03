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
  // Create script element
  const script = document.createElement('script');
  script.type = 'text/javascript';
  
  // Add container configuration
  const configScript = document.createElement('script');
  configScript.type = 'text/javascript';
  configScript.textContent = `window._satellite = window._satellite || {};
    window._satellite.container = ${JSON.stringify(container)};`;
  document.head.appendChild(configScript);

  // Add Launch library
  script.src = '/base/dist/engine/index.js';
  document.head.appendChild(script);

  // Wait for script to load
  return new Promise((resolve, reject) => {
    script.onload = resolve;
    script.onerror = reject;
  });
} 