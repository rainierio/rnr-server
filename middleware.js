const jwt = require('jsonwebtoken');
const secret = 'EzGDaF0dQvu62UA0UNp7MzbGHLlukzv'

const withAuth = function(req, res, next) {
    const userSession = req.cookies.USER_SESSION;
    if (!userSession) {
      res.status(401).send('Unauthorized: No token provided');
    } else {
      jwt.verify(userSession, secret, function(err, decoded) {
        if (err) {
          res.status(401).send('Unauthorized: Invalid token');
        } else {
          req.email = decoded.email;
          next();
        }
      });
    }
  }
module.exports = withAuth;