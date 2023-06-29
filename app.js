const express = require('express');

const bodyParser = require('body-parser');

const mongoose = require('mongoose');

const app = express();

const usersRouter = require('./routes/users');
const cardRouter = require('./routes/cards');

mongoose.connect('mongodb://127.0.0.1:27017/mestodb');

const { PORT = 3000 } = process.env;

app.use(bodyParser.json());

app.use((req, res, next) => {
  req.user = {
    _id: '64998894d20af4e3fbb1c37c',
  };

  next();
});

app.use('/users', usersRouter);
app.use('/cards', cardRouter);

app.listen(PORT, () => {
  console.log('Сервер запущен!');
});
