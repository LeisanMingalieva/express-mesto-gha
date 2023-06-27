const Card = require('../models/card');

const createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner })
    .then((card) => {
      res.send(card);
    })
    .catch((error) => {
      res.status(400).send(error);
    });
};

const getCards = (req, res) => {
  Card.find({})
    .then((cards) => {
      res.send(cards);
    })
    .catch((error) => {
      res.status(400).send(error);
    });
};

const likeCard = (req, res) => {
  const { cardId } = req.params;
  Card.findByIdAndUpdate(
    cardId,
    {
      $addToSet: { likes: req.user._id }
    },
    { new: true },
  ).populate('owner')
    .then((card) => {
      res.send(card);
    })
    .catch((error) => {
      res.status(400).send(error);
    });
};

module.exports = {
  createCard,
  getCards,
  likeCard,
};
