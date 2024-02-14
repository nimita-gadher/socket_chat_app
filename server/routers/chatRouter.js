const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');

router.post("/", chatController.createChat);
router.get("/:userId", chatController.findUserChat);
router.get("/find/:firstId/:secondId", chatController.findChat);
// router.get("/getAllChats", chatController.getAllChats);
router.get("/getAllChats", chatController.getAllChats);
router.delete('/deleteChat', chatController.deleteChat);
router.get('/getChatIdsByMemberId/:memberId', chatController.getChatIdsByMemberId);
router.post('/deleteChats', chatController.deleteChats);


module.exports = router;