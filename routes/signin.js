var express = require('express');
var router = express.Router();

var checkNotLogin = require('../middlewares/check').checkNotLogin;

// 要使用的中间件直接放进参数列表
// GET /signin 登录页面
router.get('/', checkNotLogin, (req, res, next) => {
  res.send(req.flash());
});

// POST /signin 登录提交的表单
router.get('/', checkNotLogin, (req, res, next) => {
  res.send(req.flash());
});

module.exports = router;

