module.exports = {
  testEnvironment: "jsdom",
  transform: {
    "^.+\\.(js|jsx|mjs)$": [
      "babel-jest",
      {
        presets: [
          [
            "@babel/preset-env",
            {
              targets: {
                node: "current",
              },
              modules: "auto",
            },
          ],
          "@babel/preset-react",
        ],
      },
    ],
  },
  moduleNameMapper: {
    "\\.(css|less|scss|sass|styl)$": "<rootDir>/test/mocks/styleMock.js",
  },
  setupFilesAfterEnv: ["<rootDir>/test/setup.js"],
  coverageDirectory: "./coverage",
  collectCoverageFrom: [
    "src/**/*.{js,jsx}",
    "!src/**/*.test.{js,jsx}",
    "!src/test/**/*.{js,jsx}",
  ],
  coverageReporters: ["lcov", "text-summary"],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
  testMatch: ["<rootDir>/test/unit/**/*.spec.js"],
  testTimeout: 10000,
  transformIgnorePatterns: [
    "node_modules/(?!(@adobe|@react-spectrum|@spectrum-icons)/)",
  ],
  verbose: true,
  clearMocks: true,
  resetMocks: true,
  restoreMocks: true,
};
