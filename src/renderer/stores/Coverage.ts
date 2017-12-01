import { createSourceMapStore } from "istanbul-lib-source-maps";
import { createCoverageMap, CoverageMap } from "istanbul-lib-coverage";
import { FileCoverage } from "./TreeNode";

export class Coverage {
  private rootPath: string;
  private sourceMapStore;
  private transformedCoverageMap: CoverageMap;

  constructor(rootPath: string) {
    this.rootPath = rootPath;
    this.sourceMapStore = createSourceMapStore();
    this.transformedCoverageMap = createCoverageMap();
  }

  public mapCoverage(data) {
    const cm = createCoverageMap(data);
    const transformed = this.sourceMapStore.transformCoverage(cm);
    this.transformedCoverageMap = transformed.map;
  }

  public getCoverageForFile(file: string) {
    try {
      return this.transformedCoverageMap.fileCoverageFor(file);
    } catch (e) {
      return null;
    }
  }

  public getSummary(): FileCoverage {
    const summary = (this.transformedCoverageMap as any).getCoverageSummary();

    return {
      branchesPercentage: summary.branches.pct,
      functionPercentage: summary.functions.pct,
      linePercentage: summary.lines.pct,
      statementPercentage: summary.statements.pct
    };
  }
}
