const express = require('express');

const bodyParser = require('body-parser');

const mongoose = require('mongoose');

const app = express();

const usersRouter = require('./routes/users');

mongoose.connect('mongodb://127.0.0.1:27017/mestodb');

const { PORT = 3000 } = process.env;

app.use(bodyParser.json());

app.use('/users', usersRouter);

app.listen(PORT, () => {
  console.log('Сервер запущен!');
});
