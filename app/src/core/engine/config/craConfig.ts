import { Config } from '../types/Config';

export default function getConfig(): Config {
  return {
    testMatch: [
      '<rootDir>/src/**/__tests__/**/*.{js,jsx,mjs}',
      '<rootDir>/src/**/?(*.)(spec|test).{js,jsx,mjs}'
    ],
    jestScript: '/node_modules/react-scripts/scripts/test.js',
    args: ['--env=jsdom'],
    env: {
      CI: 'true'
    }
  };
}
