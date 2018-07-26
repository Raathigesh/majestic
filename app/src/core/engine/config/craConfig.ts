const { normalize } = require('jest-config');
import { Config } from '../types/Config';
import { resolveJestCliPath } from './util';

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
    jestScript: resolveJestCliPath('react-scripts', 'scripts/test.js'),
    args: ['--env=jsdom'],
    env: {
      CI: 'true'
    }
  };
}
