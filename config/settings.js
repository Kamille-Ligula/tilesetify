const language = 'Français'; // <-- Here you set the language for the whole app
const version = '2.1.1';
const copyrightYear = '2022';

const DICTIONARY = {
  'Français': {
    'shortForm': 'fr',
    'File': 'Fichier',
    'Quit': 'Quitter',
    'About': 'À propos',
    'Tilesetify': 'Tilesetify',
    'Version': 'Version',
    'AboutMessage': 'Tilesetify v'+version+', © Samuel LUC '+copyrightYear,
    "TilesetReady1": "Votre tileset a été créé en ",
    "TilesetReady2": " secondes. Vous pouvez déposer une autre map si vous désirez produire d'autres tilesets.",
    "WrongWidthHeight1": "La largeur et/ou la hauteur de votre map ne correspond pas à votre format de tiles. Veuillez soit vérifier que les deux sont bien multiples de ",
    "WrongWidthHeight2": " et faire glisser la map une fois corrigée dans le champ prévu à cet effet, soit modifier le champ dédié à la taille des tiles tels que présents sur la map.",
    "NoMap": "On n'attend pas votre map ?",
    "ProcessingMap": "Le traitement de votre map est en cours. Veuillez patienter quelques secondes.",
    "tileFormats": "Format des tiles :",
    "tilesetWidth": "Largeur du tileset :",
    "imageFormats": "Format d'image :",
    "default": "original",
    "letsgo": "C'est parti !",
    "tiles": " tiles",
  },
  'English': {
    'shortForm': 'en',
    'File': 'File',
    'Quit': 'Quit',
    'About': 'About',
    'Tilesetify': 'Tilesetify',
    'Version': 'Version',
    'AboutMessage': 'Tilesetify v'+version+', © Samuel LUC '+copyrightYear,
    "TilesetReady1": "Your tileset was created in ",
    "TilesetReady2": " seconds. You can drag and drop other maps here if you wish to create more tilesets.",
    "WrongWidthHeight1": "Either your map's width or height doesn't match your settings. Please make sure that both are multiples of ",
    "WrongWidthHeight2": " before trying to process your map, or edit your settings.",
    "NoMap": "Drap and drop a map in the designated area.",
    "ProcessingMap": "Your map is being processed. Please wait for a few seconds.",
    "tileFormats": "Size of tiles:",
    "tilesetWidth": "Tileset width:",
    "imageFormats": "Image file format:",
    "default": "default",
    "letsgo": "Proceed",
    "tiles": " tiles",
  },
}

module.exports = {
  language: language,
  version: version,
  copyrightYear: copyrightYear,
  DICTIONARY: DICTIONARY,
};
