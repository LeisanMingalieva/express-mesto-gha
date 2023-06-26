const express = require('express');

const mongoose = require('mongoose');

const userRouter = require('./routes/users');

const { PORT = 3000 } = process.env;

const app = express();

mongoose.connect('mongodb://127.0.0.1:27017/mestodb');

app.use('/users', userRouter);

app.listen(PORT, () => {
  console.log('Сервер запущен!');
});
