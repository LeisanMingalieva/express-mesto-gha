const express = require('express');

const bodyParser = require('body-parser');

const mongoose = require('mongoose');

const { PORT = 3000 } = process.env;

const app = express();

const usersRouter = require('./routes/users');
const cardRouter = require('./routes/cards');
const invalidRouter = require('./routes/invalidURL');

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
app.use('*', invalidRouter);

app.listen(PORT, () => {
  console.log('Сервер запущен!');
});
