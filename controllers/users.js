const bcrypt = require('bcryptjs');
const User = require('../models/user');
const {
  NOT_FOUND_ERROR_CODE,
  INTERNAL_SERVER_ERROR_CODE,
  BAD_REQUEST_ERROR_CODE,
  CREATED_CODE,
  OK_CODE,
} = require('../constants/constants');
const UnauthorizedError = require('../helpers/errors/Unauthorized');
const ConflictError = require('../helpers/errors/ConflictError');
const BadRequestError = require('../helpers/errors/BadRequestError');

const { getJwtToken } = require('../helpers/jwt');

const login = (req, res, next) => {
  const { email, password } = req.body;
  let baseUser;
  User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) return Promise.reject(new UnauthorizedError('Неправильные почта или пароль'));
      baseUser = user;
      return bcrypt.compare(password, baseUser.password);
    })
    .then((matched) => {
      if (!matched) return Promise.reject(new UnauthorizedError('Неправильные почта или пароль'));
      const token = getJwtToken({ _id: baseUser._id });
      res.send({ token });
    })
    .catch((err) => {
      next(err);
    });
};

const createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name, about, avatar, email, password: hash,
    }))
    .then((user) => {
      res.status(CREATED_CODE).send({
        name: user.name, about: user.about, avatar: user.avatar, email: user.email,
      });
    })
    .catch((err) => {
      if (err.code === 11000) {
        next(new ConflictError('Пользователь с таким Email уже существует'));
      } else if (err.name === 'CastError' || err.name === 'ValidationError') {
        next(new BadRequestError('Переданы неверные данные'));
      } else {
        next(err);
      }
    });
};

const getUsers = (req, res, next) => {
  // if (!isAuthorize(req.headers.authorization)) return res.status(401)
  // .send({ message: 'Необходима авторизация' });
  User.find({})
    .then((users) => {
      res.send(users);
    })
    .catch(next);
};

const getUser = (req, res) => {
// if (!isAuthorize(req.headers.authorization)) return res.status(401)
// .send({ message: 'Необходима авторизация' });
  const { userId } = req.params;
  User.findById(userId)
    .orFail(new Error('NotValidId'))
    .then((user) => {
      res.status(OK_CODE).send(user);
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
  // if (!isAuthorize(req.headers.authorization)) return res.status(401)
  // .send({ message: 'Необходима авторизация' });
  const userId = req.user_id;
  User.findById(userId)
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

const updateProfil = (req, res, next) => {
  // if (!isAuthorize(req.headers.authorization)) return res.status(401)
  // .send({ message: 'Необходима авторизация' });
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError(err.message));
      } else {
        next(err);
      }
    });
};

const updateAvatar = (req, res, next) => {
  // if (!isAuthorize(req.headers.authorization)) return res.status(401)
  // .send({ message: 'Необходима авторизация' });
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError(err.message));
      } else {
        next(err);
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
