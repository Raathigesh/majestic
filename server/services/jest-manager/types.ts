export interface JestConfigObj {
  testMatch: string[];
  testRegex?: string[] | string;
}
export interface JestConfig {
  configs?: JestConfigObj[];
  config?: JestConfigObj;
}
