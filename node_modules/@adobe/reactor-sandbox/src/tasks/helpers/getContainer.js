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

const fs = require('fs');
const path = require('path');
const files = require('../constants/files');
const matchRequires = require('match-requires');
const extensionDescriptorPaths = require('./extensionDescriptorPaths');

const FEATURE_TYPES = [
  'events',
  'conditions',
  'actions',
  'dataElements',
  'sharedModules',
  'main'
];

const DEFAULT_CONTAINER_TEMPLATE_PATH = path.resolve(
  files.CLIENT_SRC_PATH,
  files.CONTAINER_FILENAME
);

const CONSUMER_CONTAINER_TEMPLATE_PATH = path.resolve(
  files.CONSUMER_PROVIDED_FILES_PATH,
  files.CONTAINER_FILENAME);

const wrapInFunction = (content, argNames) => {
  const argsStr = argNames ? argNames.join(', ') : '';
  return 'function(' + argsStr + ') {\n' + content + '\n}\n';
};

const functionTokenRegistry = {
  _tokenIdCounter: 0,
  _functionStrByToken: {},
  FUNCTION_TOKEN_REGEX: /"\{\{sandbox:function:(.+?)\}\}"/g,
  getToken: function(functionStr) {
    const tokenId = ++this._tokenIdCounter;
    this._functionStrByToken[tokenId] = functionStr;
    return '{{sandbox:function:' + tokenId + '}}';
  },
  getFunctionStr: function(tokenId) {
    return this._functionStrByToken[tokenId];
  }
};

const augmentModule = (modulesOutput, extensionName, extensionPath, modulePath, moduleMeta) => {
  const source = fs.readFileSync(modulePath, {encoding: 'utf8'});
  matchRequires(source)
    // matchRequires returns objects with some cruft. We just care about the module paths.
    .map(result => result.name)
    // Only care about relative paths. We don't care about require statements for core modules.
    .filter(module => module.indexOf('.') === 0)
    // Allow extension devs to require JS files without the js extension
    .map(module => path.extname(module) === '.js' ? module : module + '.js')
    .forEach(function(requiredRelativePath) {
      const requiredPath = path.resolve(path.dirname(modulePath), requiredRelativePath);
      augmentModule(modulesOutput, extensionName, extensionPath, requiredPath, {});
    });

  // The reference path is a unique path that starts with the extension name, then a slash,
  // then the path to the file within the extension's directory.
  // On Windows, the path contains `\` instead of `/`, so we do a global replace at the end.
  const referencePath =
    path.join(extensionName, path.relative(extensionPath, modulePath)).replace(/\\/g, '/');

  // It's possible this module has already been added to the output. If it has, we just need to
  // merge any new meta information that hasn't already been stored for the module. This supports
  // certain cases where a module could be an action delegate AND required via relative path
  // by an event delegate AND be a shared module.
  let moduleOutput = modulesOutput[referencePath];

  if (!moduleOutput) {
    moduleOutput = modulesOutput[referencePath] = {
      // We use a special token that indicates that after the container is serialized
      // to JSON that the token should be replaced with an actual, executable function
      // which wraps the delegate code. We can't just set the value to a function right
      // now because it wouldn't be properly serialized.
      script: functionTokenRegistry.getToken(wrapInFunction(source, [
        'module', 'exports', 'require', 'turbine'
      ]))
    };
  }

  // Merge meta information.
  Object.keys(moduleMeta).forEach(function(key) {
    if (!moduleOutput.hasOwnProperty(key)) {
      moduleOutput[key] = moduleMeta[key];
    }
  });
};

const augmentModules = function(extensionOutput, extensionDescriptor, extensionPath) {
  extensionOutput.modules = extensionOutput.modules || {};

  FEATURE_TYPES.forEach(function(featureType) {
    if (extensionDescriptor.hasOwnProperty(featureType)) {
      let featureDescriptors = extensionDescriptor[featureType];

      if (typeof featureDescriptors === 'string') {
        featureDescriptors = [{
          libPath: featureDescriptors
        }];
      }

      if (featureDescriptors) {
        featureDescriptors.forEach(function(featureDescriptor) {
          // Mobile extensions don't have library modules.
          if (!featureDescriptor.libPath) {
            return;
          }

          const modulePath = path.join(
            extensionPath,
            extensionDescriptor.libBasePath || '',
            featureDescriptor.libPath);

          const moduleMeta = {};

          if (featureDescriptor.name) {
            moduleMeta.name = featureDescriptor.name;
          }

          if (featureType === 'sharedModules') {
            moduleMeta.shared = true;
          }

          if (featureDescriptor.displayName) {
            moduleMeta.displayName = featureDescriptor.displayName;
          }

          augmentModule(
            extensionOutput.modules,
            extensionDescriptor.name,
            extensionPath,
            modulePath,
            moduleMeta);
        });
      }
    }
  });
};

