var express = require('express');
var router = express.Router();

var checkLogin = require('../middlewares/check').checkLogin;

// 要使用的中间件直接放进参数列表
// GET /signout 退出页面
router.get('/', checkLogin, (req, res, next) => {
  res.send(req.flash());
});

// // POST /signup 注册提交的表单
// router.get('/', checkNotLogin, (req, res, next) => {
//   res.send(req.flash());
// });

module.exports = router;

