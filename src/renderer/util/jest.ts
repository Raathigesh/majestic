export async function executeInSequence(
  funcs: {
    fn: () => void;
    delay: number;
  }[]
) {
  for (let i = 0; i < funcs.length; i++) {
    await setTimeoutPromisify(funcs[i].fn, funcs[i].delay);
  }
}

function setTimeoutPromisify(fn: () => void, delay) {
  return new Promise(resolve => {
    setTimeout(() => {
      fn();
      resolve();
    }, delay);
  });
}
