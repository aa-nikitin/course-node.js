const fsPromises = require('fs').promises;
const path = require('path');
const fromDir = process.argv[2] ? process.argv[2] : '.';
const toDir = process.argv[3] ? process.argv[3] : './result';
const resolveDel = process.argv[4];
const folders = [];
const dirNames = [];

const moveFiles = async (link, del) => {
  try {
    const files = await fsPromises.readdir(link);

    for (let item of files) {
      const nestedLink = path.join(link, item);
      const state = await fsPromises.stat(nestedLink);
      if (state.isDirectory()) {
        await moveFiles(nestedLink, del);
        dirNames.push(nestedLink);
      } else {
        const nameFolder = item.charAt(0);
        const linkTo = path.join(toDir, nameFolder, item);
        if (folders.indexOf(nameFolder) < 0) {
          folders.push(nameFolder);
          await fsPromises.mkdir(path.join(toDir, nameFolder));
        }
        await fsPromises.copyFile(nestedLink, linkTo);
        if (del) await fsPromises.unlink(nestedLink);
      }
    }
  } catch (e) {
    console.log(e);
  }
};

const sortingСollections = async (linkFrom, linkTo, del) => {
  try {
    await fsPromises.mkdir(linkTo);
    await moveFiles(linkFrom, del);
    if (del) {
      for (let item of dirNames) {
        await fsPromises.rmdir(item);
      }
      await fsPromises.rmdir(linkFrom);
    }
  } catch (e) {
    console.log(e);
  }
};

sortingСollections(fromDir, toDir, resolveDel).then(() => {
  console.log('Обработка завершена');
});
