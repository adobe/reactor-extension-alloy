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

const execSync = require('child_process').execSync;
const chalk = require('chalk');
const sandboxPkg = require('../../package.json');
const semverDiff = require('semver-diff');

const getLatestVersion = packageName => {
  return execSync('npm view ' + packageName + ' version')
    .toString('utf8')
    .replace(/\n$/, '');
};

module.exports = () => {
  const sandboxOutdated = semverDiff(
    sandboxPkg.version,
    getLatestVersion('@adobe/reactor-sandbox')
  );

  if (sandboxOutdated) {
    console.log(
      chalk.red(
        'Your sandbox is out of date. To ensure you are testing against the ' +
        'latest code, please first update your sandbox by running ' +
        `${chalk.cyan('npm i @adobe/reactor-sandbox@latest')}.`
      )
    );
  }
};
