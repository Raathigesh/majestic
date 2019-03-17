export function debugLog(...args: any) {
  if (process.env.DEBUG_LOG) {
    console.log(...args);
  }
}

export function executeAndLog(message: string, execute: () => any) {
  if (process.env.DEBUG_LOG) {
    console.log(message, execute());
  }
}
