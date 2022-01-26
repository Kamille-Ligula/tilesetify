/*
https://www.npmjs.com/package/jimp
https://www.npmjs.com/package/path
https://www.npmjs.com/package/fs
*/

const Jimp = require('jimp');
const fs = require("fs");
const path = require('path');
const { app, BrowserWindow } = require('electron');

const {manageDirs} = require("./manageDirs");
const {tilesetify} = require("./tilesetify");

const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })

  win.loadFile('index.html')
}

app.whenReady().then(() => {
  createWindow()
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

function getData() {
  const directoryPath = path.join(__dirname, 'input/');
  fs.readdir(directoryPath, function (err, files) {
    if (err) { return console.log('Unable to scan directory: ' + err) }
    files.forEach(function (file) {
      tilesetify(file);
    });
  });
}

manageDirs();
getData();
