const Jimp = require('jimp');
const fs = require("fs");
const { findFactors } = require("./findFactors");
const { closest } = require("./closest");
const { dialog } = require('electron');

let mapProt;
let widthProt;
let heightProt;
let fileNameProt;

async function loadMap(file) {
  const img = await Jimp.read(file)
    .then(img => {
      return [img, img.bitmap.width, img.bitmap.height];
    })
    .catch(err => {
      console.error(err);
    })

  mapProt = img[0];
  widthProt = img[1];
  heightProt = img[2];
  fileNameProt = file.split('\\').pop().split('/').pop();
}

async function tilesetify(tileWidth, tileHeight, tilesetWidth, imageFormat) {
  console.log(Date.now())

  const map = mapProt;
  const width = widthProt;
  const height = heightProt;
  const fileName = fileNameProt;

  if (map == undefined) {
    return ({status: 'error', message: 'no file'})
  }

  const extension = '.'+fileName.split(".").pop();
  const minusExtension = fileName.substring(0, fileName.length - extension.length);
  let newExtension;
  switch (imageFormat) {
    case "default": newExtension = extension; break;
    case ".png": newExtension = ".png"; break;
    default: newExtension = extension; break;
  }

  const tilesImgs = [];
  const tilesX = [];
  const tilesY = [];

  const checkWidth = width/tileWidth;
  const checkHeight = height/tileHeight;
  if (checkWidth !== Math.round(checkWidth) || checkHeight !== Math.round(checkHeight)) {
    return ({status: 'error', message: 'width/height invalid', localData: tileWidth})
  }

  for (let j=0; j<height/tileHeight; j++) {
    for (let i=0; i<width/tileWidth; i++) {
      let pixels = 'undefined';

      for (let k=0; k<tilesImgs.length; k++) {
        pixels = 'undefined';
        for (let m=0; m<tileWidth; m++) {
          for (let n=0; n<tileHeight; n++) {
            if (map.getPixelColor(i*tileWidth+m, j*tileHeight+n) === map.getPixelColor(tilesX[k]*tileWidth+m, tilesY[k]*tileHeight+n)) {
              pixels = 'same';
            }
            else {
              pixels = 'different';
            }
            if (pixels === 'different') {break}
          }
          if (pixels === 'different') {break}
        }
        if (pixels === 'same') {break}
      }

      if (pixels === 'different' || tilesImgs.length === 0) {
        const newTile = await new Jimp(tileWidth, tileHeight, async (err, tile) => {
          for (let k=0; k<tileWidth; k++) {
            for (let l=0; l<tileHeight; l++) {
              tile.setPixelColor( map.getPixelColor(i*tileWidth+k, j*tileHeight+l), k, l );
            }
          }
        });
        tilesImgs.push(newTile);
        tilesX.push(i);
        tilesY.push(j);
      }
    }
  }

  let tilesetHeight = Math.ceil(tilesImgs.length/tilesetWidth);
  if (tilesetHeight === 0) { tilesetHeight+=1; }

  const createTileset = await new Jimp(tilesetWidth*tileWidth, tilesetHeight*tileHeight, async (err, tileset) => {
    let tileset_x = 0;
    let tileset_y = 0;

    for (let i=0; i<tilesImgs.length; i++) {
      tileset.blit( tilesImgs[i], tileset_x*tileWidth, tileset_y*tileHeight );

      tileset_x++;

      if (tileset_x % tilesetWidth === 0) {
        tileset_x = 0;
        tileset_y++;
      }
    }

    var options = {
      title: "Save file",
      defaultPath : 'tileset-'+minusExtension+newExtension,
      buttonLabel : "Save"
    };

    dialog.showSaveDialog(null, options).then(({ filePath }) => {
      tileset.write(filePath);
    });
  });

  console.log(Date.now())
  console.log(tilesX.length)
  return ({status: 'success', message: 'success'})
}

exports.tilesetify = tilesetify;
exports.loadMap = loadMap;
