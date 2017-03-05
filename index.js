var path = require('path');
var express = require('express');
var app = express();
var indexRouter = require('./routes/index');
var userRouter = require('./routes/users');
console.log('path:',path.join(__dirname, 'views'));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// 传递错误信息，查看错误处理中间件是否正常
// app.use((req, res, next) => {
//   next(new Error('haha'));
// })

app.use('/', indexRouter);
app.use('/users', userRouter);

// 错误处理中间件
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke! 内部错误 500');
});

app.listen(3000);

