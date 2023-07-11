const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const { PORT = 3000 } = process.env;
const app = express();

const helmet = require('helmet');
const usersRouter = require('./routes/users');
const cardRouter = require('./routes/cards');
const { login, createUser } = require('./controllers/users');
const { auth } = require('./middlewares/auth');
const { NOT_FOUND_ERROR_CODE } = require('./constants/constants');
const { registerValidation, loginValidation } = require('./middlewares/validation');

mongoose.connect('mongodb://127.0.0.1:27017/mestodb');

app.use(bodyParser.json());
app.post('/signin', loginValidation, login);
app.post('/signup', registerValidation, createUser);
app.use('/users', auth, usersRouter);
app.use('/cards', auth, cardRouter);
app.use('/', (req, res) => {
  res.status(NOT_FOUND_ERROR_CODE).send({ message: 'Такой страницы не существует' });
});

app.use(helmet());

app.listen(PORT, () => {
  console.log('Сервер запущен!');
});
