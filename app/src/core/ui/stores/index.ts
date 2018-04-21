import workspace from './Workspace';
import debug from './Debugger';
import tests from './Tests';
import searcher from './Searcher';

export { Workspace } from './Workspace';
export { Debugger } from './Debugger';
export { Tests } from './Tests';
export { Searcher } from './Searcher';
export { default as Node } from './Node';

const stores = {
  workspace,
  debug,
  tests,
  searcher
};

export default stores;
