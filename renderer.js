const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");
const can2vas = document.getElementById("my2Canvas");
const ct2x = can2vas.getContext("2d");

let gridSize = 512;
let tile = 16;
let imageX = 0;
let imageY = 0;
let image = new Image();
let imgsrc = "placeholder.png";
image.onload = function() {
  ctx.drawImage(image, imageX, imageY);
};

image.src = imgsrc;

function drawGrid(tiles) {
  ct2x.clearRect(0, 0, gridSize, gridSize);
  for (let i=0; i<gridSize/tiles; i++) {
    ct2x.beginPath();
    ct2x.moveTo(i*tiles, 0);
    ct2x.lineTo(i*tiles, gridSize);
    ct2x.stroke();
    ct2x.beginPath();
    ct2x.moveTo(0, i*tiles);
    ct2x.lineTo(gridSize, i*tiles);
    ct2x.stroke();
  }
}

function moveMap(axis, movement) {
  if (imgsrc !== "placeholder.png") {
    ctx.clearRect(0, 0, gridSize, gridSize);
    if (axis === 'x') {
      imageX = imageX+(movement*gridSize)
    }
    else {
      imageY = imageY+(movement*gridSize)
    }
    image.src = imgsrc;
  }
}

let tileFormats = document.getElementById('tile-formats')
tileFormats.addEventListener('change', async () => {
  await window.changeTileFormat.send(tileFormats.value);
  tile = tileFormats.value;
  drawGrid(tile);
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
    if (f.path) {
      await window.loadMap.loadFile(f.path);
      //document.getElementById('scream').src = f.path;
    	ctx.clearRect(0, 0, gridSize, gridSize);
      imgsrc = f.path;
      imageX = 0;
      imageY = 0;
      image.src = imgsrc;
      drawGrid(tile);
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
