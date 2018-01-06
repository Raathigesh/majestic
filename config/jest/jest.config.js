const path = require('path');
module.exports = Object.assign({}, require('./common'), {
  displayName: 'test',
  collectCoverage: true,
  mapCoverage: true,
  coverageReporters: ['html'],
  testMatch: ['**/*.test.ts', '**/*.test.tsx', '**/*.test.js', '**/*.test.jsx'],
  snapshotSerializers: ['enzyme-to-json/serializer'],
  setupFiles: ['./config/jest/jestSetup.js'],
  rootDir: path.resolve(__dirname, '../../'),
});
