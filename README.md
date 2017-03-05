# 使用 Express 和 MongoDB 搭建博客
这个项目比较接近从后端出发开发网站的方式，而不是目前流行的前后端分离的方式，所以没有使用 AngularJs、Vue 等前端框架，使用 ejs 做模版引擎，其实开发的方式和从前用 java、jsp、mysql 没有太大的区别。

## 目录结构
```shell
mgblog (root)
└─┬ models          --- 存放操作数据库的文件
  ├─┬ public        --- 存放静态文件，如样式、图片等
  │ ├── css
  │ └── img
  ├── routes        --- 存放路由文件
  ├── views         --- 存放模版文件
  ├── index.js      --- 主程序入口
  └── package.json 
```
所需要安装的模块：

1. `express`: web 框架

2. `express-session`: session 中间件

3. `connect-mongo`: 将 session 存储于 mongodb，结合 express-session 使用

4. `connect-flash`: 页面通知提示的中间件，基于 session 实现

5. `ejs`: 模板

6. `express-formidable`: 接收表单及文件的上传中间件

7. `config-lite`: 读取配置文件

8. `marked`: markdown 解析

9. `moment`: 时间格式化

10. `mongolass`: mongodb 驱动

11. `objectid-to-timestamp`: 根据 ObjectId 生成时间戳

12. `sha1`: sha1 加密，用于密码加密

13. `winston`: 日志

14. `express-winston`: 基于 winston 的用于 express 的日志中间件

config-lite 是一个轻量的读取配置文件的模块。config-lite 会根据环境变量（NODE_ENV）的不同从当前执行进程目录下的 config 目录加载不同的配置文件。如果不设置 NODE_ENV，则读取默认的 default 配置文件，如果设置了 NODE_ENV，则会合并指定的配置文件和 default 配置文件作为配置，config-lite 支持 .js、.json、.node、.yml、.yaml 后缀的文件。

如果程序以 NODE_ENV=test node app 启动，则通过 require('config-lite') 会依次降级查找 config/test.js、config/test.json、config/test.node、config/test.yml、config/test.yaml 并合并 default 配置; 如果程序以 NODE_ENV=production node app 启动，则通过 require('config-lite') 会依次降级查找 config/production.js、config/production.json、config/production.node、config/production.yml、config/production.yaml 并合并 default 配置。

首先编写配置文件：
```bash
mkdir config
touch config/default.js
```
里面写入端口、数据控入口、session的配置数据：
```js
module.exports = {
  port: 3000,
  session: {
    secret: 'myblog',
    key: 'myblog',
    maxAge: 2592000000
  },
  mongodb: 'mongodb://localhost:27017/myblog'
};
```

## 一切从简
从功能到设计都只先做出最简单的版本，若要更多的功能可以之后拓展。
因此所需功能初步有：1.注册、2.登陆、3.登出、4.阅读文章、5.发表文章、6.修改文章、7.删除文章、8.评论
具体的 API 大致有：

1. 注册
    1. 注册页：`GET /signup`
    2. 注册（包含上传头像）：`POST /signup`
2. 登录
    1. 登录页：`GET /signin`
    2. 登录：`POST /signin`
3. 登出：`GET /signout`
4. 查看文章
    1. 主页：`GET /posts`
    2. 个人主页：`GET /posts?author=xxx`
    3. 查看一篇文章（包含留言）：`GET /posts/:postId`
5. 发表文章
    1. 发表文章页：`GET /posts/create`
    2. 发表文章：`POST /posts`
6. 修改文章
    1. 修改文章页：`GET /posts/:postId/edit`
    2. 修改文章：`POST /posts/:postId/edit`
7. 删除文章：`GET /posts/:postId/remove`
8. 评论
    1. 创建评论：`POST /posts/:postId/comment`
    2. 删除评论：`GET /posts/:postId/comment/:commentId/remove`

