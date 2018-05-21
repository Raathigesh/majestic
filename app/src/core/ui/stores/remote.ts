import register from '../../portal/client';
import { Subject } from 'rxjs';
import { FileNode } from '../../engine/types/FileNode';

interface FileChangeArg {
  file: string;
  itBlocks: any;
}
export const fileChangeStream$ = new Subject<FileChangeArg>();

interface FileOpArg {
  path: string;
  files: FileNode[];
}
export const fileAddStream$ = new Subject<FileOpArg>();
export const fileDeleteStream$ = new Subject<FileOpArg>();
export const debuggerExitStream$ = new Subject();

interface RemoteMethods {
  getFiles(): any;
  run(watch: boolean, testFile?: string, testName?: string): any;
  stop(): any;
  filterFileInWatch(fileName: string): any;
  filterTestInWatch(fileName: string, testName: string): any;
  updateSnapshot(fileName: string, testName: string): any;
  launchInEditor(fileName: string, lineNumber: number): any;
  startDebugging(fileName: string, testName: string): any;
  getConfig(): any;
  setConfig(nodePath: string): any;
  getVersion(): any;
  getLatestVersion(): any;
  getDebugInfo(): {
    rootPath: string;
    jestExecuablePath: string;
  };
}

const remoteInterface = new Promise<RemoteMethods>(resolve => {
  register(
    'ui',
    {
      onFileChange: (file: string, itBlocks: any) => {
        fileChangeStream$.next({
          file,
          itBlocks
        });
        return JSON.stringify({});
      },
      onFileAdd: (path: string, files: FileNode[]) => {
        fileAddStream$.next({
          path,
          files
        });
        return JSON.stringify({});
      },
      onFileDelete: (path: string, files: FileNode[]) => {
        fileDeleteStream$.next({
          path,
          files
        });
        return JSON.stringify({});
      },
      onDebuggerExit: () => {
        debuggerExitStream$.next();
        return JSON.stringify({});
      }
    },
    (remote: any) => {
      resolve(remote);
    }
  );
});

export default remoteInterface;
