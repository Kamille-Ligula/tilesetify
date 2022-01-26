const fs = require("fs");
const path = require('path');

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

exports.manageDirs = manageDirs;
