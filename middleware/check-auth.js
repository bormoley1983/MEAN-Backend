const jwt = require('jsonwebtoken');

module.exports = (req, resp, next) => {
  try {
    const authType = req.headers.authorization.split(' ')[0];
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, process.env.JWT_KEY);
    req.userData = { email: decodedToken.email, userId: decodedToken.userId };
    next();
  } catch (err) {
    console.error(err);
    resp.status(401).json({ message: 'User is not authentificated: ' + err });
  }
};
