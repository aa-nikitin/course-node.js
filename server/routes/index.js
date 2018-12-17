const Router = require('koa-router');
const router = new Router();
const koaBody = require('koa-body');

const { getHome, setMessage } = require('../controllers/home');
const { getAdmin, setSkills, setProducts } = require('../controllers/admin');
const { getLogin, setLogin } = require('../controllers/login');

const isAdmin = (ctx, next) =>
  ctx.session.isAdmin ? next() : ctx.redirect('/');

router.get('/', getHome);
router.post('/', koaBody(), setMessage);

router.get('/admin', getAdmin);
router.post('/admin/skills', isAdmin, koaBody(), setSkills);
router.post(
  '/admin/upload',
  isAdmin,
  koaBody({
    multipart: true,
    formidable: {
      uploadDir: process.cwd() + '/public/assets/img/products'
    },
    formLimit: 1000000
  }),
  setProducts
);

router.get('/login', getLogin);
router.post('/login', koaBody(), setLogin);

module.exports = router;
