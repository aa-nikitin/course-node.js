const fs = require('fs');
const path = require('path');
const fromDir = process.argv[2] ? process.argv[2] : '.';
const toDir = process.argv[3] ? process.argv[3] : './result';
const resolveDel = process.argv[4];
const folders = [];
const dirNames = [];

const createDir = link => {
  return new Promise((resolve, reject) => {
    fs.mkdir(link, err => {
      if (err) reject(err);
      resolve();
    });
  });
};

const readDir = link => {
  return new Promise((resolve, reject) => {
    fs.readdir(link, (err, list) => {
      if (err) reject(err);
      resolve(list);
    });
  });
};

const stateFile = link => {
  return new Promise((resolve, reject) => {
    fs.stat(link, (err, state) => {
      if (err) reject(err);
      resolve(state);
    });
  });
};

const deleteFile = link => {
  return new Promise((resolve, reject) => {
    fs.unlink(link, err => {
      if (err) reject(err);
      resolve();
    });
  });
};

const deleteDir = link => {
  return new Promise((resolve, reject) => {
    fs.rmdir(link, err => {
      if (err) reject(err);
      resolve();
    });
  });
};

const copyFile = (linkFrom, linkTo) => {
  return new Promise((resolve, reject) => {
    var rd = fs.createReadStream(linkFrom);
    rd.on('error', err => {
      reject(err);
    });
    var wr = fs.createWriteStream(linkTo);
    wr.on('error', err => {
      reject(err);
    });
    wr.on('close', () => {});
    rd.pipe(wr);
    resolve(linkFrom);
  });
};

const moveFiles = async (link, del) => {
  try {
    const files = await readDir(link);

    for (let item of files) {
      const nestedLink = path.join(link, item);
      const state = await stateFile(nestedLink);
      if (state.isDirectory()) {
        await moveFiles(nestedLink, del);
        dirNames.push(nestedLink);
      } else {
        const nameFolder = item.charAt(0);
        const linkTo = path.join(toDir, nameFolder, item);
        if (folders.indexOf(nameFolder) < 0) {
          folders.push(nameFolder);
          await createDir(path.join(toDir, nameFolder));
        }
        await copyFile(nestedLink, linkTo);
        if (del) await deleteFile(nestedLink);
      }
    }
  } catch (e) {
    console.log(e);
  }
};

const sortingСollections = async (linkFrom, linkTo, del) => {
  try {
    await createDir(linkTo);
    await moveFiles(linkFrom, del);
    if (del) {
      for (let item of dirNames) {
        await deleteDir(item);
      }
      await deleteDir(linkFrom);
    }
  } catch (e) {
    console.log(e);
  }
};

sortingСollections(fromDir, toDir, resolveDel).then(() => {
  console.log('Обработка завершена');
});
