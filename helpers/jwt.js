const jwt = require('jsonwebtoken');
const User = require('../models/user');

const SECRET_KEY = 'secret-key';

const getJwtToken = (id) => jwt.sign({ id }, SECRET_KEY);

const isAuthorize = (token) => jwt.verify(token, SECRET_KEY, { expiresIn: '7d' }, (err, decoded) => {
  if (err) return false;

  return User.findOne({ _id: decoded.id })
    .then((user) => Boolean(user));
});

module.exports = { getJwtToken, isAuthorize };
