import { TreeMap } from "./types";
import { spawnSync } from "child_process";
import { sep, join, extname } from "path";
import { createLogger } from "../logger";

const log = createLogger("Project");

export default class Project {
  public projectRoot: string;

  constructor(root: string) {
    this.projectRoot = root;
  }

  getFilesList(jestScriptPath: string) {
    const configProcess = spawnSync(
      "node",
      [jestScriptPath, "--listTests", "--json"],
      {
        cwd: this.projectRoot,
        shell: true,
        stdio: "pipe",
        env: {
          CI: "true",
          ...process.env
        }
      }
    );

    const filesStr = configProcess.stdout.toString().trim();
    const files: string[] = JSON.parse(filesStr);
    log("Ideitifed test files: ", files);

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
      let parrentPath = "";
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
            parent: join(this.projectRoot, parrentPath)
          };
        }
        parrentPath = currentPath;
      });
    });

    return map;
  }
}
