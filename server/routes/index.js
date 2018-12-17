const express = require('express');
const router = express.Router();

const {
  setSkills,
  setProducts,
  isAdmin,
  getAdmin
} = require('../controllers/admin');
const { getLogin, setLogin } = require('../controllers/login');
const { getHome, sendMsg } = require('../controllers/home');

router.get('/', getHome);

router.get('/login', getLogin);
router.post('/login', setLogin);

router.get('/admin', isAdmin, getAdmin);
router.post('/admin/skills', isAdmin, setSkills);
router.post('/admin/upload', isAdmin, setProducts);

router.post('/', sendMsg);

module.exports = router;
