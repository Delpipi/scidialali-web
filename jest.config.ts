// jest.config.js
const nextJest = require("next/jest");
const createJestConfig = nextJest({ dir: "./" });

const config = {
  testEnvironment: "jsdom",

  // IMPORTANT : setupFiles charge AVANT tout le reste
  setupFiles: ["<rootDir>/jest.polyfills.js"],

  // setupFilesAfterEnv charge APRÈS les polyfills (ex: @testing-library/jest-dom)
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],

  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
    "\\.(css|less|scss|sass)$": "identity-obj-proxy",
    "\\.(jpg|jpeg|png|gif|webp|svg)$": "identity-obj-proxy",
  },
};

module.exports = createJestConfig(config);
