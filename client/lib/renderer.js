const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");
const can2vas = document.getElementById("my2Canvas");
const ct2x = can2vas.getContext("2d");
const clickCanvas = document.getElementById("clickCanvas");
const ct3x = clickCanvas.getContext("2d");

let upbutton = new Image();
let backbutton = new Image();
let forwardbutton = new Image();
let downbutton = new Image();

//Browser Detection
navigator.sayswho= (function(){
	var N= navigator.appName, ua= navigator.userAgent, tem;
	var M= ua.match(/(opera|chrome|safari|firefox|msie)\/?\s*(\.?\d+(\.\d+)*)/i);
	if(M && (tem= ua.match(/version\/([\.\d]+)/i))!= null) M[2]= tem[1];
	M= M? [M[1], M[2]]: [N, navigator.appVersion, '-?'];

	return M;
})();

const browser = navigator.sayswho[0];

clickCanvas.addEventListener("click", canvasClick, false);

function canvasClick(event) {
	let mouseX, mouseY;
	if (browser == "Firefox" || browser == "Microsoft") {
		mouseX = event.clientX - clickCanvas.offsetLeft + document.documentElement.scrollLeft;
		mouseY = event.clientY - clickCanvas.offsetTop + document.documentElement.scrollTop;
	}
	else /* "Safari" or "Chrome" */ {
		mouseX = event.clientX - clickCanvas.offsetLeft + document.body.scrollLeft;
		mouseY = event.clientY - clickCanvas.offsetTop + document.body.scrollTop;
	}

	if (mouseY > 10 && mouseY <= 10+70 && mouseX > 204 && mouseX <= 204+104) {
		moveMap('y', 1);
	};

	if (mouseY > 204 && mouseY <= 204+104 && mouseX > 10 && mouseX <= 10+70) {
		moveMap('x', 1);
	};

	if (mouseY > 204 && mouseY <= 204+104 && mouseX > 433 && mouseX <= 433+70) {
		moveMap('x', -1);
	};

	if (mouseY > 433 && mouseY <= 433+70 && mouseX > 204 && mouseX <= 204+104) {
		moveMap('y', -1);
	};
}

window.addEventListener('keydown', this.check, false);

function check(e) {
  let code = e.keyCode;
	switch (code) {
	  case 37: moveMap('x', 1); break;
	  case 38: moveMap('y', 1); break;
	  case 39: moveMap('x', -1); break;
	  case 40: moveMap('y', -1); break;
	}
}

function moveMap(axis, movement) {
	if (imgsrc !== "./img/placeholder.png") {
	  ctx.clearRect(0, 0, gridSize, gridSize);
	  if (axis === 'x' && imageX+(movement*gridSize)/4 <= 0) {
	    imageX = imageX+(movement*gridSize)/4
	  }
	  else if (axis === 'y' && imageY+(movement*gridSize)/4 <= 0) {
	    imageY = imageY+(movement*gridSize)/4
	  }
	  image.src = imgsrc;
	}
}

let gridSize = 512;
let tile = 16;
let imageX = 0;
let imageY = 0;
let image = new Image();
let imgsrc = "./img/placeholder.png";

image.onload = function() {
  ctx.drawImage(image, imageX, imageY);
  ct3x.drawImage(upbutton, 204, 10, 104, 70);
  ct3x.drawImage(backbutton, 10, 204, 70, 104);
  ct3x.drawImage(forwardbutton, 433, 204, 70, 104);
  ct3x.drawImage(downbutton, 204, 433, 104, 70);
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

let imageFormats = document.getElementById('image-formats')
imageFormats.addEventListener('change', async () => {
  await window.changeImageFormats.send(imageFormats.value);
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
      //document.getElementById('map').src = f.path;
    	ctx.clearRect(0, 0, gridSize, gridSize);
      imgsrc = f.path;
      imageX = 0;
      imageY = 0;
      image.src = imgsrc;

      drawGrid(tile);

    	//ct3x.clearRect(0, 0, gridSize, gridSize);
      upbutton.src = "./img/upbutton.png";
      backbutton.src = "./img/backbutton.png";
      forwardbutton.src = "./img/forwardbutton.png";
      downbutton.src = "./img/downbutton.png";
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
