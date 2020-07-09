module.exports = {
  extends: ['eslint:recommended', 'prettier'], // extending recommended config and config derived from eslint-config-prettier
  plugins: ['prettier'], // activating esling-plugin-prettier (--fix stuff)
  parserOptions: {
    ecmaVersion: 2017
  },

  env: {
    es6: true,
    jest: true,
    node: true
  },
  rules: {
    'prettier/prettier': [
      // customizing prettier rules (unfortunately not many of them are customizable)
      'error',
      {
        singleQuote: true,
        trailingComma: 'none'
      }
    ],
    eqeqeq: ['error', 'always'] // adding some custom ESLint rules
  }
};
