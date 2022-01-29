let tileFormats = document.getElementById('tile-formats')
tileFormats.addEventListener('change', async () => {
  await window.changeTileFormat.send(tileFormats.value);
})

let tilesetWidth = document.getElementById('tileset-width')
tilesetWidth.addEventListener('change', async () => {
  await window.changeTilesetWidth.send(tilesetWidth.value);
})

document.getElementById('run-tilesetify').addEventListener('click', async () => {
  await window.runTilesetify.send();
})

// Drag and Drop Files
// https://www.geeksforgeeks.org/drag-and-drop-files-in-electronjs/
document.addEventListener('drop', async (event) => {
  event.preventDefault();
  event.stopPropagation();

  for (const f of event.dataTransfer.files) {
    // Using the path attribute to get absolute file path
    console.log('File Path of dragged files: ', f.path)
    if (f.path) {
      console.log('File Path of dragged files: ', f.path)
      await window.loadMap.loadFile(f.path);
      document.getElementById('showMap').innerHTML = '<img src="'+f.path+'" draggable="false" ondragstart="return false" class="nodrag" />';
    }
  }
});

document.addEventListener('dragover', (e) => {
  e.preventDefault();
  e.stopPropagation();
});

document.addEventListener('dragenter', (event) => {
  //console.log('File is in the Drop Space');
});

document.addEventListener('dragleave', (event) => {
  //console.log('File has left the Drop Space');
});
////////////////////////////
