const jwt = require('jsonwebtoken');
const { SECRET_KEY } = require('../constants/constants');

const getJwtToken = (id) => jwt.sign({ id }, SECRET_KEY, { expiresIn: '7d' });

module.exports = { getJwtToken };
