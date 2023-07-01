const express = require('express');

const bodyParser = require('body-parser');

const mongoose = require('mongoose');

const { PORT = 3000 } = process.env;

const app = express();

const helmet = require('helmet');
const usersRouter = require('./routes/users');
const cardRouter = require('./routes/cards');
const { NOT_FOUND_ERROR_CODE } = require('./constants/constants');

mongoose.connect('mongodb://127.0.0.1:27017/mestodb');

app.use(bodyParser.json());

app.use((req, res, next) => {
  req.user = {
    _id: '64998894d20af4e3fbb1c37c',
  };

  next();
});

app.use('/users', usersRouter);
app.use('/cards', cardRouter);
app.use('/', (req, res) => {
  res.status(NOT_FOUND_ERROR_CODE).send({ message: 'Такой страницы не существует' });
});
app.use(helmet());

app.listen(PORT, () => {
  console.log('Сервер запущен!');
});
