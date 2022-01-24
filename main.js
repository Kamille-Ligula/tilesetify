/*
https://www.npmjs.com/package/jimp
https://www.npmjs.com/package/path
https://www.npmjs.com/package/fs
*/

const Jimp = require('jimp');
const fs = require("fs")
const path = require('path');
const { app, BrowserWindow } = require('electron')

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

let tilesetWidth = 64;
let tileWidth = 16;
let tileHeight = 16;

function emptyDir(dir) {
  const list = fs.readdirSync(dir);

  for (let i=0; i<list.length; i++) {
    const filename = path.join(dir, list[i]);
    const stat = fs.statSync(filename);

    if (stat.isDirectory()) {
      rmdir(filename);
    }
    else {
      fs.unlinkSync(filename);
    }
  }
}

function manageDirs() {
  if (!fs.existsSync('input')) {
    fs.mkdirSync('input');
  }

  if (!fs.existsSync('output')) {
    fs.mkdirSync('output');
  }

  if (fs.existsSync('temp')) {
    emptyDir('temp');
  }
  else {
    fs.mkdirSync('temp');
  }
}

function closest(num, arr) {
  let curr = arr[0];
  let diff = Math.abs (num - curr);
  for (let i=0; i<arr.length; i++) {
    let newdiff = Math.abs (num - arr[i]);
    if (newdiff < diff) {
      diff = newdiff;
      curr = arr[i];
    }
  }
  return curr;
}

function findFactors(data) {
  const factors = [];

  for (let i=1; i<=data; i++) {
    if (data % i === 0) {
      factors.push(i);
    }
  }

  return factors;
}

async function tilesetify(file) {
  console.log(Date.now())

  const img = await Jimp.read('input/'+file)
    .then(img => {
      return [img.bitmap.width, img.bitmap.height];
    })
    .catch(err => {
      console.error(err);
    })

  const extension = '.'+file.split(".").pop();
  const minusExtension = file.substring(0, file.length - extension.length);
  const width = img[0];
  const height = img[1];
  const tilesData = [];
  const tilesHash = [];
  const mapChunks = [];

  const widthFactors = findFactors(width);
  const heightFactors = findFactors(height);
  const checkWidth = width/tileWidth;
  const checkHeight = height/tileHeight;
  if (checkWidth !== Math.round(checkWidth) || checkHeight !== Math.round(checkHeight)) {
    console.log('Your image\'s width and/or height is invalid (both must be multiples of 16)')
    return;
  }

  let chunckWidth, chunkHeight, nbreHorizChunks, nbreVerticChunks;
  const chunksData = [];
  const chunksHash = [];
  if (width > 1000 && height > 1000) {
    chunckWidth = closest(300, widthFactors);
    chunkHeight = closest(300, heightFactors);
    nbreHorizChunks = width/chunckWidth;
    nbreVerticChunks = height/chunkHeight;

    for (let j=0; j<nbreVerticChunks; j++) {
      console.log('Preparing file. Reading line '+(j+1)+'/'+(nbreVerticChunks)+'...')
      for (let i=0; i<nbreHorizChunks; i++) {
        const buffer = await Jimp.read('input/'+file)
          .then(image2 => {
            const x = chunckWidth*i;
            const y = chunkHeight*j;
            image2.crop(x, y, chunckWidth, chunkHeight);
            image2.write('temp/part'+chunksData.length+'-'+file);
            return [image2.hash(), image2.bitmap.data];
          })
          .catch(err => {
            console.error(err);
          })

        chunksData.push(buffer[1])
        chunksHash.push(buffer[0])

        if (chunksData.length > 0) {
          for (let k=0; k<chunksData.length-1; k++) {
            if (buffer[0] === chunksHash[k]) {
              chunksData.pop();
              chunksHash.pop();
              break;
            }
          }
        }
      }
    }
    console.log('File ready for processing.')
  }
  else {
    const input = fs.readFileSync('input/'+file);

    fs.writeFileSync('temp/part0-'+file, input);

    chunksData.push('placeholder')
    chunckWidth = width;
    chunkHeight = height;
  }

  for (let l=0; l<chunksData.length; l++) {
    console.log('PROCESSING PART '+(l+1)+'/'+chunksData.length+'...')
    for (let j=0; j<chunkHeight/tileHeight; j++) {
      for (let i=0; i<chunckWidth/tileWidth; i++) {
        const buffer = await Jimp.read('temp/part'+l+'-'+file)
          .then(image2 => {
            const x = tileWidth*i;
            const y = tileHeight*j;
            image2.crop(x, y, tileWidth, tileHeight);
            return [image2.hash(), image2.bitmap.data];
          })
          .catch(err => {
            console.error(err);
          })

        tilesData.push(buffer[1])
        tilesHash.push(buffer[0])

        if (tilesData.length > 0) {
          for (let k=0; k<tilesData.length-1; k++) {
            if (buffer[0] === tilesHash[k]) {
              tilesData.pop();
              tilesHash.pop();
              break;
            }
          }
        }
      }
    }
  }
  
  let tilesetHeight = Math.ceil(tilesData.length/tilesetWidth);
  if (tilesetHeight === tilesData.length/tilesetWidth || tilesetHeight === 0) {
    tilesetHeight+=1;
  }

  new Jimp(tilesetWidth*tileWidth, tilesetHeight*tileHeight, async (err, image) => {
    let tileset_x = 0;
    let tileset_y = 0;

    for (let i=0; i<tilesData.length; i++) {
      const tile = await new Jimp({data: tilesData[i], width: tileWidth, height: tileHeight}, (err, prototile) => {return prototile});

      image.blit( tile, tileset_x*tileWidth, tileset_y*tileHeight );

      tileset_x++;

      if (tileset_x % tilesetWidth === 0) {
        tileset_x = 0;
        tileset_y++;
      }
    }

    image.write('output/tileset-'+file);
  });

  emptyDir('temp');

  console.log(Date.now())
}

function getData() {
  const directoryPath = path.join(__dirname, 'input/');
  fs.readdir(directoryPath, function (err, files) {
    if (err) { return console.log('Unable to scan directory: ' + err) }
    files.forEach(function (file) {
      tilesetify(file);
    });
  });
}

manageDirs()
getData();
