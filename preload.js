const { contextBridge, ipcRenderer } = require('electron')

ipcRenderer.on('asynchronous-reply', (event, arg) => {
  if (!arg.error && arg.success) {
    document.getElementById('showTileset').innerHTML = '<span class="noselect">Tileset finalisé. Vous pouvez déposer une autre map si vous désirez produire d\'autres tilesets.</span>';
    //document.getElementById('showTileset').innerHTML = '<span class="noselect">Tileset finalisé. Cliquez et déposez l\'image sur votre PC pour l\'enregistrer.<p/>Si le tileset n\'apparaît pas ci-dessous, vous pouvez aller le chercher dans le dossier "output" présent à la racine de cette application. Désolé pour le désagrément.</span><p/><div style="width: 40vw; height: 50vh;"><img style="max-width: 100%; max-height: 100%;" src="'+arg.message+'" /></div>';
    //new Notification('Tilesetify', { body: 'Votre tileset est prêt.' });
    //alert('Votre tileset est prêt.');
  }
  else if (arg.error && !arg.success && arg.message !== "no file") {
    document.getElementById('showTileset').innerHTML = '<span style="color: red;" class="noselect">'+arg.message+'</span>';
    //alert(arg.message)
  }
  else if (arg.error && !arg.success && arg.message === "no file") {
    document.getElementById('showTileset').innerHTML = '<span style="color: red;" class="noselect">On n\'attend pas votre map ?</span>';
    //alert(arg.message)
  }
  else {
    document.getElementById('showTileset').innerHTML = '<span class="noselect">Le traitement de votre map est en cours. En fonction de sa taille, ce processus peut prendre de quelques secondes à plusieurs dizaines de minutes, voire même plusieurs heures dans les cas extrêmes de très grosses maps. Tout ce que vous avez à faire est de minimiser cette fenêtre et continuer à vaquer à vos occupations. Vous recevrez une notification une fois votre tileset terminé.</span>';
  }
})

contextBridge.exposeInMainWorld('runTilesetify', {
  //postMessage: () => ipcRenderer.send('asynchronous-message', 'message'),
  send: () => ipcRenderer.send('asynchronous-tilesetify', 'run tilesetify'),
})

contextBridge.exposeInMainWorld('changeTileFormat', {
  //postMessage: () => ipcRenderer.send('asynchronous-message', 'message'),
  send: (e) => ipcRenderer.send('asynchronous-change-tile-format', parseInt(e)),
})

contextBridge.exposeInMainWorld('changeTilesetWidth', {
  //postMessage: () => ipcRenderer.send('asynchronous-message', 'message'),
  send: (e) => ipcRenderer.send('asynchronous-change-tileset-width', parseInt(e)),
})

// Message client -> main
contextBridge.exposeInMainWorld('loadMap', {
  loadFile: (fileName) => {
    ipcRenderer.send('asynchronous-loadMap', fileName)
  }
})
////////////////////////////

// Native File Drag & Drop
// https://www.electronjs.org/docs/latest/tutorial/native-file-drag-drop
contextBridge.exposeInMainWorld('electron', {
  startDrag: (fileName) => {
    ipcRenderer.send('ondragstart', fileName)
  }
})
////////////////////////////
