const Jimp = require('jimp');
const fs = require("fs");
const path = require('path');
const { app, BrowserWindow, ipcMain, nativeTheme, nativeImage, NativeImage, dialog } = require('electron');

const {loadMap, tilesetify} = require("./lib/tilesetify");

const createWindow = () => {
  const win = new BrowserWindow({
    width: 1024,
    height: 624,
    webPreferences: {
      preload: path.join(__dirname, './lib/preload.js')
    }
  })
  win.loadFile('./client/index.html')
  //win.webContents.openDevTools()

  ipcMain.on('asynchronous-tilesetify', async (event, arg) => {
    win.webContents.send('asynchronous-reply', {status: 'ongoing', message: 'ongoing'});
    const returnedValue = await tilesetify(tileWidth, tileHeight, tilesetWidth, imageFormat);
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

//let tilesetifiableFile;
let tileWidth = 16;
let tileHeight = 16;
let tilesetWidth = 24;
let imageFormat = 'default';
ipcMain.on('asynchronous-loadMap', (event, arg) => {
  //tilesetifiableFile = arg.split('\\').pop().split('/').pop();
  loadMap(arg);
  //fs.copyFile(arg, './input/'+tilesetifiableFile, (err) => { if (err) throw err; });
})
ipcMain.on('asynchronous-change-tile-format', (event, arg) => {
  tileWidth = arg;
  tileHeight = arg;
})
ipcMain.on('asynchronous-change-tileset-width', (event, arg) => {
  tilesetWidth = arg;
})
ipcMain.on('asynchronous-change-image-format', (event, arg) => {
  imageFormat = arg;
})

// Native File Drag & Drop
// https://www.electronjs.org/docs/latest/tutorial/native-file-drag-drop
ipcMain.on('ondragstart', (event, filePath) => {
  event.sender.startDrag({
    file: path.join(__dirname, filePath),
    icon: iconName,
  })
})
