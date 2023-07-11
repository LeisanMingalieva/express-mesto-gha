const router = require('express').Router();
const { userIdValidation, userInfoValidation, avatarValidation } = require('../middlewares/validation');

const {
  // createUser,
  getUsers,
  getUser,
  updateProfil,
  updateAvatar,
  getUserInfo,
} = require('../controllers/users');

// router.post('/', createUser);
router.get('/', getUsers);
router.get('/:userId', userIdValidation, getUser);
router.get('/me', getUserInfo);
router.patch('/me', userInfoValidation, updateProfil);
router.patch('/me/avatar', avatarValidation, updateAvatar);

module.exports = router;
