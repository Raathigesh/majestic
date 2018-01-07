import { remote } from "electron";

export function openProjectFolder() {
  return new Promise<string[]>((resolve, reject) => {
    remote.dialog.showOpenDialog(
      {
        properties: ["openDirectory"]
      },
      directories => {
        if (directories && directories.length > 0) {
          resolve(directories);
        } else {
          reject();
        }
      }
    );
  });
}
