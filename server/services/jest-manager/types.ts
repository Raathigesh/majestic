export interface JestConfig {
  configs: {
    testMatch: string[];
    testRegex?: string[] | string;
  }[];
}
