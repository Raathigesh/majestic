import { observable, IObservableArray, computed } from 'mobx';
const fuzzysearch = require('fuzzysearch');
import Node from './Node';
import Workspace from './Workspace';

export default class Searcher {
  @observable public query: string = '';
  @observable public results: IObservableArray<Node> = observable([]);

  workspace: Workspace;

  constructor(engine: Workspace) {
    this.workspace = engine;
  }

  @computed
  public get isSearching() {
    return this.query !== '';
  }

  setQuery(query: string) {
    this.query = query;
    this.results.clear();

    if (this.query === '') {
      return;
    }

    this.workspace.tests.flatNodeMap.forEach((node, path) => {
      if (fuzzysearch(this.query, path) && node.type === 'file') {
        this.results.push(node);
      }
    });
  }
}
