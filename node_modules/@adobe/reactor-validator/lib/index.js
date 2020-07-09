/***************************************************************************************
 * (c) 2017 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 ****************************************************************************************/

'use strict';

var fs = require('fs');
var pathUtil = require('path');
var Ajv = require('ajv');

var isFile = function(path) {
  try {
    return fs.statSync(path).isFile();
  } catch (e) {
    return false;
  }
};

var isDir = function(path) {
  try {
    return fs.statSync(path).isDirectory();
  } catch (e) {
    return false;
  }
};

var stripQueryAndAnchor = function(path) {
  path = path.split('?').shift();
  path = path.split('#').shift();
  return path;
};

var validateJsonStructure = function(extensionDescriptor) {
  var platform = extensionDescriptor.platform;

  if (!platform) {
    return 'the required property "platform" is missing.';
  }

  var extensionDescriptorSchema =
    require('@adobe/reactor-turbine-schemas/schemas/extension-package-' + platform + '.json');

  var ajv = new Ajv({
    schemaId: 'auto'
  });
  ajv.addMetaSchema(require('ajv/lib/refs/json-schema-draft-04.json'));

  if (!ajv.validate(extensionDescriptorSchema, extensionDescriptor)) {
    return ajv.errorsText();
  }
};

var validateViewBasePath = function(extensionDescriptor) {
  var absViewBasePath = pathUtil.resolve(
    process.cwd(),
    extensionDescriptor.viewBasePath
  );

  if (!isDir(absViewBasePath)) {
    return absViewBasePath + ' is not a directory.';
  }
};

var validateFiles = function(extensionDescriptor) {
  var paths = [];
  var platform = extensionDescriptor.platform;

  if (!platform) {
    return 'the required property "platform" is missing.';
  }

  if (extensionDescriptor.configuration) {
    paths.push(pathUtil.resolve(
      process.cwd(),
      extensionDescriptor.viewBasePath,
      stripQueryAndAnchor(extensionDescriptor.configuration.viewPath)
    ));
  }

  if (extensionDescriptor.main) {
    paths.push(pathUtil.resolve(
      process.cwd(),
      extensionDescriptor.main
    ));
  }

  ['events', 'conditions', 'actions', 'dataElements'].forEach(function(featureType) {
    var features = extensionDescriptor[featureType];

    if (features) {
      features.forEach(function(feature) {
        if (feature.viewPath) {
          paths.push(pathUtil.resolve(
            process.cwd(),
            extensionDescriptor.viewBasePath,
            stripQueryAndAnchor(feature.viewPath)
          ));
        }

        if (platform === 'web') {
          paths.push(pathUtil.resolve(
            process.cwd(),
            feature.libPath
          ));
        }
      });
    }
  });

  for (var i = 0; i < paths.length; i++) {
    var path = paths[i];
    if (!isFile(path)) {
      return path + ' is not a file.';
    }
  }
};


module.exports = function(extensionDescriptor) {
  var validators = [
    validateJsonStructure,
    validateViewBasePath,
    validateFiles
  ];

  for (var i = 0; i < validators.length; i++) {
    var error = validators[i](extensionDescriptor);

    if (error) {
      return 'An error was found in your extension.json: ' + error;
    }
  }
};
