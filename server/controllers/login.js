const db = require('../models/db');

module.exports.getLogin = (req, res) => {
  if (req.session.isAdmin) {
    res.redirect('/admin');
  } else {
    res.render('login', {
      title: 'Авторизация'
    });
  }
};

module.exports.setLogin = (req, res) => {
  const { email, password } = req.body;
  const { login, pass } = db.get('auth').value();

  if (email !== login || password !== pass) {
    res.render('login', {
      msglogin: 'Неверно введен логин или пароль',
      email: email,
      title: 'Авторизация'
    });
  } else {
    req.session.isAdmin = true;
    res.redirect('/admin');
  }
};
