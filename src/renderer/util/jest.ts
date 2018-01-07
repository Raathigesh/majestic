import { replacePathSepForRegex } from "jest-regex-util";
import { platform } from "os";
import path from "path";
import fs from "fs";
import * as micromatch from "micromatch";

export async function executeInSequence(
  funcs: Array<{
    fn: () => void;
    delay: number;
  }>
) {
  for (const { fn, delay } of funcs) {
    await setTimeoutPromisify(fn, delay);
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

const globsToMatcher = globs => {
  if (globs == null || globs.length === 0) {
    return () => true;
  }

  const matchers = globs.map(each => micromatch.matcher(each, { dot: true }));
  return value => matchers.some(each => each(value));
};

const pathToRegex = p => replacePathSepForRegex(p);
const regexToMatcher = (testRegex: string) => {
  if (!testRegex) {
    return () => true;
  }

  const regex = new RegExp(pathToRegex(testRegex));
  return value => regex.test(value);
};

export function getTestPatterns(config) {
  let matcher: (path: string) => any = () => {};

  if (config.testMatch) {
    matcher = globsToMatcher(config.testMatch);
  } else if (config.testRegex) {
    matcher = regexToMatcher(config.testRegex);
  }

  return matcher;
}

export function getTestPatternForPath(filePath: string) {
  let replacePattern = /\//g;

  if (platform() === "win32") {
    replacePattern = /\\/g;
  }

  return filePath.replace(replacePattern, ".");
}

export function resolvePathToJestBin(root: string, pathToJest: string) {
  let jest = pathToJest;
  if (!path.isAbsolute(jest)) {
    jest = path.join(root, jest);
  }

  const basename = path.basename(jest);
  switch (basename) {
    case "jest.js": {
      return jest;
    }

    case "jest.cmd": {
      /* i need to extract '..\jest-cli\bin\jest.js' from line 2

      @IF EXIST "%~dp0\node.exe" (
        "%~dp0\node.exe"  "%~dp0\..\jest-cli\bin\jest.js" %*
      ) ELSE (
        @SETLOCAL
        @SET PATHEXT=%PATHEXT:;.JS;=;%
        node  "%~dp0\..\jest-cli\bin\jest.js" %*
      )
      */
      const line = fs.readFileSync(jest, "utf8").split("\n")[1];
      const match = /^\s*"[^"]+"\s+"%~dp0\\([^"]+)"/.exec(line);
      return path.join(path.dirname(jest), match[1]);
    }

    case "jest": {
      /* file without extension uses first line as file type
         in case of node script i can use this file directly,
         in case of linux shell script i need to extract path from line 9
      #!/bin/sh
      basedir=$(dirname "$(echo "$0" | sed -e 's,\\,/,g')")

      case `uname` in
          *CYGWIN*) basedir=`cygpath -w "$basedir"`;;
      esac

      if [ -x "$basedir/node" ]; then
        "$basedir/node"  "$basedir/../jest-cli/bin/jest.js" "$@"
        ret=$?
      else
        node  "$basedir/../jest-cli/bin/jest.js" "$@"
        ret=$?
      fi
      exit $ret
      */
      const lines = fs.readFileSync(jest, "utf8").split("\n");
      switch (lines[0]) {
        case "#!/usr/bin/env node": {
          return jest;
        }

        case "#!/bin/sh": {
          const line = lines[8];
          const match = /^\s*"[^"]+"\s+"$basedir\/([^"]+)"/.exec(line);
          if (match) {
            return path.join(path.dirname(jest), match[1]);
          }

          break;
        }
      }

      break;
    }
  }

  return undefined;
}
