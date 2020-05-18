import { createSourceMapStore, MapStore } from "istanbul-lib-source-maps";
import { createCoverageMap, CoverageMap } from "istanbul-lib-coverage";
import { existsSync } from "fs";
import { join } from "path";
import { MajesticConfig } from "./types";
import { spawnSync } from "child_process";
import { createLogger } from "../logger";
import { TestFileResult } from "../api/workspace/test-result/file-result";

const log = createLogger("Results");

export type TestFileStatus = "IDLE" | "EXECUTING";
export interface CoverageSummary {
  statement: number;
  line: number;
  function: number;
  branch: number;
}
export default class Results {
  private projectRoot: string = "";
  private results: {
    [path: string]: TestFileResult;
  } = {};

  private testStatus: {
    [path: string]: {
      isExecuting: boolean;
      containsFailure: boolean;
    };
  } = {};

  private summary: {
    numFailedTests: number;
    numPassedTests: number;
    numPassedTestSuites: number;
    numFailedTestSuites: number;
  };

  private coverage: CoverageSummary = {
    statement: 0,
    line: 0,
    function: 0,
    branch: 0
  };

  private haveCoverageReport: boolean = false;

  public coverageFilePath: string = "";
  public coverageDirectory: string = "";

  constructor(projectRoot: string) {
    this.projectRoot = projectRoot;
    this.results = {};
    this.summary = {
      numFailedTests: 0,
      numPassedTests: 0,
      numPassedTestSuites: 0,
      numFailedTestSuites: 0
    };

    this.checkIfCoverageReportExists();
  }

  public setTestStart(path: string) {
    if (!this.testStatus[path]) {
      this.testStatus[path] = {
        isExecuting: false,
        containsFailure: false
      };
    }
    this.testStatus[path].isExecuting = true;
  }

  public setTestReport(path: string, report: any) {
    this.results[path] = report;
    this.testStatus[path].isExecuting = false;

    if (report.numFailingTests > 0) {
      this.testStatus[path].containsFailure = true;
    } else {
      this.testStatus[path].containsFailure = false;
    }
  }

  public getResult(path: string): TestFileResult | null {
    return this.results[path] || null;
  }

  public setSummary(
    passedTests: number,
    failedTests: number,
    numPassedTestSuites: number,
    numFailedTestSuites: number
  ) {
    this.summary = {
      numFailedTests: failedTests,
      numPassedTests: passedTests,
      numPassedTestSuites,
      numFailedTestSuites
    };
  }

  public markExecutingAsStopped() {
    this.testStatus = Object.entries(this.testStatus).reduce(
      (acc, [key, value]) => ({
        [key]: {
          ...value,
          isExecuting: false
        },
        ...acc
      }),
      {}
    );
  }

  public getSummary() {
    return this.summary;
  }

  public getFailedTests() {
    return Object.entries(this.testStatus)
      .filter(([path, status]) => {
        return status.containsFailure;
      })
      .map(([path]) => path);
  }

  public getPassedTests() {
    return Object.entries(this.testStatus)
      .filter(([path, status]) => {
        return !status.containsFailure && !status.isExecuting;
      })
      .map(([path]) => path);
  }

  public getExecutingTests() {
    return Object.entries(this.testStatus)
      .filter(([path, status]) => {
        return status.isExecuting === true;
      })
      .map(([path]) => path);
  }

  public mapCoverage(data: any) {
    if (!data) {
      this.coverage = {
        statement: 0,
        branch: 0,
        function: 0,
        line: 0
      };

      return;
    }

    const sourceMapStore = createSourceMapStore();
    const coverageMap = createCoverageMap(data);
    const transformed = sourceMapStore.transformCoverage(coverageMap);
    const coverageSummary = transformed.map.getCoverageSummary();

    const statementCoverage = coverageSummary.statements.pct as any;
    const branchCoverage = coverageSummary.branches.pct as any;
    const functionCoverage = coverageSummary.functions.pct as any;
    const lineCoverage = coverageSummary.lines.pct as any;

    this.coverage = {
      statement: statementCoverage === "Unknown" ? 0 : statementCoverage,
      branch: branchCoverage === "Unknown" ? 0 : branchCoverage,
      function: functionCoverage === "Unknown" ? 0 : functionCoverage,
      line: lineCoverage === "Unknown" ? 0 : lineCoverage
    };
  }

  public checkIfCoverageReportExists() {
    this.haveCoverageReport = existsSync(this.coverageFilePath);
    return this.haveCoverageReport;
  }

  public getCoverage() {
    return this.coverage;
  }

  public doesHaveCoverageReport() {
    return this.haveCoverageReport;
  }

  public getCoverageReportPath(config: MajesticConfig) {
    try {
      const configProcess = spawnSync(
        "node",
        [
          config.jestScriptPath,
          ...(config.args || []),
          "--showConfig",
          "--json"
        ],
        {
          cwd: this.projectRoot,
          shell: true,
          stdio: "pipe",
          env: {
            CI: "true",
            ...(config.env || {}),
            ...process.env
          }
        }
      );

      let filesStr = configProcess.stdout.toString().trim();
      if (filesStr === "") {
        filesStr = configProcess.stderr.toString().trim();
      }

      const defaultCoveragePath = join(this.projectRoot, "coverage");
      const jestConfig = JSON.parse(filesStr);
      this.coverageDirectory =
        (jestConfig.globalConfig &&
          jestConfig.globalConfig.coverageDirectory) ||
        defaultCoveragePath;
      this.coverageFilePath = join(
        this.coverageDirectory,
        "/lcov-report/index.html"
      );
    } catch (e) {
      log(
        `Error occured while obtaining Jest cofiguration for coverage report ${e.toString()}`
      );
    }
  }
}
