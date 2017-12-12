import { TestReconcilationState } from "jest-editor-support";

export function getStatusLabel(status: TestReconcilationState) {
  if (status === "Unknown") {
    return "Executing";
  } else if (status === "KnownSuccess") {
    return "Success";
  } else if (status === "KnownSkip") {
    return "Skipped";
  } else if (status === "KnownFail") {
    return "Failed";
  } else if (status === "") {
    return "";
  }

  return null;
}
