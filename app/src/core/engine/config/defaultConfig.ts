const { readConfig } = require('jest-config');
import { Config } from '../types/Config';
import { resolveJestCliPath } from './util';

export default function getConfig(rootPath: string): Config {
  return {
    jest: {
      ...readConfig({}, rootPath).projectConfig
    },
    jestScript: resolveJestCliPath(rootPath, 'jest', 'bin/jest.js')
  };
}
