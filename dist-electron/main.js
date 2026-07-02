import { app, BrowserWindow, globalShortcut, ipcMain, Notification, shell, Tray, Menu } from "electron";
import path from "node:path";
import fs from "node:fs";
import os from "node:os";
import { exec } from "node:child_process";
process.env.DIST = path.join(__dirname, "../dist");
process.env.VITE_PUBLIC = app.isPackaged ? process.env.DIST : path.join(process.env.DIST, "../public");
let win;
let tray = null;
const VITE_DEV_SERVER_URL = process.env["VITE_DEV_SERVER_URL"];
const storePath = path.join(app.getPath("userData"), "dashboard-store.json");
function createWindow() {
  win = new BrowserWindow({
    icon: path.join(process.env.VITE_PUBLIC, "electron-vite.svg"),
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: false,
      contextIsolation: true
    },
    width: 1280,
    height: 800,
    minWidth: 1024,
    minHeight: 768,
    frame: false,
    // 无边框
    transparent: true,
    // 透明背景以实现圆角和毛玻璃
    vibrancy: "under-window",
    // macOS
    backgroundMaterial: "mica",
    // Windows 11
    autoHideMenuBar: true
  });
  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL);
  } else {
    win.loadFile(path.join(process.env.DIST, "index.html"));
  }
  win.on("minimize", (event) => {
    event.preventDefault();
    win == null ? void 0 : win.hide();
  });
}
function createTray() {
  const iconPath = path.join(process.env.VITE_PUBLIC, "electron-vite.svg");
  tray = new Tray(iconPath);
  const contextMenu = Menu.buildFromTemplate([
    { label: "显示看板", click: () => win == null ? void 0 : win.show() },
    { type: "separator" },
    { label: "退出", click: () => {
      app.exit();
    } }
  ]);
  tray.setToolTip("桌面数据看板");
  tray.setContextMenu(contextMenu);
  tray.on("click", () => {
    (win == null ? void 0 : win.isVisible()) ? win == null ? void 0 : win.hide() : win == null ? void 0 : win.show();
  });
}
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
    win = null;
  }
});
app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
app.whenReady().then(() => {
  createWindow();
  createTray();
  globalShortcut.register("Alt+Space", () => {
    if (win) {
      if (win.isVisible() && win.isFocused()) {
        win.hide();
      } else {
        win.show();
        win.focus();
      }
    }
  });
  ipcMain.on("window-control", (_, action) => {
    if (!win) return;
    if (action === "close") win.hide();
    if (action === "minimize") win.hide();
    if (action === "maximize") win.isMaximized() ? win.unmaximize() : win.maximize();
  });
  ipcMain.on("show-notification", (_, { title, body }) => {
    new Notification({ title, body, icon: path.join(process.env.VITE_PUBLIC, "electron-vite.svg") }).show();
  });
  ipcMain.handle("store-get", () => {
    try {
      if (fs.existsSync(storePath)) {
        return JSON.parse(fs.readFileSync(storePath, "utf-8"));
      }
    } catch (e) {
    }
    return null;
  });
  ipcMain.handle("store-set", (_, data) => {
    try {
      fs.writeFileSync(storePath, JSON.stringify(data));
      return true;
    } catch (e) {
      return false;
    }
  });
  ipcMain.handle("launch-app", async (_, appName) => {
    const appMap = {
      "Compass": "start msedge",
      "Mail": "start outlookmail:",
      "Calendar": "start outlookcal:",
      "MessageSquare": "start msteams:",
      "Book": "start notepad",
      "FileText": "start write",
      "Image": "start ms-photos:",
      "Music": "start mswindowsmusic:",
      "Video": "start mswindowsvideo:",
      "Camera": "start microsoft.windows.camera:",
      "Cloud": "start bingweather:",
      "Map": "start bingmaps:"
    };
    const cmd = appMap[appName];
    if (cmd) {
      exec(cmd, (error) => {
        if (error) console.error(`Failed to launch app ${appName}:`, error);
      });
    }
  });
  ipcMain.handle("create-file", async (event, { type, name }) => {
    try {
      const desktopPath = path.join(os.homedir(), "Desktop");
      const targetDir = path.join(desktopPath, "DashboardWorkspace");
      if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir, { recursive: true });
      }
      let filePath = "";
      if (type === "folder") {
        filePath = path.join(targetDir, name);
        if (!fs.existsSync(filePath)) {
          fs.mkdirSync(filePath);
        }
      } else {
        let ext = ".txt";
        let initialContent = "";
        if (type === "word") {
          ext = ".docx";
        } else if (type === "excel") {
          ext = ".xlsx";
        } else if (type === "ppt") {
          ext = ".pptx";
        } else if (type === "txt") {
          ext = ".txt";
        }
        filePath = path.join(targetDir, `${name}${ext}`);
        if (type === "txt") {
          fs.writeFileSync(filePath, initialContent);
        }
      }
      if (type === "folder" || type === "txt") {
        await shell.openPath(filePath);
      } else if (type === "word") {
        await shell.openExternal("ms-word:");
      } else if (type === "excel") {
        await shell.openExternal("ms-excel:");
      } else if (type === "ppt") {
        await shell.openExternal("ms-powerpoint:");
      }
      return { success: true, path: filePath };
    } catch (error) {
      console.error("Failed to create file:", error);
      return { success: false, error: error.message };
    }
  });
});
