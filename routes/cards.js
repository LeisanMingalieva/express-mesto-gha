const router = require('express').Router();

const {
  createCard,
  getCards,
  likeCard,
  dislikeCard,
  deleteCard,
} = require('../controllers/cards');

const { cardIdValidation, cardValidation } = require('../middlewares/validation');

router.get('/', getCards);
router.post('/', cardValidation, createCard);
router.delete('/:cardId', cardIdValidation, deleteCard);
router.put('/:cardId/likes', likeCard);
router.delete('/:cardId/likes', dislikeCard);

module.exports = router;
