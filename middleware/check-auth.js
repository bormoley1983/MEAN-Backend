const jwt = require('jsonwebtoken');

module.exports = (req, resp, next) => {
  try {
    const authType = req.headers.authorization.split(' ')[0];
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, 'secret_passspharse');
    req.UserData = { email: decodedToken.email, userId: decodedToken.userId };
    next();
  } catch (error) {
    console.log(error);
    resp.status(401).json({ message: 'Auth failed: ' + error });
  }
};
