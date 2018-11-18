const fs = require('fs');
const copyFile = (source, target, cb) => {
  var cbCalled = false;

  var rd = fs.createReadStream(source);
  rd.on('error', err => {
    done(err);
  });
  var wr = fs.createWriteStream(target);
  wr.on('error', err => {
    done(err);
  });
  wr.on('close', () => {
    done();
  });
  rd.pipe(wr);

  const done = err => {
    if (!cbCalled) {
      cb(err);
      cbCalled = true;
    }
  };
};

module.exports = copyFile;
