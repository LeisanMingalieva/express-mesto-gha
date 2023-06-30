const User = require('../models/user');
const { NOT_FOUND_ERROR_CODE, INTERNAL_SERVER_ERROR_CODE, BAD_REQUEST_ERROR_CODE } = require('../constants/constants');

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => {
      res.send({
        name: user.name, about: user.about, _id: user._id, avatar: user.avatar,
      });
    })
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        res.status(BAD_REQUEST_ERROR_CODE).send({ message: 'Переданы неверные данные' });
      } else {
        res.status(INTERNAL_SERVER_ERROR_CODE).send({ message: 'Ошибка сервера' });
      }
    });
};

const getUsers = (req, res) => {
  User.find({})
    .then((users) => {
      res.send(users);
    })
    .catch(() => {
      res.status(INTERNAL_SERVER_ERROR_CODE).send({ message: 'Ошибка сервера' });
    });
};

const getUser = (req, res) => {
  const { userId } = req.params;
  User.findById(userId)
    .then((user) => {
      if (!user) {
        res.status(NOT_FOUND_ERROR_CODE).send({ message: 'Такой пользователь не найден' });
      } else {
        res.send(user);
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(BAD_REQUEST_ERROR_CODE).send({ message: 'Переданы неверные данные' });
      } else {
        res.status(INTERNAL_SERVER_ERROR_CODE).send({ message: 'Ошибка сервера' });
      }
    });
};

const updateProfil = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(BAD_REQUEST_ERROR_CODE).send({ message: 'Переданы неверные данные' });
      } else {
        res.status(INTERNAL_SERVER_ERROR_CODE).send({ message: 'Ошибка сервера' });
      }
    });
};

const updateAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(BAD_REQUEST_ERROR_CODE).send({ message: 'Переданы неверные данные' });
      } else {
        res.status(INTERNAL_SERVER_ERROR_CODE).send({ message: 'Ошибка сервера' });
      }
    });
};

module.exports = {
  createUser,
  getUsers,
  getUser,
  updateProfil,
  updateAvatar,
};
