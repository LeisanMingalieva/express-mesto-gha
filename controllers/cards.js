const Card = require('../models/card');
const {
  NOT_FOUND_ERROR_CODE,
  INTERNAL_SERVER_ERROR_CODE,
  BAD_REQUEST_ERROR_CODE,
  CREATED_CODE,
} = require('../constants/constants');
const NotFoundError = require('../helpers/errors/NotFoundError');
const ForbiddenError = require('../helpers/errors/ForiddenError');
const BadRequestError = require('../helpers/errors/BadRequestError');

const createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user.id;
  console.log(owner);
  Card.create({ name, link, owner })
    .then((card) => {
      res.status(CREATED_CODE).send({ name: card.name, link: card.link, _id: card._id });
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

// const deleteCard = (req, res) => {
//   const { cardId } = req.params;
//   Card.findByIdAndRemove(cardId)
//     .orFail(new Error('NotValidId'))
//     .then((card) => {
//       res.send(card);
//     })
//     .catch((err) => {
//       if (err.message === 'NotValidId') {
//         res.status(NOT_FOUND_ERROR_CODE).send({ message: 'Такой карточки не существует' });
//       } else {
//         res.status(BAD_REQUEST_ERROR_CODE).send({ message: 'Ошибка сервера' });
//       }
//     });
// };
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
      if (err.name === 'Cast Error') {
        next(new BadRequestError('переданы невалидные данные'));
      } else {
        next(err);
      }
    });
};

const likeCard = (req, res) => {
  const { cardId } = req.params;
  Card.findByIdAndUpdate(cardId, { $addToSet: { likes: req.user.id._id } }, { new: true })
    .orFail(new Error('NotValidId'))
    .then((card) => {
      res.send(card);
    })
    .catch((err) => {
      if (err.message === 'NotValidId') {
        res.status(NOT_FOUND_ERROR_CODE).send({ message: 'Такой карточки не существует' });
      } else {
        res.status(BAD_REQUEST_ERROR_CODE).send({ message: 'Ошибка сервера' });
      }
    });
};

const dislikeCard = (req, res) => {
  const { cardId } = req.params;
  Card.findByIdAndUpdate(cardId, { $pull: { likes: req.user.id._id } }, { new: true })
    .orFail(new Error('NotValidId'))
    .then((card) => {
      res.send(card);
    })
    .catch((err) => {
      if (err.message === 'NotValidId') {
        res.status(NOT_FOUND_ERROR_CODE).send({ message: 'Такой карточки не существует' });
      } else {
        res.status(BAD_REQUEST_ERROR_CODE).send({ message: 'Ошибка сервера' });
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
