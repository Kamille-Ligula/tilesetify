const { contextBridge, ipcRenderer } = require('electron')

ipcRenderer.on('asynchronous-reply', (event, arg) => {
  if (arg.status === 'success') {
    document.getElementById('showTileset').innerHTML = '<span class="noselect">Tileset finalisé. Vous pouvez déposer une autre map si vous désirez produire d\'autres tilesets.</span>';
  }
  else if (arg.status === 'error' && arg.message === "width/height invalid") {
    document.getElementById('showTileset').innerHTML = '<span style="color: red;" class="noselect">La largeur et/ou la hauteur de votre map ne correspond pas à votre format de tiles. Veuillez soit vérifier que les deux sont bien multiples de '+arg.localData+' et faire glisser la map une fois corrigée dans le champ prévu à cet effet, soit modifier le champ dédié à la taille des tiles tels que présents sur la map.</span>';
  }
  else if (arg.status === 'error' && arg.message === "no file") {
    document.getElementById('showTileset').innerHTML = '<span style="color: red;" class="noselect">On n\'attend pas votre map ?</span>';
  }
  else {
    document.getElementById('showTileset').innerHTML = '<span class="noselect">Le traitement de votre map est en cours. Veuillez patienter quelques secondes.</span>';
  }
})

contextBridge.exposeInMainWorld('runTilesetify', {
  send: () => ipcRenderer.send('asynchronous-tilesetify', 'run tilesetify'),
})

contextBridge.exposeInMainWorld('changeTileFormat', {
  send: (e) => ipcRenderer.send('asynchronous-change-tile-format', parseInt(e)),
})

contextBridge.exposeInMainWorld('changeTilesetWidth', {
  send: (e) => ipcRenderer.send('asynchronous-change-tileset-width', parseInt(e)),
})

contextBridge.exposeInMainWorld('changeImageFormats', {
  send: (e) => ipcRenderer.send('asynchronous-change-image-format', e),
})

contextBridge.exposeInMainWorld('loadMap', {
  loadFile: (fileName) => {
    ipcRenderer.send('asynchronous-loadMap', fileName)
  }
})

contextBridge.exposeInMainWorld('electron', {
  startDrag: (fileName) => {
    ipcRenderer.send('ondragstart', fileName)
  }
})
