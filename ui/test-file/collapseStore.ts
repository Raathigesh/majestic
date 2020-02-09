// This static class keeps track of the collapse state of every describe block that is shown in the UI.
// It starts empty and grows with each describe block that the user collapses or expands. 
// If a describe block has never been collapsed it does not have an entry in the strucure and isCollapsed will
// always return false. This allows us to get away with an empty structure to start with.
// If we ever add Redux to the product, then this can move into Redux

export class CollapseStore {
  static store: {[key: string]: boolean}

  static init() {
    CollapseStore.store = {} as {[key: string]: boolean};
  }

  static isCollapsed(id: string): boolean {
    return CollapseStore.store[id] === true;
  }

  static setState(id: string, state: boolean) {
    CollapseStore.store[id] = state;
  }
}

// Create the global instance of the store.
CollapseStore.init();