## Session
由于 HTTP 协议是无状态的协议，所以服务端需要记录用户的状态时，就需要用某种机制来识别具体的用户，这个机制就是会话（Session）。
> 典型的场景比如购物车，当你点击下单按钮时，由于HTTP协议无状态，所以并不知道是哪个用户操作的，所以服务端要为特定的用户创建了特定的Session，用用于标识这个用户，并且跟踪用户，这样才知道购物车里面有几本书。这个Session是保存在服务端的，有一个唯一标识。在服务端保存Session的方法很多，内存、数据库、文件都有。集群的时候也要考虑Session的转移，在大型的网站，一般会有专门的Session服务器集群，用来保存用户会话，这个时候 Session 信息都是放在内存的，使用一些缓存服务比如Memcached之类的来放 Session。

链接：https://www.zhihu.com/question/19786827/answer/28752144
安装的 express-session 中间件就是用来支持会话的：
```js
app.use(session(options));
```

## 页面通知
类似于 Android 中的 Toast，通过 connect-flash 中间件实现。
**express-session、connect-mongo 和 connect-flash 的区别与联系**

1. express-session: 会话（session）支持中间件
2. connect-mongo: 将 session 存储于 mongodb，需结合 express-session 使用，我们也可以将 session 存储于 redis，如 connect-redis
3. connect-flash: 基于 session 实现的用于通知功能的中间件，*需结合 express-session 使用*

## 权限控制
区分已登录用户和为登录用户，他们能够使用的功能是不同的，所以有必要在服务器确认发送请求的用户是否已经登录。由于不止一个模块要用到这个功能，所以将功能单独拿出来放到一个工具模块里：
```bash
mkdir middlewares
touch middlewares/check.js
```
在文件中填上：
```js
module.exports = {
  /* 
  当用户信息（req.session.user）缺失，即认为用户没有登录，则跳转到登录页，同时显示 未登录的通知。
  场景：用于需要用户登录才能操作的页面及接口
   */
  checkLogin: function(req, res, next) {
    if(!req.session.user) {
      req.flash('error', '目前还没登录');
      return res.redirect('/signin');
    } 

    next();
  },

  /*当用户信息（req.session.user）存在，即认为用户已经登录，则跳转到之前的页面，同时显示 已登录的通知。
  场景：如登录、注册页面及登录、注册的接口。
  */
  checkNotLogin: function(req, res, next) {
    if(req.session.user) {
      req.flash('error', '已经登录了');
      return res.redirect('back');
    }

    next();
  }
}
```
之后将 routes 下的文件各个文件写上各自api对应的路由，具体见源代码。
需要注意的是主程序 index.js 的改动，在这里需要把会用到的中间件都按照合法的格式注册，最好参考各个插件的 npm 官方示例，因为其中可能有的插件版本更新之后，使用方法已经改变了。
```js
var path = require('path');
var express = require('express');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var flash = require('connect-flash');
var config = require('config-lite');
var routes = require('./routes');
var pkg = require('./package');  // package.json

var app = express();

// 设置模板目录
app.set('views', path.join(__dirname, 'views'));
// 设置模板引擎为 ejs
app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  name: config.session.key,       // 设置 cookie 中保存 session id 的字段名称
  secret: config.session.secret,  // 通过设置 secret 来计算 hash 值并放在 cookie 中，使产生的 signedCookie 防篡改
  resave: true,                   // 强制更新 session
  saveUninitialized: false,       // 设置为 false，强制创建一个 session，即使用户未登录
  cookie: {
    maxAge: config.session.maxAge // 过期时间，过期后 cookie 中的 session id 自动删除
  },
  store: new MongoStore({         // 将 session 存储到 mongodb
    url: config.mongodb           // mongodb 地址
  })
}));
app.use(flash()); // *****

routes(app); //注册路由

// 错误处理中间件
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke! 内部错误 500');
});

app.listen(config.port, () => {
  console.log(`${pkg.name} listening on port ${config.port}`);
});
```









