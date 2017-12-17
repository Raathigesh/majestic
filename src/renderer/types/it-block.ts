import { TestReconcilationState } from "jest-editor-support";
import { ItBlock } from "jest-editor-support";

export type SnapshotErrorStatus = "" | "unknown" | "error" | "updated";

interface ItBlockWithStatus extends ItBlock {
  status: TestReconcilationState;
  assertionMessage?: string;
  isExecuting: boolean;
  snapshotErrorStatus: SnapshotErrorStatus;
  updatingSnapshot: boolean;
}

export default ItBlockWithStatus;
