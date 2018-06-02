const { normalize } = require('jest-config');
import { Config } from '../types/Config';

export default function getConfig(rootPath: string, rawConfig: any): Config {
  return {
    ...rawConfig,
    jest: normalize(
      {
        rootDir: rootPath,
        ...rawConfig.jest
      },
      {}
    ).options
  };
}
