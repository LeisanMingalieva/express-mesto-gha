const Card = require('../models/card');
const { CREATED_CODE } = require('../constants/constants');
const NotFoundError = require('../helpers/errors/NotFoundError');
const ForbiddenError = require('../helpers/errors/ForiddenError');
const BadRequestError = require('../helpers/errors/BadRequestError');

const createCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user.id;
  Card.create({ name, link, owner })
    .then((card) => {
      res.status(CREATED_CODE).send({ name: card.name, link: card.link, _id: card._id });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы невалидные данные'));
      } else {
        next(err);
      }
    });
};

const getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => {
      res.send(cards);
    })
    .catch(next);
};

const deleteCard = (req, res, next) => {
  Card.findById(req.params.cardId)
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Такой карточки не существует');
      }
      if (req.user.id._id === card.owner.toString()) {
        return card.deleteOne();
      }
      throw new ForbiddenError('Вы не можете удалить карточку');
    })
    .then((removedCard) => res.send(removedCard))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Переданы невалидные данные'));
      } else {
        next(err);
      }
    });
};

const likeCard = (req, res, next) => {
  const { cardId } = req.params;
  Card.findByIdAndUpdate(cardId, { $addToSet: { likes: req.user.id._id } }, { new: true })
    .orFail(new BadRequestError('Карточка не найдена'))
    .then((card) => {
      res.send(card);
    })
    .catch((err) => {
      if (err.message === 'Карточка не найдена') {
        next(new NotFoundError('Такой карточки не существует'));
      } else {
        next(err);
      }
    });
};

const dislikeCard = (req, res, next) => {
  const { cardId } = req.params;
  Card.findByIdAndUpdate(cardId, { $pull: { likes: req.user.id._id } }, { new: true })
    .orFail(new BadRequestError('Карточка не найдена'))
    .then((card) => {
      res.send(card);
    })
    .catch((err) => {
      if (err.message === 'Карточка не найдена') {
        next(new NotFoundError('Такой карточки не существует'));
      } else {
        next(err);
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
