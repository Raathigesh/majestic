module.exports = {
  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest/preprocessor"
  },
  testPathIgnorePatterns: ["/node_modules/", "/dist/", "<rootDir>/coverage/"],
  moduleFileExtensions: ["js", "ts", "tsx", "json"],
  testMatch: ["**/*.test.ts", "**/*.test.tsx"],
  snapshotSerializers: ["enzyme-to-json/serializer"],
  setupFiles: ["<rootDir>/test_config/jestSetup.ts"]
};
