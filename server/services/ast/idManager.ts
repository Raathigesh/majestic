// This file manages a cache of Ids. The purpose for this cache in Majestic is to 
// maintain consistent ids for test and describe blocks that do not change name between
// file reloads. By maintaining consistent Ids for the same blocks, we can do things in 
// the UI like persistent open/collapse state
//
// How this works: Each describe block within a file and the file itself gets its own IdManager
// The IdManager maintains the list of Ids for that block. These could be Ids of other describe
// blocks, or they could be Ids of the tests themselves. The IdManager is also responsible for
// handing out the ids so that it can then associate the Id with the object.
//
// managing the IdManagers is done with the IdManagerFactory. It keeps a cache of the IdManagers
// and you can lookup/create an IdManager based on an Id or file path.
//
// How to use these classes:
//
// When loading in a file, call IdManagerFactory.getManagerForFile with the file's full path
// this will return an IdManger to use for the file. Set this as the current IdManager
//
// when finding a describe block, cal IdManagerFactory.getManagerForBlock with the Id of the 
// describe block, this becomes the current IdManager for everythign in the describe block
//
// when finding any type of block and we need an Id for it, we call currentManager.createId
// it will return the proper Id to use for that element, either an existing one or a new one

import * as nanoid from "nanoid";

interface IdEntry {
  name: string;
  id: string;
}

export class IdManager {
  private ids: IdEntry[]
  constructor() {
    this.ids = [];
  }

  public createId(name: string): string {
    for(let e of this.ids) {
        if (e.name === name) {
          return e.id;
        }
    }
    // name was not found in the list of Ids so create it
    let newId = {
      name,
      id: nanoid()
    };
    this.ids.push(newId);
    return newId.id;
  }
}

interface FileManagerEntry {
  filePath: string;
  idManager: IdManager;
}
export class IdManagerFactory {
  static describeManagers: {key: string};
  static fileManagers: FileManagerEntry[];

  static init() {
    IdManagerFactory.describeManagers = {} as {key: string};
    IdManagerFactory.fileManagers = [];
  }

  static getManagerForBlock(id: string): IdManager {
    let existingManager = IdManagerFactory.describeManagers[id];
    if (existingManager === undefined) {
      existingManager = new IdManager();
      IdManagerFactory.describeManagers[id] = existingManager;
    }
    return existingManager;
  }
  static getManagerForFile(filePath: string): IdManager {
    for(let e of IdManagerFactory.fileManagers) {
      if (e.filePath === filePath) return e.idManager;
    }
    let newManager = {
      filePath,
      idManager: new IdManager()
    };
    IdManagerFactory.fileManagers.push(newManager);
    return newManager.idManager;
  }
}

IdManagerFactory.init();
