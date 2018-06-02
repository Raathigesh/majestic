const { readConfig } = require('jest-config');
import { Config } from '../types/Config';

export default function getConfig(rootPath: string): Config {
  return {
    jest: {
      ...readConfig({}, rootPath).projectConfig
    },
    jestScript: '/node_modules/jest-cli/bin/jest.js'
  };
}
