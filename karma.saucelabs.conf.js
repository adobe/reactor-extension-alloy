const karmaSauceLauncher = require("karma-sauce-launcher");

const karmaConfig = require("./karma.conf");

module.exports = config => {
  karmaConfig(config);
  const customLaunchers = {
    sl_chromeW3C: {
      base: "SauceLabs",
      browserName: "chrome",
      browserVersion: "latest",
      "sauce:options": {
        tags: ["w3c-chrome"]
      }
    },
    sl_firefoxW3C: {
      base: "SauceLabs",
      browserName: "firefox",
      browserVersion: "latest",
      "sauce:options": {
        tags: ["w3c-firefox"]
      }
    },
    sl_safariW3C: {
      base: "SauceLabs",
      browserName: "safari",
      browserVersion: "latest",
      platform: "macOS 11.00"
    }
  };

  config.set({
    browsers: Object.keys(customLaunchers),
    customLaunchers,

    plugins: [
      "karma-jasmine",
      "karma-coverage",
      "karma-jasmine-matchers",
      "karma-spec-reporter",
      "karma-rollup-preprocessor",
      karmaSauceLauncher
    ],

    reporters: ["dots", "saucelabs"]
  });
};
