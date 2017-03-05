var express = require('express');
var router = express.Router();

var checkLogin = require('../middlewares/check').checkLogin;

// GET /posts 所有用户或者特定用户的文章页
//   eg: GET /posts?author=xxx
router.get('/', (req, res) => {
  res.send(req.flash());
});

// 查看一篇文章（包含留言）
router.get('/:postId', (req, res) => {
  res.send(req.flash());
});

// 发表文章页
router.get('/create', checkLogin, (req, res) => {
  res.send(req.flash());
});

// 发表文章
router.post('/', checkLogin, (req, res) => {
  res.send(req.flash());
});

// 修改文章页
router.get('/:postId/edit', checkLogin, (req, res) => {
  res.send(req.flash());
});

// 修改文章
router.post('/:postId/edit', checkLogin, (req, res) => {
  res.send(req.flash());
});

// 删除文章
router.get('/:postId/remove', checkLogin, (req, res) => {
  res.send(req.flash());
});

// 创建评论
router.post('/:postId/comment', checkLogin, (req, res) => {
  res.send(req.flash());
});

// 删除评论
router.get('/:postId/comment/:commentId/remove', checkLogin, (req, res) => {
  res.send(req.flash());
});

module.exports = router;




