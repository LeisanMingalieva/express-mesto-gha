const express = require('express');

const bodyParser = require('body-parser');

const app = express();

// const mongoose = require('mongoose');

const usersRouter = require('./routes/users');

// const { PORT = 3000 } = process.env;

// mongoose.connect('mongodb://localhost:27017/mestodb');
app.use(bodyParser.json());

app.use('/users', usersRouter);

app.listen(3000, () => {
  console.log('Сервер запущен!');
});
