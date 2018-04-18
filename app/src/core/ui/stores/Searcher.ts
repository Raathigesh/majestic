import { observable, IObservableArray, computed } from 'mobx';
const fuzzysearch = require('fuzzysearch');
import Node from './Node';

export class Searcher {
  @observable public query: string = '';
  @observable public results: IObservableArray<Node> = observable([]);

  @computed
  public get isSearching() {
    return this.query !== '';
  }

  setQuery(files: any, query: string) {
    this.query = query;
    this.results.clear();

    if (this.query === '') {
      return;
    }

    files.forEach((node: any, path: any) => {
      if (fuzzysearch(this.query, path) && node.type === 'file') {
        this.results.push(node);
      }
    });
  }
}

export default new Searcher();
