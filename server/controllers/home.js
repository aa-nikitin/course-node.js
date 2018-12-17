const db = require('../models/db');

const validMail = obj => {
  for (const key in obj) {
    if (!obj[key]) {
      return 'Поля не должны быть пустыми';
    }
  }
  return false;
};

module.exports.getHome = async ctx => {
  ctx.render('index', {
    skills: db.getState().skills,
    products: db.getState().products,
    msgemail: `${ctx.flash.get() ? ctx.flash.get() : ''}`
  });
};

module.exports.setMessage = async ctx => {
  const { name, email, message } = ctx.request.body;
  const msgsEmail = validMail(ctx.request.body);
  if (msgsEmail) {
    ctx.flash.set(msgsEmail);
    ctx.redirect('/#form-msgemail');
  } else {
    db.get('orders')
      .push({
        name: name,
        email: email,
        message: message
      })
      .write();
    ctx.flash.set('Ваша заявка отправлена!');
    ctx.redirect('/#form-msgemail');
  }
};
