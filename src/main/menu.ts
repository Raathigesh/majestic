import { app, Menu, shell, BrowserWindow } from "electron";

export default class MenuBuilder {
  mainWindow: BrowserWindow;
  constructor(mainWindow) {
    this.mainWindow = mainWindow;
  }

  buildMenu() {
    let template;

    if (process.platform === "darwin") {
      template = this.buildDarwinTemplate();
    } else {
      template = this.buildDefaultTemplate();
    }

    const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);

    return menu;
  }

  buildDarwinTemplate() {
    const EditMenu = {
      label: "Edit",
      submenu: [
        { label: "Undo", accelerator: "CmdOrCtrl+Z", selector: "undo:" },
        { label: "Redo", accelerator: "Shift+CmdOrCtrl+Z", selector: "redo:" },
        { type: "separator" },
        { label: "Cut", accelerator: "CmdOrCtrl+X", selector: "cut:" },
        { label: "Copy", accelerator: "CmdOrCtrl+C", selector: "copy:" },
        { label: "Paste", accelerator: "CmdOrCtrl+V", selector: "paste:" },
        {
          label: "Select All",
          accelerator: "CmdOrCtrl+A",
          selector: "selectAll:"
        },
        {
          label: "Quit",
          accelerator: "Command+Q",
          click: () => {
            app.quit();
          }
        }
      ]
    };

    return [EditMenu, this.buildDefaultTemplate()];
  }

  buildDefaultTemplate() {
    const helpTemplate = {
      label: "Help",
      submenu: [
        {
          label: "Open dev tools",
          click: () => {
            this.mainWindow.webContents.openDevTools();
          }
        },
        {
          label: "Documentation",
          click() {
            shell.openExternal("https://github.com/Raathigesh/majestic");
          }
        },
        {
          label: "Report an Issues",
          click() {
            shell.openExternal("https://github.com/Raathigesh/majestic/issues");
          }
        }
      ]
    };

    return helpTemplate;
  }
}
