const Card = require('../models/card');
const { NOT_FOUND_ERROR_CODE, INTERNAL_SERVER_ERROR_CODE, BAD_REQUEST_ERROR_CODE } = require('../constants/constants');

const createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner })
    .then((card) => {
      res.send({ name: card.name, link: card.link, _id: card._id });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(BAD_REQUEST_ERROR_CODE).send({ message: 'Переданы неверные данные' });
      } else {
        res.status(INTERNAL_SERVER_ERROR_CODE).send({ message: 'Ошибка сервера' });
      }
    });
};

const getCards = (req, res) => {
  Card.find({})
    .then((cards) => {
      res.send(cards);
    })
    .catch(() => {
      res.status(INTERNAL_SERVER_ERROR_CODE).send({ message: 'Ошибка сервера' });
    });
};

const deleteCard = (req, res) => {
  const { cardId } = req.params;
  Card.findByIdAndRemove(cardId)
    .then((card) => {
      if (!card) {
        res.status(NOT_FOUND_ERROR_CODE).send({ message: 'Такой карточки не существует' });
      } else {
        res.send(card);
      }
    })
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        res.status(BAD_REQUEST_ERROR_CODE).send({ message: 'Переданы неверные данные' });
      } else {
        res.status(INTERNAL_SERVER_ERROR_CODE).send({ message: 'Ошибка сервера' });
      }
    });
};

const likeCard = (req, res) => {
  const { cardId } = req.params;
  Card.findByIdAndUpdate(cardId, { $addToSet: { likes: req.user._id } }, { new: true })
    .then((card) => {
      if (!card) {
        res.status(NOT_FOUND_ERROR_CODE).send({ message: 'Такой карточки не существует' });
      } else {
        res.send(card);
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

const dislikeCard = (req, res) => {
  const { cardId } = req.params;
  Card.findByIdAndUpdate(cardId, { $pull: { likes: req.user._id } }, { new: true })
    .then((card) => {
      if (!card) {
        res.status(NOT_FOUND_ERROR_CODE).send({ message: 'Такой карточки не существует' });
      } else {
        res.send(card);
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

module.exports = {
  createCard,
  getCards,
  likeCard,
  dislikeCard,
  deleteCard,
};
