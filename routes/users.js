const router = require('express').Router();
const { userIdValidation, userInfoValidation, avatarValidation } = require('../middlewares/validation');

const {
  getUsers,
  getUser,
  updateProfil,
  updateAvatar,
  getUserInfo,
} = require('../controllers/users');

router.get('/', getUsers);
router.get('/me', getUserInfo);
router.get('/:userId', userIdValidation, getUser);
router.patch('/me', userInfoValidation, updateProfil);
router.patch('/me/avatar', avatarValidation, updateAvatar);

module.exports = router;
