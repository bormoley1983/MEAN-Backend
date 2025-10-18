const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

const EXPIRES_IN_STRING = '1h';
const EXPIRES_IN_INT = 3600;

exports.createUser = (req, resp, next) => {
  bcrypt.hash(req.body.password, 10).then((hash) => {
    const user = new User({
      email: req.body.email,
      password: hash,
    });
    user
      .save()
      .then((result) => {
        resp.status(201).json({
          massage: 'User created',
          result: result,
        });
      })
      .catch((err) => {
        console.error(err);
        return resp.status(401).json({
          message: 'Invalid user credentials',
          error: err,
        });
      });
  });
};

exports.login = async (req, resp, next) => {
  let userData;
  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return resp.status(401).json({
        message: 'Auth failed - User not found',
      });
    }

    userData = user;
    const isPasswordValid = await bcrypt.compare(
      req.body.password,
      user.password
    );

    if (!isPasswordValid) {
      return resp.status(401).json({
        message: 'Authentication failed',
      });
    }
    const token = jwt.sign(
      { email: userData.email, userId: userData._id },
      process.env.JWT_KEY,
      { expiresIn: EXPIRES_IN_STRING }
    );

    return resp.status(200).json({
      token: token,
      expiresIn: EXPIRES_IN_INT,
      userId: userData._id,
    });
  } catch (err) {
    console.error(err);
    return resp.status(401).json({
      message: 'Authentication failed',
      error: err,
    });
  }
};
