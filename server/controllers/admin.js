const db = require('../models/db');
const formidable = require('formidable');
const fs = require('fs');
const path = require('path');

const validSkills = obj => {
  for (const key in obj) {
    if (!obj[key]) {
      return 'Поля не должны быть пустыми';
    } else if (obj[key] < 0) {
      return 'Значения не должны быть отрицательными';
    }
  }
  return false;
};
const modifySkills = obj => {
  for (const key in obj) {
    db.get('skills')
      .find({ id: key })
      .assign({ number: obj[key] })
      .write();
  }
};

const validProd = (fields, files) => {
  if (files.photo.name === '' || files.photo.size === 0) {
    return { status: 'Не загружена картинка!', err: true };
  }
  if (!fields.name) {
    return { status: 'Не указано наименование товара', err: true };
  }
  if (!fields.price) {
    return { status: 'Не указана цена товара!', err: true };
  }
  return { status: '', err: false };
};

module.exports.isAdmin = (req, res, next) => {
  if (req.session.isAdmin) {
    return next();
  }
  res.redirect('/login');
};

module.exports.getAdmin = (req, res) => {
  res.render('admin', {
    title: 'Админка',
    skills: db.get('skills').value(),
    msgskill: `${req.flash('msgskill')}`,
    msgfile: `${req.flash('msgfile')}`
  });
};

module.exports.setSkills = (req, res) => {
  const msgSkill = validSkills(req.body);

  if (msgSkill) {
    req.flash('msgskill', msgSkill);
    res.redirect('/admin');
  } else {
    modifySkills(req.body);
    req.flash('msgskill', 'Сохранено!');
    res.redirect('/admin');
  }
};

module.exports.setProducts = (req, res, next) => {
  let form = new formidable.IncomingForm();
  const upload = path.join('./public', 'assets', 'img', 'products');

  if (!fs.existsSync(upload)) {
    fs.mkdirSync(upload);
  }
  form.uploadDir = path.join(process.cwd(), upload);

  form.parse(req, function(err, fields, files) {
    if (err) {
      return next(err);
    }

    const valid = validProd(fields, files);

    if (valid.err) {
      req.flash('msgfile', valid.status);
      return res.redirect('/admin');
    }

    const fileName = path.join(upload, files.photo.name);

    fs.rename(files.photo.path, fileName, function(err) {
      if (err) {
        req.flash('msgfile', `Произошла ошибка!: ${err}`);
        return res.redirect('/admin');
      }

      let dir = fileName.substr(fileName.indexOf('\\'));
      db.get('products')
        .push({ src: dir, name: fields.name, price: fields.price })
        .write();
    });
    req.flash('msgfile', 'Товар успешно загружен!');
    return res.redirect('/admin');
  });
};
