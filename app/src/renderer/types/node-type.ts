import { TestReconcilationState } from "jest-editor-support";

type TreeNodeType = "file" | "directory";
export type InternalTestReconcilationState = TestReconcilationState | "";
export default TreeNodeType;
