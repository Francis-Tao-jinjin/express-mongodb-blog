var express = require('express');
var router = express.Router();

router.get('/:name', function(req, res) {
  // res.render 的作用就是将模板和数据结合生成 html，
  // 同时设置响应头中的 Content-Type: text/html，
  // 告诉浏览器我返回的是 html，不是纯文本，要按 html 展示。
  // 'users' 为要渲染的文件名
  res.render('users', {
    name: req.params.name
  });
});

module.exports = router;