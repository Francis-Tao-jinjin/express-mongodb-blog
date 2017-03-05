module.exports = {
  port: 3000,
  session: {
    secret: 'myblog',
    key: 'myblog',
    maxAge: 1999999999
  },
  mongodb: 'mongodb://localhost:27017/myblog'
};