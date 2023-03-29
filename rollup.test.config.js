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

const resolve = require("rollup-plugin-node-resolve");
const commonjs = require("rollup-plugin-commonjs");
const babel = require("rollup-plugin-babel");
const istanbul = require("rollup-plugin-istanbul");
const minimist = require("minimist");

const argv = minimist(process.argv.slice(2));
const plugins = [resolve(), commonjs(), babel({ runtimeHelpers: true })];

if (argv.reporters && argv.reporters.split(",").includes("coverage")) {
  plugins.unshift(
    istanbul({
      exclude: ["test/unit/**/*.spec.js", "node_modules/**"]
    })
  );
}

module.exports = {
  output: {
    format: "iife"
  },
  plugins
};
