module.exports = {
  checkLogin: function(req, res, next) {
    if(!req.session.user) {
      req.flash('error', '目前还没登录');
      return res.redirect('/signin');
    } 

    next();
  },

  checkNotLogin: function(req, res, next) {
    if(req.session.user) {
      req.flash('error', '已经登录了');
      return res.redirect('back');
    }

    next();
  }
}