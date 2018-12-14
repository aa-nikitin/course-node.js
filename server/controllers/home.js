const db = require('../models/db');
const nodemailer = require('nodemailer');
const config = require('../models/config.json');

module.exports.getHome = (req, res) => {
  res.render('index', {
    title: 'Главная',
    products: db.get('products').value(),
    skills: db.get('skills').value(),
    msgemail: `${req.flash('msgemail')}`
  });
};

module.exports.sendMsg = (req, res) => {
  if (!req.body.name || !req.body.email || !req.body.message) {
    req.flash('msgemail', 'Все поля нужно заполнить!');
    return res.redirect('/#form-msgemail');
  }
  const transporter = nodemailer.createTransport(config.mail.smtp);
  const mailOptions = {
    from: `"${req.body.name}" <${config.mail.smtp.auth.user}>`,
    to: config.mail.smtp.auth.user,
    subject: config.mail.subject,
    text:
      req.body.message.trim().slice(0, 500) +
      `\n Отправлено с: <${req.body.email}>`
  };

  transporter.sendMail(mailOptions, function(error) {
    if (error) {
      req.flash('msgemail', `При отправке письма произошла ошибка!: ${error}`);
      return res.redirect('/#form-msgemail');
    }
    req.flash('msgemail', 'Письмо успешно отправлено!');
    return res.redirect('/#form-msgemail');
  });
};
