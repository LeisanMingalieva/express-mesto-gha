const {
  NOT_FOUND_ERROR_CODE,
} = require('../constants/constants');

const getInvalidURL = (req, res) => {
  res.status(NOT_FOUND_ERROR_CODE).send({ message: 'Такой страницы не существует' });
};

module.exports = { getInvalidURL };
