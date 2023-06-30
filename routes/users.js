const router = require('express').Router();

const {
  createUser,
  getUsers,
  getUser,
  updateProfil,
  updateAvatar,
} = require('../controllers/users');

router.post('/', createUser);
router.get('/', getUsers);
router.get('/:userId', getUser);
router.patch('/me', updateProfil);
router.patch('/me/avatar', updateAvatar);

module.exports = router;
