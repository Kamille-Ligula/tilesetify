const Jimp = require('jimp');
const fs = require("fs");
const path = require('path');
const { app, BrowserWindow, ipcMain, nativeTheme, nativeImage, NativeImage, dialog, Menu } = require('electron');

const {tilesetify} = require("./lib/tilesetify");
const {DICTIONARY, language} = require("./config/settings");

const isMac = process.platform === 'darwin';

const createWindow = () => {
  const win = new BrowserWindow({
    width: 1024,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, './lib/preload.js')
    },
    icon: __dirname+'./icon.ico'
  })
  win.loadFile('./client/index.html')
  //win.webContents.openDevTools()

  ipcMain.on('asynchronous-tilesetify', async (event, arg) => {
    win.webContents.send('asynchronous-reply', {status: 'ongoing', message: 'ongoing'});
    const returnedValue = await tilesetify(arg[0], arg[0], arg[1], arg[2], arg[3]);
    win.webContents.send('asynchronous-reply', returnedValue);
  })
}

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

// Native File Drag & Drop
// https://www.electronjs.org/docs/latest/tutorial/native-file-drag-drop
ipcMain.on('ondragstart', (event, filePath) => {
  event.sender.startDrag({
    file: path.join(__dirname, filePath),
    icon: iconName,
  })
})

const template = [
  {
    label: DICTIONARY[language]['File'],
    submenu: [
      isMac ? { label: DICTIONARY[language]['Quit'], role: 'close' } : { label: DICTIONARY[language]['Quit'], role: 'quit' }
    ]
  },
  {
    label: DICTIONARY[language]['About'],
    role: 'help',
    submenu: [
      {
        label: DICTIONARY[language]['Version'],
        click: function () {
          dialog.showMessageBox(
            null,
            {
              title: DICTIONARY[language]['Version'],
              message: DICTIONARY[language]['AboutMessage'],
            }
          );
        },
      }
    ]
  },
]

const menu = Menu.buildFromTemplate(template)
Menu.setApplicationMenu(menu)
