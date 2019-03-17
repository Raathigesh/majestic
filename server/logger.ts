export function debugLog(...args: any) {
  if (process.env.DEBUG_LOG) {
    console.log(...args);
  }
}
