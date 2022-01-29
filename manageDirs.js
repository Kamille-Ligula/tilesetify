const fs = require("fs");
const path = require('path');

function manageDirs(directoriesList) {
  for (let i=0; i<directoriesList.length; i++) {
    if (!fs.existsSync(directoriesList[i])) {
      fs.mkdirSync(directoriesList[i]);
    }
  }
}

exports.manageDirs = manageDirs;
