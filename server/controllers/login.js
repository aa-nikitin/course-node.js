const db = require('../models/db');

module.exports.getLogin = async (ctx, next) => {
  if (ctx.session.isAdmin) {
    ctx.redirect('/admin');
  } else {
    ctx.render('login', { msglogin: ctx.flash.get() });
  }
};

module.exports.setLogin = async (ctx, next) => {
  const { login, pass } = db.getState().auth;
  const { email, password } = ctx.request.body;
  if (email !== login || password !== pass) {
    ctx.flash.set('Логин или пароль введен неверно!');
    ctx.redirect('/login');
  } else {
    ctx.session.isAdmin = true;
    ctx.redirect('/admin');
  }
};
