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

/**
 * Generates files that the consumer may change to configure the sandbox. The directory of files
 * is ".sandbox" and will be placed in the current working directory.
 */

const fs = require('fs-extra');
const path = require('path');
const files = require('./constants/files');

module.exports = () => {
  return new Promise((resolve, reject) => {
    const descriptor = require(path.resolve(
      files.EXTENSION_DESCRIPTOR_FILENAME
    ));

    if (descriptor.platform !== 'web') {
      reject('The `init` command is supported only for web extensions.');
    }

    Promise.all(
      [
        [files.CLIENT_SRC_PATH, files.CONTAINER_FILENAME],
        [files.CLIENT_DIST_PATH, files.LIB_SANDBOX_HTML_FILENAME],
      ].map(([filepath, filename]) => {
        return fs.copy(
          path.resolve(filepath, filename),
          path.resolve(files.CONSUMER_PROVIDED_FILES_PATH, filename),
          {
            clobber: false,
          }
        );
      })
    ).then(() => {
      // We use a .then() so that the promise exposed to the consumers
      // doesn't get resolved with any value.
      resolve();
    });
  });
};
