const fs = require('fs');
const readDir = require('./modules/readDir');
const fromDir = process.argv[2];
const toDir = process.argv[3] ? process.argv[3] : './result';

fs.mkdir(toDir, err => {
  if (err) {
    console.log('Ошибка создания итоговой папки');
    return null;
  } else {
    readDir(fromDir, () => {});
  }
});
