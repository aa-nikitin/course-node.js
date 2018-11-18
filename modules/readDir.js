const fs = require('fs');
const path = require('path');
const copyFile = require('./copyFile');
const folders = [];
const resolveDel = process.argv[4];
const toDir = process.argv[3] ? process.argv[3] : './result';

const readDir = (link, callback) => {
  fs.readdir(link, (err, files) => {
    if (err) {
      console.log('Ошибка чтения каталога');
      return;
    }
    let count = 0;

    const wait = files.length;
    const folderDone = err => {
      count++;
      if (count >= wait || err) {
        fs.rmdir(link, callback);
      }
    };

    if (!wait) {
      folderDone();
      return;
    }

    files.forEach((item, i) => {
      const nestedLink = path.join(link, item);

      fs.stat(nestedLink, (err, state) => {
        if (err) {
          console.log('Ошибка чтения параметров файла');
          return;
        }
        if (state.isDirectory()) {
          readDir(nestedLink, folderDone);
        } else {
          const nameFolder = item.charAt(0);
          const resultLink = path.join(toDir, nameFolder, item);

          if (folders.indexOf(nameFolder) < 0) {
            folders.push(nameFolder);
            fs.mkdir(path.join(toDir, nameFolder), err => {
              if (err) {
                console.log('Ошибка чтения каталога');
                return null;
              }
            });
          }
          copyFile(nestedLink, resultLink, () => {
            if (resolveDel) {
              fs.unlink(nestedLink, folderDone);
            }
          });
        }
      });
    });
  });
};

module.exports = readDir;
