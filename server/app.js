const Koa = require('koa');
const app = new Koa();
const serve = require('koa-static');
const session = require('koa-session');
const flash = require('koa-flash-simple');

const routes = require('./routes');

const Pug = require('koa-pug');

const pug = new Pug({
  viewPath: './source/template/pages',
  pretty: false,
  basedir: './source/template/pages',
  app: app
});

app.use(
  session(
    {
      key: 'koa:sess',
      maxAge: 'session',
      overwrite: true,
      httpOnly: true,
      signed: false,
      rolling: false,
      renew: false
    },
    app
  )
);

app.use(serve('./public'));

app.use(flash());

app.use(routes.routes());

app.listen(3000, function() {
  console.log('Server running on https://localhost:3000');
});
