const messageModel = require("../models/Message");
const CryptoJS = require("crypto-js");


// Generate a random key for AES-256 encryption
const key = "mySecretKey123"; // 32 bytes = 256 bits

// Encrypt function
const encryptText = (text, key) => {
    const encrypted = CryptoJS.AES.encrypt(text, key).toString();
    return encrypted;
}

const createMessage = async (req, res) => {

    const { chatId, senderId, text, status } = req.body

    try {
        const encryptedText = encryptText(text, key);
        console.log('key', key)
        const message = await messageModel.create({
            chatId,
            senderId,
            text: encryptedText,
            status,
        });

        const messageData = {
            id: message.id,
            chatId: message.chatId,
            senderId: message.senderId,
            text: encryptedText,
            status: message.status,
            createdAt: message.createdAt,
            updatedAt: message.updatedAt,
        }
        res.status(200).json(messageData);
    } catch (error) {
        res.status(500).json('error' + error)
    }
}

const getMessages = async (req, res) => {

    const { chatId } = req.params
    try {

        const messages = await messageModel.findAll({
            where: {
                chatId,
            }
        });

        // Decrypt each message before sending it in the response
        const decryptedMessages = messages.map(message => {
            return {
                id: message.id,
                chatId: message.chatId,
                senderId: message.senderId,
                text: message.text, // Decrypt the message before sending it
                createdAt: message.createdAt,
                updatedAt: message.updatedAt,
                status: message.status,
            };
        });

        res.status(200).json(decryptedMessages);

    } catch (error) {
        res.status(500).json(error);
    }
}

const updateMessageStatus = async (req, res) => {
    console.log('body', req.body)
    const { messageId } = req.params;
    const { status } = req.body;

    try {
        // Update the status of the message directly using an update query
        console.log('messageId', messageId);
        console.log('status', status)
        const updatedRows = await messageModel.update(
            { status },
            { where: { id: messageId } }
        );

        console.log('updatedRows', updatedRows)

        // Check if any rows were affected by the update operation
        if (updatedRows[0] === 0) {
            // If no rows were affected, the message with the given ID was not found
            return res.status(404).json({ error: "Message not found" });
        }

        // Return success response
        res.status(200).json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const updateStatusAllMessages = async (req, res) => {
    const { chatId, senderId } = req.body;

    try {
        // Update status of all messages where chatId and senderId match
        const updatedMessages = await messageModel.update(
            { status: "read" }, // Update status to "read"
            { where: { chatId, senderId } } // Filter by chatId and senderId
        );

        res.status(200).json({ message: "Status updated for all matching messages" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const deleteMessage = async (req, res) => {

    try {

        const messageId = req.params.messageId;

        const deletedMessage = await messageModel.destroy({ where: { id: messageId } });

        if (deletedMessage === 0) {
            return res.status(400).json({ error: 'message not found' });
        }

        return res.status(200).json({ message: 'Message deleted successfully...' });

    } catch (error) {
        return res.status(500).json({error: 'Internal server error', error})
    }
}
 
const deleteMessageByChatId = async (req, res) => {

    try{

        const chatId = req.params.chatId;

        const deletedMessageByChatId = await messageModel.destroy({where : {chatId : chatId}});

        if(deletedMessageByChatId === 0){
            return res.status(400).json({error: 'message not found'});
        }

        return res.status(200).json({ message : 'Message deleted successfully...'})

    }catch(error){
        return res.status(500).json({error: 'Internal server error', error})
    }
}

const deleteMessagesByChatIds = async (req, res) => {
    try {
        const { chatIds } = req.body;

        // Delete chats with the specified chatIds
        const deletedMessagesCount = await messageModel.destroy({ where: { chatId: chatIds } });

        // Check if any chats were deleted
        if (deletedMessagesCount === 0) {
            return res.status(404).json({ error: 'No chats found with the provided chatIds' });
        }

        return res.status(200).json({ message: 'messages deleted successfully' });
    } catch (error) {
        console.error('Error deleting messages:', error);
        return res.status(500).json({ error: 'Internal server error', error });
    }
};

module.exports = {
    createMessage,
    getMessages,
    updateMessageStatus,
    updateStatusAllMessages,
    deleteMessage,
    deleteMessageByChatId,
    deleteMessagesByChatIds,
}