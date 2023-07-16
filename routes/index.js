const router = require('express').Router();

const usersRouter = require('./users');
const cardRouter = require('./cards');
const { login, createUser } = require('../controllers/users');
const { auth } = require('../middlewares/auth');
const { registerValidation, loginValidation } = require('../middlewares/validation');
const NotFoundError = require('../helpers/errors/NotFoundError');

router.post('/signin', loginValidation, login);
router.post('/signup', registerValidation, createUser);
router.use(auth);
router.use('/users', usersRouter);
router.use('/cards', cardRouter);
router.use('/', (req, res, next) => {
  next(new NotFoundError('Такой страницы не существует'));
});

module.exports = router;
