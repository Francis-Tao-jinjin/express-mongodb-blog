// var express = require('express');
// var router = express.Router();

// router.get('/', function(req, res) {
//   res.send('This is my blog');
// });

// module.exports = router;

// 使用新的方式编写：
module.exports = function(app) {
  app.get('/', function(req, res) {
    res.send('This is my blog');
  });

  app.use('/signup', require('./signup'));
  app.use('/signin', require('./signin'));
  app.use('/signout', require('./signout'));
  app.use('/posts', require('./posts')); 
}