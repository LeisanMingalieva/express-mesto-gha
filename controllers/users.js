const bcrypt = require('bcryptjs');
const User = require('../models/user');
const {
  NOT_FOUND_ERROR_CODE,
  INTERNAL_SERVER_ERROR_CODE,
  BAD_REQUEST_ERROR_CODE,
  CREATED_CODE,
} = require('../constants/constants');

const { getJwtToken, isAuthorize } = require('../helpers/jwt');

const login = (req, res) => {
  const { email, password } = req.body;
  let baseUser;
  User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) return Promise.reject(new Error('Неправильные почта или пароль'));
      baseUser = user;
      return bcrypt.compare(password, baseUser.password);
    })
    .then((matched) => {
      if (!matched) return Promise.reject(new Error('Неправильные почта или пароль'));
      const token = getJwtToken({ _id: baseUser._id });
      return res.status(CREATED_CODE).send({ token });
    })
    .catch((err) => {
    // возвращаем ошибку аутентификации
      res
        .status(401)
        .send({ message: err.message });
    });
};

const createUser = (req, res) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  return bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name, about, avatar, email, password: hash,
    }))
    .then(() => {
      res.status(CREATED_CODE).send({ message: `Пользователь ${email} успешно зарегистрирован` });
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
  if (!isAuthorize(req.headers.authorization)) return res.status(401).send({ message: 'Необходима авторизация' });
  return User.find({})
    .then((users) => {
      res.send(users);
    })
    .catch(() => {
      res.status(INTERNAL_SERVER_ERROR_CODE).send({ message: 'Ошибка сервера' });
    });
};

const getUser = (req, res) => {
  if (!isAuthorize(req.headers.authorization)) return res.status(401).send({ message: 'Необходима авторизация' });
  const { userId } = req.params;
  return User.findById(userId)
    .orFail(new Error('NotValidId'))
    .then((user) => {
      res.status(200).send(user);
    })
    .catch((err) => {
      if (err.message === 'NotValidId') {
        res.status(NOT_FOUND_ERROR_CODE).send({ message: 'Такого пользователя нет в базе' });
      } else {
        res.status(BAD_REQUEST_ERROR_CODE).send({ message: 'Введены некорректные данные' });
      }
    });
};

const getUserInfo = (req, res) => {
  if (!isAuthorize(req.headers.authorization)) return res.status(401).send({ message: 'Необходима авторизация' });
  const userId = req.user_id;
  return User.findById(userId)
    .then((user) => {
      if (!user) {
        res.status(NOT_FOUND_ERROR_CODE).send({ message: 'Такой пользователь не найден' });
      } else {
        res.send({
          _id: user._id,
          name: user.name,
          about: user.about,
          avatar: user.avatar,
          email: user.email,
        });
      }
    })
    .catch(() => {
      res.status(INTERNAL_SERVER_ERROR_CODE).send({ message: 'Ошибка сервера' });
    });
};

const updateProfil = (req, res) => {
  if (!isAuthorize(req.headers.authorization)) return res.status(401).send({ message: 'Необходима авторизация' });
  const { name, about } = req.body;
  return User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
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
  if (!isAuthorize(req.headers.authorization)) return res.status(401).send({ message: 'Необходима авторизация' });
  const { avatar } = req.body;
  return User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
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
  login,
  getUserInfo,
};
