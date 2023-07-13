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
const NotFoundError = require('./helpers/errors/NotFoundError');

const { PORT = 3000 } = process.env;
const app = express();
mongoose.connect('mongodb://127.0.0.1:27017/mestodb');

app.use(bodyParser.json());
app.post('/signin', loginValidation, login);
app.post('/signup', registerValidation, createUser);
app.use('/users', auth, usersRouter);
app.use('/cards', auth, cardRouter);
app.use('/', () => {
  throw new NotFoundError('Такой страницы не существует');
});
app.use(helmet());
app.use(errors());
app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res.status(statusCode).send({
    message: statusCode === 500 ? 'На сервере произошла ошибка' : message,
  });
  next();
});

app.listen(PORT, () => {
  console.log('Сервер запущен!');
});
