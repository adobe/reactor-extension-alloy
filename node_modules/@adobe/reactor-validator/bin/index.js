#!/usr/bin/env node

const path = require('path');
const validate = require('../lib/index');
const extensionDescriptor = require(path.resolve('extension.json'));
const result = validate(extensionDescriptor);

if (result) {
  console.error(`The extension appears to be malformed: ${result}`);
  process.exitCode = 1;
} else {
  console.log('The extension appears to be well-formed.');
}

