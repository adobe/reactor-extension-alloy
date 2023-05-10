/*
Copyright 2023 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
*/ module.exports = {
  extends: [
    "airbnb",
    "prettier",
    "prettier/react",
    "plugin:testcafe/recommended"
  ],
  env: {
    browser: true,
    node: true,
    jasmine: true
  },
  plugins: ["unused-imports", "ban", "prettier", "testcafe"],
  rules: {
    "unused-imports/no-unused-imports": "error",
    "unused-imports/no-unused-vars": "error",
    "ban/ban": [
      "error",
      { name: ["describe", "only"], message: "don't focus tests" },
      { name: "fdescribe", message: "don't focus tests" },
      { name: ["it", "only"], message: "don't focus tests" },
      { name: "fit", message: "don't focus tests" },
      { name: ["fixture", "only"], message: "don't focus tests" },
      { name: ["test", "only"], message: "don't focus tests" },
      { name: "ftest", message: "don't focus tests" }
    ],
    "no-param-reassign": "off",
    "prettier/prettier": "error",
    "react/require-default-props": "off",
    "react/no-array-index-key": "off",
    "react/forbid-prop-types": "off",
    "jsx-a11y/label-has-associated-control": [
      2,
      {
        controlComponents: ["WrappedField"]
      }
    ],
    // Has been deprecated in favor of label-has-associated-control
    "jsx-a11y/label-has-for": "off",
    // Turning this off allows us to import devDependencies in our build tools.
    // We enable the rule in src/.eslintrc.js since that's the only place we
    // want to disallow importing extraneous dependencies.
    "import/no-extraneous-dependencies": "off",
    "prefer-destructuring": "off",
    "import/prefer-default-export": "off",
    "no-console": [
      "warn",
      {
        allow: ["error"]
      }
    ],
    // This rule typically shows an error if a Link component
    // doesn't have an href. We use React-Spectrum's Link
    // component, however, which doesn't have an href prop
    // (Link expects a anchor element as a child). We have
    // to provide an empty components array here to get around
    // eslint complaining about this. eslint still checks
    // anchor elements though.
    "jsx-a11y/anchor-is-valid": [
      "error",
      {
        components: []
      }
    ]
  },
  parser: "babel-eslint"
};
