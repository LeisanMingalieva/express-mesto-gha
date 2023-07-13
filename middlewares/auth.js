const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../helpers/errors/Unauthorized');
const NotFoundError = require('../helpers/errors/NotFoundError');

const SECRET_KEY = 'secret-key';

const auth = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer')) {
    return next(new UnauthorizedError('Ошибка авторизации'));
  }
  const token = authorization.replace('Bearer', '');

  let payload;
  try {
    payload = jwt.verify(token, SECRET_KEY, { expiresIn: '7d' });
  } catch (err) {
    return next(new NotFoundError('Ошибка авторизации'));
  }
  req.user = payload;
  next();
};

module.exports = { auth };
