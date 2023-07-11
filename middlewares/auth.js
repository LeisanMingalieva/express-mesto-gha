const jwt = require('jsonwebtoken');
const { BAD_REQUEST_ERROR_CODE } = require('../constants/constants');

const SECRET_KEY = 'secret-key';

module.exports.auth = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer')) {
    return res.status(BAD_REQUEST_ERROR_CODE).send({ message: 'Переданы неверные данные' });
  }
  const token = authorization.replace('Bearer', '');

  let payload;
  try {
    payload = jwt.verify(token, SECRET_KEY);
  } catch (err) {
    return res
      .status(BAD_REQUEST_ERROR_CODE)
      .send({ message: 'Переданы неверные данные' });
  }
  req.user = payload;
  next();
};
