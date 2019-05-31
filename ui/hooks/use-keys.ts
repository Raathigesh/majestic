import { useEffect, useState } from "react";

export function hasKeys(expectedKeys: string[], pressedKeys: Map<String, boolean> ) {
  return expectedKeys.every(k => pressedKeys.has(k));
};

export default function useKeys() {
  const [keys, setKeys] = useState(new Map());
  const hotKeys = ["Alt", "Enter", "Escape", "s", "t", "w"];

  function downHandler({ key }:KeyboardEvent) {
    // only update state for keys we are watching
    if (hotKeys.includes(key)) {
      keys.set(key, true);
      // create a new Map object to guarantee that state updates
      setKeys(new Map(keys));
    }
  }

  const upHandler = ({ key }:KeyboardEvent) => {
    if (hotKeys.includes(key)) {
      keys.delete(key);
      setKeys(new Map(keys));
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", downHandler);
    window.addEventListener("keyup", upHandler);
    return () => {
      window.removeEventListener("keydown", downHandler);
      window.removeEventListener("keyup", upHandler);
    };
  }, []);

  return keys;
}
