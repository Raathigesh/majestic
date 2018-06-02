export interface Config {
  jest: {
    rootDir: string;
    roots?: string[];
    testMatch?: string[];
    testRegex?: string;
    setupFiles?: string[];
    modulePathIgnorePatterns?: string[];
    testPathIgnorePatterns?: string[];
  };
  jestScript: string;
  args?: string[];
  env?: any;
}
