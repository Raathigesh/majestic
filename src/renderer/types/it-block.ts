import { TestReconcilationState } from "jest-editor-support";
import { ItBlock } from "jest-editor-support";
import { observable, autorun } from "mobx";

export type SnapshotErrorStatus = "" | "unknown" | "error" | "updated";

class ItBlockWithStatus extends ItBlock {
  @observable status: TestReconcilationState = "";
  @observable assertionMessage?: string = "";
  @observable isExecuting: boolean;
  @observable snapshotErrorStatus?: SnapshotErrorStatus = "unknown";
  @observable updatingSnapshot?: boolean = false;
  @observable filePath?: string;
  @observable active?: boolean = false;

  // location of the it statement in the source file
  @observable lineNumber: number = 0;

  constructor() {
    super();

    autorun(() => {
      if (this.active) {
        setTimeout(() => {
          this.active = false;
        }, 5000);
      }
    });
  }
}

export default ItBlockWithStatus;
