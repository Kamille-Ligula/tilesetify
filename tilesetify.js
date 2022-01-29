const Jimp = require('jimp');
const fs = require("fs");
const {findFactors} = require("./findFactors");
const {closest} = require("./closest");

let map;
let width;
let height;
let fileName;

async function loadMap(file) {
  const img = await Jimp.read(file)
    .then(img => {
      return [img, img.bitmap.width, img.bitmap.height];
    })
    .catch(err => {
      console.error(err);
    })

  map = img[0];
  width = img[1];
  height = img[2];
  fileName = file.split('\\').pop().split('/').pop();
}

async function tilesetify(tileWidth, tileHeight, tilesetWidth) {
  console.log(Date.now())

  if (map == undefined) {
    return ({error: true, success: false, message: 'no file'})
  }

  //const extension = '.'+file.split(".").pop();
  // minusExtension = file.substring(0, file.length - extension.length);
  const tilesImgs = [];
  const tilesHash = [];
  const mapChunks = [];

  const widthFactors = findFactors(width);
  const heightFactors = findFactors(height);
  const checkWidth = width/tileWidth;
  const checkHeight = height/tileHeight;
  if (checkWidth !== Math.round(checkWidth) || checkHeight !== Math.round(checkHeight)) {
    //console.log('Your image\'s width and/or height is invalid (both must be multiples of '+tileWidth+')')
    //console.log('La largeur et/ou la hauteur de votre map est non valide. Veuillez vérifier que les deux sont bien multiples de '+tileWidth);
    return ({error: true, success: false, message: 'La largeur et/ou la hauteur de votre map est non valide. Veuillez soit vérifier que les deux sont bien multiples de '+tileWidth+' et faire glisser la map une fois corrigée dans le champ prévu à cet effet, soit modifier le champ dédié à la taille des tiles tels que présents sur la map.'});
  }

  let chunckWidth, chunkHeight, nbreHorizChunks, nbreVerticChunks;
  const chunksImgs = [];
  const chunksHash = [];
  if (width > 1000 && height > 1000) {
    chunckWidth = closest(300, widthFactors);
    chunkHeight = closest(300, heightFactors);
    nbreHorizChunks = width/chunckWidth;
    nbreVerticChunks = height/chunkHeight;

    for (let j=0; j<nbreVerticChunks; j++) {
      console.log('Preparing file. Reading line '+(j+1)+'/'+(nbreVerticChunks)+'...')
      for (let i=0; i<nbreHorizChunks; i++) {
        const chunk = await Jimp.read(map)
          .then(chunk => {
            const x = chunckWidth*i;
            const y = chunkHeight*j;
            chunk.crop(x, y, chunckWidth, chunkHeight);
            //chunk.write('temp/part'+chunksImgs.length+'-'+file);
            return [chunk, chunk.hash()];
          })
          .catch(err => {
            console.error(err);
          })

        let repeatingPixels;

        if (chunksImgs.length > 0) {
          for (let k=0; k<chunksImgs.length; k++) {
            repeatingPixels = 0;
            if (chunk[1] === chunksHash[k]) {
              for (let m=0; m<chunckWidth; m++) {
                for (let n=0; n<chunkHeight; n++) {
                  if (chunk[0].getPixelColor(m, n) === chunksImgs[k].getPixelColor(m, n)) {
                    repeatingPixels++;
                  }
                }
              }
            }
            if (repeatingPixels === chunckWidth*chunkHeight) {
              break;
            }
          }
        }

        if (repeatingPixels < chunckWidth*chunkHeight || chunksImgs.length === 0) {
          chunksImgs.push(chunk[0]);
          chunksHash.push(chunk[1]);
        }
      }
    }
    console.log('File ready for processing.')
  }
  else {
    //const input = fs.readFileSync('input/'+file);

    //fs.writeFileSync('temp/part0-'+file, input);

    chunksImgs.push(map)
    chunckWidth = width;
    chunkHeight = height;
  }

  for (let l=0; l<chunksImgs.length; l++) {
    console.log('PROCESSING PART '+(l+1)+'/'+chunksImgs.length+'...')
    for (let j=0; j<chunkHeight/tileHeight; j++) {
      for (let i=0; i<chunckWidth/tileWidth; i++) {
        const tile = await Jimp.read(chunksImgs[l])
          .then(tile => {
            const x = tileWidth*i;
            const y = tileHeight*j;
            tile.crop(x, y, tileWidth, tileHeight);
            return [tile, tile.hash()];
          })
          .catch(err => {
            console.error(err);
          })

        let repeatingPixels;

        if (tilesImgs.length > 0) {
          for (let k=0; k<tilesImgs.length; k++) {
            repeatingPixels = 0;
            if (tile[1] === tilesHash[k]) {
              for (let m=0; m<tileWidth; m++) {
                for (let n=0; n<tileHeight; n++) {
                  if (tile[0].getPixelColor(m, n) === tilesImgs[k].getPixelColor(m, n)) {
                    repeatingPixels++;
                  }
                }
              }
            }
            if (repeatingPixels === tileWidth*tileHeight) {
              break;
            }
          }
        }

        if (repeatingPixels < tileWidth*tileHeight || tilesImgs.length === 0) {
          tilesImgs.push(tile[0]);
          tilesHash.push(tile[1]);
        }
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

    tileset.write('output/tileset-'+fileName);
  });

  console.log(Date.now())
  return ({error: false, success: true, message: 'output/tileset-'+fileName})
}

exports.tilesetify = tilesetify;
exports.loadMap = loadMap;
