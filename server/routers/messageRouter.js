const express = require('express');
const messageController = require('../controllers/messageController');
const router = express.Router();

router.post("/", messageController.createMessage);
router.get("/:chatId", messageController.getMessages);
router.post("/update/:messageId", messageController.updateMessageStatus);
router.post('/update-status', messageController.updateStatusAllMessages);
router.delete('/deleteMessage/:messageId', messageController.deleteMessage);
router.delete('/deleteMessageByChatId/:chatId', messageController.deleteMessageByChatId);
router.post('/deleteMessagesByChatIds', messageController.deleteMessagesByChatIds);

module.exports = router;