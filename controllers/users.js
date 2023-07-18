const bcrypt = require('bcryptjs');
const User = require('../models/user');
const { CREATED_CODE, OK_CODE } = require('../constants/constants');
const { getJwtToken } = require('../helpers/jwt');
const UnauthorizedError = require('../helpers/errors/Unauthorized');
const ConflictError = require('../helpers/errors/ConflictError');
const BadRequestError = require('../helpers/errors/BadRequestError');
const NotFoundError = require('../helpers/errors/NotFoundError');

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
      return res.send({ token });
    })
    .catch(next);
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
      } else if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы неверные данные'));
      } else {
        next(err);
      }
    });
};

const getUsers = (req, res, next) => {
  User.find({})
    .then((users) => {
      res.send(users);
    })
    .catch(next);
};

const getUser = (req, res, next) => {
  const { userId } = req.params;
  User.findById(userId)
    .orFail(new NotFoundError('Такого пользователя нет в базе'))
    .then((user) => {
      res.status(OK_CODE).send(user);
    })
    .catch((err) => {
      if (err.message === 'Такого пользователя нет в базе') {
        next(new BadRequestError('Введены некорректные данные'));
      } else {
        next(err);
      }
    });
};

const getUserInfo = (req, res, next) => {
  User.findById(req.user.id._id)
    .then((user) => {
      if (!user) {
        next(new NotFoundError('Такой пользователь не найден'));
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
    .catch(next);
};

const updateProfil = (req, res, next) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user.id._id, { name, about }, { new: true, runValidators: true })
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
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user.id._id, { avatar }, { new: true, runValidators: true })
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
