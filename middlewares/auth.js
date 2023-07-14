const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../helpers/errors/Unauthorized');
const NotFoundError = require('../helpers/errors/NotFoundError');

const SECRET_KEY = 'secret-key';

const auth = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer ')) {
    next(new UnauthorizedError('Ошибка авторизации'));
    return;
  }
  const token = authorization.replace('Bearer ', '');

  let payload;
  try {
    payload = jwt.verify(token, SECRET_KEY);
  } catch (err) {
    next(new NotFoundError('Ошибка авторизации'));
    return;
  }
  req.user = payload;
  next();
};

module.exports = { auth };
