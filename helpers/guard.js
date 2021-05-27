const passport = require('passport');
const { httpCode } = require('./constants');
require('../config/passport');

const guard = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (err, user) => {
    let token = null;
    if (req.get('Authorization')) {
      token=req.get('Authorization').split(" ")[1]
    }
    if (!user || err || token !== user.token) {
      return res.status(httpCode.UNAUTHORIZED).json({
        status: 'error',
        code: httpCode.UNAUTHORIZED,
        message: "Not authorized"
      })
    }
    req.user = user;
    return next();
  })(req,res,next)
}
module.exports = guard;