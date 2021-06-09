module.exports = {
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
  plugins: ["ban", "prettier", "testcafe"],
  rules: {
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
    ]
  },
  parser: "babel-eslint"
};