/**
 * Adds a Sandbox extension to the container with some simple events that sandbox users can use in
 * their rules.
 */
const augmentSandboxEvents = function(extensionsOutput) {
  if (!extensionsOutput.sandbox) { // Check to see if the extension under test is named sandbox.
    extensionsOutput.sandbox = {
      displayName: 'Extension Sandbox',
      modules: {
        // These modules are provided to users for their convenience.
        'sandbox/click.js': {
          displayName: 'Click',
          name: 'click',
          script: function(module) {
            module.exports = function(settings, trigger) {
              document.addEventListener('click', function(event) {
                trigger({
                  nativeEvent: event
                });
              });
            };
          }
        },
        'sandbox/pageTop.js': {
          displayName: 'Page Top',
          name: 'page-top',
          script: function(module) {
            module.exports = function(settings, trigger) {
              trigger();
            };
          }
        },
        'sandbox/logEventInfo.js': {
          displayName: 'Log Event Info',
          name: 'log-event-info',
          script: function(module) {
            module.exports = function(settings, event) {
              console.log('Event object received by action:', event);
            };
          }
        },
        'sandbox/localStorage.js': {
          script: function(module) {
            module.exports = function(settings) {
              // When local storage is disabled on Safari, the mere act of referencing
              // window.localStorage throws an error. For this reason, referencing
              // window.localStorage without being inside a try-catch should be avoided.
              try {
                return window.localStorage.getItem(settings.name);
              } catch (e) {
                return null;
              }
            };
          }
        },
        'sandbox/javascriptVariable.js': {
          script: function(module) {
            module.exports = function(settings) {
              var propertyChain = settings.path.split('.');
              var currentValue = window;

              for (var i = 0, len = propertyChain.length; i < len; i++) {
                if (currentValue == null) {
                  return undefined;
                }

                currentValue = currentValue[propertyChain[i]];
              }

              return currentValue;
            };
          }
        }
      }
    };
  }
};

module.exports = function() {
  // When running this task from a turbine extension project we want to include the
  // extension descriptor from that extension as well as any extensions we find under its
  // node_modules.
  // When running this task from within this builder project we care about any extensions we find
  // under this project's node_modules or under a folder starting with @(as for npm scopes).
  let container;

  // Try to use the consumer-defined container first and fallback to the default if they haven't
  // provided one.
  try {
    // Make sure we get the latest.
    delete require.cache[CONSUMER_CONTAINER_TEMPLATE_PATH];
    container = require(CONSUMER_CONTAINER_TEMPLATE_PATH);
  } catch (error) {
    if (error.code === 'MODULE_NOT_FOUND') {
      // Make sure we get the latest.
      delete require.cache[DEFAULT_CONTAINER_TEMPLATE_PATH];
      container = require(DEFAULT_CONTAINER_TEMPLATE_PATH);
    }
  }

  let extensionsOutput = container.extensions;

  if (!extensionsOutput) {
    extensionsOutput = container.extensions = {};
  }

  extensionDescriptorPaths.forEach(function(extensionDescriptorPath) {
    const extensionDescriptor = require(path.resolve(extensionDescriptorPath));
    const extensionPath = path.dirname(path.resolve(extensionDescriptorPath));

    // We take care to not just overwrite extensionsOutput[extensionDescriptor.name] because
    // Extension A may be pulled in from node_modules AND the extension developer using the
    // sandbox may have already coded in some stuff for Extension A within their container.js
    // template. This is a common use case when an extension developer wants to test a certain
    // extension configuration.
    let extensionOutput = extensionsOutput[extensionDescriptor.name];

    if (!extensionOutput) {
      extensionOutput = extensionsOutput[extensionDescriptor.name] = {};
    }

    extensionOutput.displayName = extensionOutput.displayName || extensionDescriptor.displayName;
    extensionOutput.hostedLibFilesBaseUrl =
      '/hostedLibFiles/' + extensionDescriptor.name + '/' + extensionDescriptor.version + '/';

    augmentModules(extensionOutput, extensionDescriptor, extensionPath);
  });

  augmentSandboxEvents(extensionsOutput);

  // Stringify the container so we can wrap it with some additional code (see down below).
  container = JSON.stringify(container, function(key, value) {
    // When consumers have placed functions in their container, we need to maintain them as
    // executable functions in the final output. Consumers may place functions in their container
    // in order to simulate the "function" transform that typically occurs on the server.
    if (typeof value === 'function') {
      return functionTokenRegistry.getToken(value.toString());
    }

    return value;
  }, 2);

  // Replace all function tokens in the JSON with executable functions.
  container = container.replace(functionTokenRegistry.FUNCTION_TOKEN_REGEX, (token, tokenId) => {
    return functionTokenRegistry.getFunctionStr(tokenId);
  });

  container = '' +
    '(function() {\n' +
    '  window._satellite = window._satellite || {};\n' +
    '  window._satellite.container = ' + container + '\n' +
    '})();';

  return container;
};
