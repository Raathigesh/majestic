import { observable } from 'mobx';

export default class CoverageSummary {
  @observable statementPercentage: number;
  @observable linePercentage: number;
  @observable functionPercentage: number;
  @observable branchesPercentage: number;
}
