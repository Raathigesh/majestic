import { observable, computed } from 'mobx';
import { createSourceMapStore, MapStore } from 'istanbul-lib-source-maps';
import { createCoverageMap, CoverageMap } from 'istanbul-lib-coverage';

export default class CoverageSummary {
  @observable statementPercentage: number = 0;
  @observable linePercentage: number = 0;
  @observable functionPercentage: number = 0;
  @observable branchesPercentage: number = 0;

  private sourceMapStore: MapStore;
  private transformedCoverageMap: CoverageMap;

  constructor() {
    this.sourceMapStore = createSourceMapStore();
    this.transformedCoverageMap = createCoverageMap();
  }

  public mapCoverage(data: any) {
    const cm = createCoverageMap(data);
    const transformed = this.sourceMapStore.transformCoverage(cm);
    this.transformedCoverageMap = transformed.map;
    this.getSummary();
  }

  public getSummary() {
    const summary = (this.transformedCoverageMap as any).getCoverageSummary();

    this.statementPercentage = summary.statements.pct;
    this.linePercentage = summary.lines.pct;
    this.functionPercentage = summary.functions.pct;
    this.branchesPercentage = summary.branches.pct;
  }

  @computed
  public get isCoverageAvailable() {
    return (
      this.statementPercentage &&
      this.linePercentage &&
      this.functionPercentage &&
      this.branchesPercentage
    );
  }
}
