const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const helmet = require('helmet');
const usersRouter = require('./routes/users');
const cardRouter = require('./routes/cards');
const { login, createUser } = require('./controllers/users');
const { auth } = require('./middlewares/auth');
const { registerValidation, loginValidation } = require('./middlewares/validation');
const { error } = require('./middlewares/error');
const NotFoundError = require('./helpers/errors/NotFoundError');

const { PORT = 3000 } = process.env;
const app = express();
app.listen(PORT, () => {
  console.log('Сервер запущен!');
});
mongoose.connect('mongodb://127.0.0.1:27017/mestodb');

app.use(bodyParser.json());
app.post('/signin', loginValidation, login);
app.post('/signup', registerValidation, createUser);
app.use(auth);
app.use('/users', usersRouter);
app.use('/cards', cardRouter);
app.use('/', () => {
  throw new NotFoundError('Такой страницы не существует');
});
app.use(helmet());
app.use(errors());
app.use(error);
