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

var path = require('path');
var ENGINE_FILENAME = 'engine.js';
var CLIENT_DIST_PATH = path.resolve(__dirname, '../../../dist');
var CLIENT_SRC_PATH = path.resolve(__dirname, '../../client/src');
var EXTENSION_BRIDGE = 'extensionbridge.min.js';
var EXTENSION_BRIDGE_CHILD = 'extensionbridge-child.js';
var EXTENSION_BRIDGE_PATH = path.join(require.resolve('@adobe/reactor-bridge'), '../../dist/');

var files = {
  EXTENSION_DESCRIPTOR_FILENAME: 'extension.json',
  EXTENSION_DESCRIPTOR_SCRIPT_FILENAME: 'extensionDescriptor.js',
  CLIENT_DIST_PATH: CLIENT_DIST_PATH,
  CLIENT_SRC_PATH: CLIENT_SRC_PATH,
  CONSUMER_PROVIDED_FILES_PATH: path.resolve('.sandbox'),
  CONTAINER_FILENAME: 'container.js',
  ENGINE_FILENAME: 'engine.js',
  VIEW_SANDBOX_JS_PATH: path.resolve(CLIENT_SRC_PATH, 'viewSandbox.js'),
  TURBINE_ENGINE_PATH: require.resolve('@adobe/reactor-turbine/dist/' + ENGINE_FILENAME),
  VIEW_SANDBOX_HTML_FILENAME: 'viewSandbox.html',
  LIB_SANDBOX_HTML_FILENAME: 'libSandbox.html',
  EXTENSION_VIEWS_DIRNAME: 'extensionViews',
  EXTENSION_BRIDGE: EXTENSION_BRIDGE,
  EXTENSION_BRIDGE_CHILD: EXTENSION_BRIDGE_CHILD,
  EXTENSION_BRIDGE_PATH: EXTENSION_BRIDGE_PATH,
  EXTENSION_BRIDGE_CHILD_PATH: path.join(EXTENSION_BRIDGE_PATH, EXTENSION_BRIDGE_CHILD)
};

module.exports = files;
