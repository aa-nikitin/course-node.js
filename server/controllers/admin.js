const db = require('../models/db');
const fs = require('fs');
const util = require('util');
const _path = require('path');
const rename = util.promisify(fs.rename);

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

const validProd = (fields, files) => {
  if (files.name === '' || files.size === 0) {
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

const modifySkills = obj => {
  for (const key in obj) {
    db.get('skills')
      .find({ id: key })
      .assign({ number: obj[key] })
      .write();
  }
};

module.exports.getAdmin = async ctx => {
  if (!ctx.session.isAdmin) {
    ctx.redirect('/login');
  } else {
    const { msgskill, msgfile } = ctx.flash.get() ? ctx.flash.get() : '';

    ctx.render('admin', {
      msgskill: `${msgskill ? msgskill : ''}`,
      msgfile: `${msgfile ? msgfile : ''}`,
      skills: db.getState().skills
    });
  }
};

module.exports.setSkills = async ctx => {
  const msgSkill = validSkills(ctx.request.body);
  if (msgSkill) {
    ctx.flash.set({ msgskill: msgSkill });
    ctx.redirect('/admin');
  } else {
    modifySkills(ctx.request.body);
    ctx.flash.set({ msgskill: 'Сохранено!' });
    ctx.redirect('/admin');
  }
};

module.exports.setProducts = async ctx => {
  const { name: namePhoto, price } = ctx.request.body;
  const { name, path } = ctx.request.files.photo;
  const valid = validProd(ctx.request.body, ctx.request.files.photo);
  if (valid.err) {
    ctx.flash.set({ msgfile: valid.status });
    return ctx.redirect('/admin');
  }
  let fileName = _path.join('assets', 'img', 'products', name);
  const errUpload = await rename(
    path,
    _path.join(process.cwd(), 'public', fileName)
  );
  if (errUpload) {
    ctx.flash.set({
      msgfile: 'При работе с картинкой произошла ошибка на сервере'
    });
    return ctx.redirect('/admin');
  }

  db.get('products')
    .push({
      src: fileName,
      name: namePhoto,
      price: price
    })
    .write();

  ctx.flash.set({
    msgfile: 'Товар успешно добавлен'
  });
  ctx.redirect('/admin');
};
