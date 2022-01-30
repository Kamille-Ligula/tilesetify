const Jimp = require('jimp');
const fs = require("fs");
const path = require('path');
const { app, BrowserWindow, ipcMain, nativeTheme, nativeImage, NativeImage, dialog } = require('electron');

const {manageDirs} = require("./manageDirs");
const {loadMap, tilesetify} = require("./tilesetify");

const createWindow = () => {
  const win = new BrowserWindow({
    width: 1024,
    height: 624,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })
  win.loadFile('index.html')
  //win.webContents.openDevTools()

  ipcMain.on('asynchronous-tilesetify', async (event, arg) => {
    win.webContents.send('asynchronous-reply', {error: false, success: false});
    const returnedValue = await tilesetify(tileWidth, tileHeight, tilesetWidth);
    win.webContents.send('asynchronous-reply', returnedValue);
    if (!returnedValue.error && returnedValue.success) {
      var options = {
        title: "Save file",
        defaultPath : returnedValue.name,
        buttonLabel : "Save"
      };

      dialog.showSaveDialog(null, options).then(({ filePath }) => {
        fs.copyFile(returnedValue.message, filePath, (err) => {
          if (err) console.log(err);
        });
      });
    };
  })
}

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    //manageDirs(['temp', 'input']);
    app.quit()
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

manageDirs(['output']);

//let tilesetifiableFile;
let tileWidth = 16;
let tileHeight = 16;
let tilesetWidth = 24;
ipcMain.on('asynchronous-loadMap', (event, arg) => {
  //tilesetifiableFile = arg.split('\\').pop().split('/').pop();
  loadMap(arg);
  //fs.copyFile(arg, './input/'+tilesetifiableFile, (err) => { if (err) throw err; });
})
ipcMain.on('asynchronous-change-tile-format', (event, arg) => {
  //console.log(arg)
  tileWidth = arg;
  tileHeight = arg;
})
ipcMain.on('asynchronous-change-tileset-width', (event, arg) => {
  //console.log(arg)
  tilesetWidth = arg;
})

// Native File Drag & Drop
// https://www.electronjs.org/docs/latest/tutorial/native-file-drag-drop
ipcMain.on('ondragstart', (event, filePath) => {
  event.sender.startDrag({
    file: path.join(__dirname, filePath),
    icon: iconName,
  })
})

const iconName = path.join(__dirname, 'iconForDragAndDrop.png');
const icon = fs.createWriteStream(iconName);
