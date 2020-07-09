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

const currentExtensionDescriptor = require('./getExtensionDescriptor')();

module.exports = (extensionDescriptorPaths, { request, ports }) => {
  const populateComponentsType = (type, extensionDescriptor, registry) => {
    (extensionDescriptor[type] || []).forEach(component => {
      registry.components[type][`${extensionDescriptor.name}/${component.libPath}`] = {
        extensionDisplayName: extensionDescriptor.displayName,
        extensionName: extensionDescriptor.name,
        displayName: component.displayName,
        libPath: component.libPath,
        viewPath: component.viewPath
          ? `extensionViews/${extensionDescriptor.name}/${extensionDescriptor.version}/${
            component.viewPath
          }`
          : null
      };
    });
  };

  const populateComponents = function(extensionDescriptors, registry) {
    Object.keys(extensionDescriptors).forEach(key => {
      const extensionDescriptor = extensionDescriptors[key];
      ['events', 'conditions', 'actions', 'dataElements'].forEach(type =>
        populateComponentsType(type, extensionDescriptor, registry)
      );
    });
  };

  const populateExtensionsData = function(extensionDescriptors, registry) {
    Object.keys(extensionDescriptors).forEach(key => {
      const extensionDescriptor = extensionDescriptors[key];
      registry.extensions[extensionDescriptor.name] = {
        displayName: extensionDescriptor.displayName,
        name: extensionDescriptor.name,
        viewPath: (extensionDescriptor.configuration || {}).viewPath
          ? `extensionViews/${extensionDescriptor.name}/${extensionDescriptor.version}/${
            extensionDescriptor.configuration.viewPath
          }`
          : null
      };
    });
  };

  const registry = {
    currentExtensionName: currentExtensionDescriptor.name,
    environment: {
      server: {
        host: request.protocol + '://' + request.hostname,
        port: ports[request.protocol]
      }
    },
    components: {
      events: {
        'sandbox/pageTop.js': {
          extensionDisplayName: 'Sandbox',
          extensionName: 'sandbox',
          displayName: 'Page Top',
          libPath: 'pageTop.js'
        },
        'sandbox/click.js': {
          extensionDisplayName: 'Sandbox',
          extensionName: 'sandbox',
          displayName: 'Click',
          libPath: 'click.js'
        }
      },
      conditions: {},
      actions: {
        'sandbox/logEventInfo.js': {
          extensionDisplayName: 'Sandbox',
          extensionName: 'sandbox',
          displayName: 'Log Event Info',
          libPath: 'logEventInfo.js'
        }
      },
      dataElements: {
        'sandbox/localStorage.js': {
          extensionDisplayName: 'Sandbox',
          extensionName: 'sandbox',
          displayName: 'Local Storage',
          libPath: 'localStorage.js',
          viewPath: '/localStorage.html'
        },
        'sandbox/javascriptVariable.js': {
          extensionDisplayName: 'Sandbox',
          extensionName: 'sandbox',
          displayName: 'JavaScript Variable',
          libPath: 'javascriptVariable.js',
          viewPath: '/javascriptVariable.html'
        }
      }
    },
    extensions: {}
  };

  populateComponents(extensionDescriptorPaths, registry);
  populateExtensionsData(extensionDescriptorPaths, registry);
  return registry;
};
