export interface Config {
  testMatch?: string[];
  testRegex?: string;
  jestScript: string;
  args?: string[];
  env?: any;
  setupFiles?: string[];
  modulePathIgnorePatterns?: string[];
}
