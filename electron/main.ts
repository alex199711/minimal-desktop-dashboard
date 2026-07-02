import { app, BrowserWindow, ipcMain, shell, Tray, Menu, globalShortcut, Notification, nativeTheme } from 'electron';
import path from 'node:path';
import fs from 'node:fs';
import os from 'node:os';
import { exec } from 'node:child_process';

// The built directory structure
process.env.DIST = path.join(__dirname, '../dist');
process.env.VITE_PUBLIC = app.isPackaged ? process.env.DIST : path.join(process.env.DIST, '../public');

let win: BrowserWindow | null;
let tray: Tray | null = null;
const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL'];

// Persistent store file
const storePath = path.join(app.getPath('userData'), 'dashboard-store.json');

function createWindow() {
  win = new BrowserWindow({
    icon: path.join(process.env.VITE_PUBLIC, 'electron-vite.svg'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
    },
    width: 1280,
    height: 800,
    minWidth: 1024,
    minHeight: 768,
    frame: false, // 无边框
    transparent: true, // 透明背景以实现圆角和毛玻璃
    vibrancy: 'under-window', // macOS
    backgroundMaterial: 'mica', // Windows 11
    autoHideMenuBar: true,
  });

  // Make it frameless and custom draggable
  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL);
  } else {
    win.loadFile(path.join(process.env.DIST, 'index.html'));
  }

  // Handle minimize to tray
  win.on('minimize', (event: any) => {
    event.preventDefault();
    win?.hide();
  });
}

function createTray() {
  const iconPath = path.join(process.env.VITE_PUBLIC, 'electron-vite.svg');
  tray = new Tray(iconPath);
  const contextMenu = Menu.buildFromTemplate([
    { label: '显示看板', click: () => win?.show() },
    { type: 'separator' },
    { label: '退出', click: () => {
      app.exit();
    }}
  ]);
  tray.setToolTip('桌面数据看板');
  tray.setContextMenu(contextMenu);
  tray.on('click', () => {
    win?.isVisible() ? win?.hide() : win?.show();
  });
}

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
    win = null;
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

app.whenReady().then(() => {
  createWindow();
  createTray();

  // Register Global Shortcut (Alt + Space)
  globalShortcut.register('Alt+Space', () => {
    if (win) {
      if (win.isVisible() && win.isFocused()) {
        win.hide();
      } else {
        win.show();
        win.focus();
      }
    }
  });

  // Window Controls
  ipcMain.on('window-control', (_, action) => {
    if (!win) return;
    if (action === 'close') win.hide(); // Hide to tray instead of closing
    if (action === 'minimize') win.hide();
    if (action === 'maximize') win.isMaximized() ? win.unmaximize() : win.maximize();
  });

  // Native Notification
  ipcMain.on('show-notification', (_, { title, body }) => {
    new Notification({ title, body, icon: path.join(process.env.VITE_PUBLIC, 'electron-vite.svg') }).show();
  });

  // Store persistence
  ipcMain.handle('store-get', () => {
    try {
      if (fs.existsSync(storePath)) {
        return JSON.parse(fs.readFileSync(storePath, 'utf-8'));
      }
    } catch (e) {}
    return null;
  });

  ipcMain.handle('store-set', (_, data) => {
    try {
      fs.writeFileSync(storePath, JSON.stringify(data));
      return true;
    } catch (e) { return false; }
  });

  // Real App Launching
  ipcMain.handle('launch-app', async (_, appName) => {
    // Map abstract names to actual Windows commands/executables
    const appMap: Record<string, string> = {
      'LayoutGrid': 'explorer shell:AppsFolder',
      'Settings': 'start ms-settings:',
      'Compass': 'start msedge',
      'Mail': 'start outlookmail:',
      'Calendar': 'start outlookcal:',
      'MessageSquare': 'start msteams:',
      'Book': 'start notepad',
      'FileText': 'start write',
      'Image': 'start ms-photos:',
      'Music': 'start mswindowsmusic:',
      'Video': 'start mswindowsvideo:',
      'Camera': 'start microsoft.windows.camera:',
      'Cloud': 'start bingweather:',
      'Map': 'start bingmaps:'
    };

    const cmd = appMap[appName];
    if (cmd) {
      exec(cmd, (error) => {
        if (error) console.error(`Failed to launch app ${appName}:`, error);
      });
    }
  });

  // IPC handlers for file creation
  ipcMain.handle('create-file', async (event, { type, name }) => {
    try {
      const desktopPath = path.join(os.homedir(), 'Desktop');
      const targetDir = path.join(desktopPath, 'DashboardWorkspace');
      
      if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir, { recursive: true });
      }

      let filePath = '';
      if (type === 'folder') {
        filePath = path.join(targetDir, name);
        if (!fs.existsSync(filePath)) {
          fs.mkdirSync(filePath);
        }
      } else {
        let ext = '.txt';
        let initialContent = '';
        if (type === 'word') {
          ext = '.docx';
          // Empty docx signature is complex, we just create empty file and let Word complain or open,
          // OR better: we don't create it manually but use COM/PowerShell, or just open a new Word process.
        } else if (type === 'excel') {
          ext = '.xlsx';
        } else if (type === 'ppt') {
          ext = '.pptx';
        } else if (type === 'txt') {
          ext = '.txt';
        }

        filePath = path.join(targetDir, `${name}${ext}`);
        
        // Only write if it's text, otherwise for Office files it's better to just open the application
        if (type === 'txt') {
          fs.writeFileSync(filePath, initialContent);
        }
      }

      // Open the file/folder or application
      if (type === 'folder' || type === 'txt') {
        await shell.openPath(filePath);
      } else if (type === 'word') {
        // Open Word directly to create a new document
        await shell.openExternal('ms-word:');
      } else if (type === 'excel') {
        // Open Excel directly
        await shell.openExternal('ms-excel:');
      } else if (type === 'ppt') {
        // Open PowerPoint directly
        await shell.openExternal('ms-powerpoint:');
      }

      return { success: true, path: filePath };
    } catch (error: any) {
      console.error('Failed to create file:', error);
      return { success: false, error: error.message };
    }
  });
});