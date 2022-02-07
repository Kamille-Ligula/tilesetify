const { contextBridge, ipcRenderer } = require('electron')
const {DICTIONARY, language} = require("../config/settings");

ipcRenderer.on('asynchronous-reply', (event, arg) => {
  if (arg.status === 'success') {
    document.getElementById('showTileset').innerHTML = '<span class="noselect">'+DICTIONARY[language]['TilesetReady1']+arg.time+DICTIONARY[language]['TilesetReady2']+'</span>';
  }
  else if (arg.status === 'error' && arg.message === "width/height invalid") {
    document.getElementById('showTileset').innerHTML = '<span style="color: red;" class="noselect">'+DICTIONARY[language]['WrongWidthHeight1']+arg.localData+DICTIONARY[language]['WrongWidthHeight2']+'</span>';
  }
  else if (arg.status === 'error' && arg.message === "no file") {
    document.getElementById('showTileset').innerHTML = '<span style="color: red;" class="noselect">'+DICTIONARY[language]['NoMap']+'</span>';
  }
  else {
    document.getElementById('showTileset').innerHTML = '<span class="noselect">'+DICTIONARY[language]['ProcessingMap']+'</span>';
  }
})

contextBridge.exposeInMainWorld('runTilesetify', {
  send: (e) => ipcRenderer.send('asynchronous-tilesetify', e),
})

contextBridge.exposeInMainWorld('electron', {
  startDrag: (fileName) => {
    ipcRenderer.send('ondragstart', fileName)
  }
})
