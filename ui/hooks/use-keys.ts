import { useEffect, useState } from "react";

export default function useKeys() {
  const [keys, setKeys] = useState(new Map());

  function downHandler({ key }:KeyboardEvent) {
    keys.set(key, true);
    setKeys(keys);
  }

  const upHandler = ({ key }:KeyboardEvent) => {
    keys.delete(key);
    setKeys(keys);
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
