import { TreeMap, MajesticConfig } from "./types";
import { spawnSync } from "child_process";
import { sep, join, extname, normalize } from "path";
import { createLogger } from "../logger";

const log = createLogger("Project");

export default class Project {
  public projectRoot: string;

  constructor(root: string) {
    this.projectRoot = normalize(root);
  }

  getFilesList(config: MajesticConfig) {
    const configProcess = spawnSync(
      "node",
      [config.jestScriptPath, ...(config.args || []), "--listTests", "--json"],
      {
        cwd: this.projectRoot,
        shell: true,
        stdio: "pipe",
        env: {
          CI: "true",
          ...(config.env || {}),
          ...process.env
        }
      }
    );

    const filesStr = configProcess.stdout.toString().trim();
    const files: string[] = JSON.parse(filesStr);
    log("Identified test files: ", files);

    const relativeFiles = files.map(file => file.replace(this.projectRoot, ""));
    const map: TreeMap = {
      "/": {
        name: this.projectRoot.split(sep).pop() || "",
        type: "directory",
        path: this.projectRoot,
        parent: undefined
      }
    };

    relativeFiles.forEach(path => {
      const tokens = path.split(sep).filter(token => token.trim() !== "");
      let currentPath = "";
      let parentPath = "";
      tokens.forEach((token, i) => {
        currentPath = `${currentPath}${sep}${token}`;
        const type = [".jsx", ".tsx", ".ts", ".js"].includes(
          extname(currentPath)
        )
          ? "file"
          : "directory";
        if (!map[currentPath]) {
          map[currentPath] = {
            name: token,
            type,
            path: join(this.projectRoot, currentPath),
            parent: join(this.projectRoot, parentPath)
          };
        }
        parentPath = currentPath;
      });
    });

    return map;
  }
}
