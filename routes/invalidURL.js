const router = require('express').Router();

const { getInvalidURL } = require('../controllers/invalidURL');

router.all('/', getInvalidURL);

module.exports = router;
