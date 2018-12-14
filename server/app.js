const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
var flash = require('connect-flash-plus');

const routes = require('./routes');

app.use(
  session({
    secret: 'loftschool',
    key: 'sessionkey',
    cookie: {
      path: '/',
      httpOnly: true,
      maxAge: null
    },
    saveUninitialized: false,
    resave: false
  })
);

app.use(flash());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.set('views', path.join(__dirname, '../source/template/pages'));

app.set('view engine', 'pug');

app.use('/', routes);

app.use(express.static(path.join(__dirname, '../public')));

// app.use('/', routes);

app.use(function(req, res, next) {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('err', {
    message: err.message,
    error: err
  });
});

app.listen(3000, function() {
  console.log('Example app listening on port 3000!');
});
