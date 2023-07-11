const router = require('express').Router();

const {
  // createUser,
  getUsers,
  getUser,
  updateProfil,
  updateAvatar,
  getUserInfo
} = require('../controllers/users');

// router.post('/', createUser);
router.get('/', getUsers);
router.get('/:userId', getUser);
router.get('/me', getUserInfo);
router.patch('/me', updateProfil);
router.patch('/me/avatar', updateAvatar);

module.exports = router;
