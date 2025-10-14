const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/user');
const router = express.Router();

const EXPIRES_IN_STRING = '1h';
const EXPIRES_IN_INT = 3600;

router.post('/signup', (req, resp, next) => {
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
        resp.status(500).json({
          error: err,
        });
      });
  });
});

router.post('/login', (req, resp, next) => {
  let userData;

  User.findOne({ email: req.body.email })
    .then((user) => {
      userData = user;
      if (!user) {
        return resp.status(401).json({
          message: 'User does not exist',
        });
      }
      userData = user;
      return bcrypt.compare(req.body.password, user.password);
    })
    .then((result) => {
      if (!result) {
        return resp.status(401).json({
          message: 'Authentication failed',
        });
      }
      const token = jwt.sign(
        { email: userData.email, userId: userData._id },
        'secret_passspharse',
        { expiresIn: EXPIRES_IN_STRING }
      );

      resp.status(200).json({
        token: token,
        expiresIn: EXPIRES_IN_INT,
        userId: userData._id,
      });
    })
    .catch((err) => {
      console.error(err);
      return resp.status(401).json({
        message: 'Authentication failed: ' + err,
      });
    });
});

module.exports = router;
