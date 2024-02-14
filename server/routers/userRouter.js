const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

router.post('/register', userController.register);
router.post('/login', userController.login);
router.get('/find/:id', userController.findUser);
router.get('/', userController.getAllUsers);
router.post('/search', userController.searchUser);
router.post('/changeProfileImage/:userId', userController.uploadProfileImage);
router.post('/editProfile/:userId', userController.editProfile);
router.delete('/deleteUserProfile/:userId', userController.deleteUserProfile);

module.exports = router;