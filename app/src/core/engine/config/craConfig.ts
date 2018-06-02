const { normalize } = require('jest-config');
import { Config } from '../types/Config';

export default function getConfig(rootPath: string): Config {
  return {
    jest: normalize(
      {
        rootDir: rootPath,
        testMatch: [
          '<rootDir>/src/**/__tests__/**/*.{js,jsx,mjs}',
          '<rootDir>/src/**/?(*.)(spec|test).{js,jsx,mjs}'
        ]
      },
      {}
    ).options,
    jestScript: '/node_modules/react-scripts/scripts/test.js',
    args: ['--env=jsdom'],
    env: {
      CI: 'true'
    }
  };
}
