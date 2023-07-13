const jwt = require('jsonwebtoken');
const { UNAUTHORIZE_ERROR_CODE } = require('../constants/constants');

const SECRET_KEY = 'secret-key';

const auth = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer')) {
    return res.status(UNAUTHORIZE_ERROR_CODE).send({ message: 'Ошибка авторизации' });
  }
  const token = authorization.replace('Bearer', '');

  let payload;
  try {
    payload = jwt.verify(token, SECRET_KEY);
  } catch (err) {
    return res
      .status(UNAUTHORIZE_ERROR_CODE)
      .send({ message: 'Ошибка авторизации' });
  }
  req.user = payload;
  next();
};

module.exports = { auth };
