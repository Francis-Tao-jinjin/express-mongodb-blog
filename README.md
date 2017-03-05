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


