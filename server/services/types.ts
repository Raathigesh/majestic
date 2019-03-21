export interface DirectoryItem {
  name: string;
  path: string;
  type: "directory" | "file";
  children?: DirectoryItem[];
}

export interface TreeMap {
  [path: string]: {
    name: string;
    path: string;
    parent?: string;
    type: "directory" | "file";
  };
}

export interface MajesticConfig {
  jestScriptPath: string;
  args?: string[];
  env?: { [key: string]: string };
}
