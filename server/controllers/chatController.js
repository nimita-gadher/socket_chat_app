const chatModel = require("../models/Chat");
const { Op } = require('sequelize');
const { sequelize, Sequelize } = require('../connection'); // assuming you have a connection file
const { QueryTypes } = require('sequelize');


const createChat = async (req, res) => {
    const { members } = req.body;
    try {

        // Check if members is undefined or not an array
        if (!members || !Array.isArray(members)) {
            return res.status(400).json({ error: 'Invalid or missing members property in the request body' });
        }

        const membersArray = members.map(Number);

        const existingChat = await sequelize.query(
            'SELECT `id`, `members` FROM `chats` WHERE JSON_CONTAINS(`members`, :membersArray)',
            {
                replacements: { membersArray: JSON.stringify(members) },
                type: Sequelize.QueryTypes.SELECT,
                model: chatModel,
            }
        );
        console.log('existingChat', existingChat)
        if (existingChat.length > 0) {
            // If it exists, return the existing chat
            return res.status(200).json(existingChat[0]);
        }

        const newChat = await chatModel.create({
            members,
        });
        console.log('newChat', newChat)
        res.status(200).json(newChat);
    } catch (error) {
        res.status(500).json('error' + error);
    }
};

const getAllChats = async (req,res) => {
    console.log('1')
    try {
        console.log('call');
        const chats = await chatModel.findAll();
        console.log('chats', chats);

        return res.status(200).json(chats);
    } catch (error) {
        console.error('Error fetching chats:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}

// createChat
// const createChat = async (req, res) => {
//     const { firstId, secondId } = req.body;

//     try {
//         // Check if the chat already exists
//         const chat = await chatModel.findOne({
//             where: {
//                 members: {
//                     [Op.contains]: [firstId, secondId]
//                 }
//             }
//         });

//         if (chat) {
//             // If the chat exists, send it to the client
//             return res.status(200).json(chat);
//         }

//         // If the chat doesn't exist, create a new chat
//         const newChat = await chatModel.create({
//             members: [firstId, secondId]
//         });

//         res.status(200).json(newChat);
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// };

const findUserChat = async (req, res) => {
    const userId = req.params.userId;

    try {
        const allChats = await sequelize.query('SELECT `id`, `members` FROM `chats`', {
            type: QueryTypes.SELECT,
        });

        const filteredChats = allChats.filter(chat =>
            JSON.stringify(chat.members).includes(userId)
        );
        console.log('filteredChats', filteredChats)
        res.status(200).json(filteredChats);

    } catch (error) {
        res.status(500).json('error' + error);
    }
}

const findChat = async (req, res) => {

    const { firstId, secondId } = req.params;
    try {
        const query = `
            SELECT id, members
            FROM chats
            WHERE JSON_CONTAINS(members, '[${firstId}]') AND JSON_CONTAINS(members, '[${secondId}]')
            LIMIT 1;
        `;

        const [chat, metadata] = await sequelize.query(query);
        res.status(200).json(chat);

    } catch (error) {
        res.status(500).json('error' + error);
    }
}

const deleteChat = async (req,res) => {
    try{
        const chatId = req.params.chatId;

        const deletedChat = await chatModel.destroy({where: {id: chatId}});

        if(deletedChat === 0){
            return res.status(404).json({error: 'chat not found'});
        }

        return res.status(200).json({message : 'Chat deleted successfully'});

    }catch(error){
        return res.status(500).json({error : 'Internal server error', error})
    }
}

const deleteChats = async (req, res) => {
    try {
        const { chatIds } = req.body;

        // Delete chats with the specified chatIds
        const deletedChatsCount = await chatModel.destroy({ where: { id: chatIds } });

        // Check if any chats were deleted
        if (deletedChatsCount === 0) {
            return res.status(404).json({ error: 'No chats found with the provided chatIds' });
        }

        return res.status(200).json({ message: 'Chats deleted successfully' });
    } catch (error) {
        console.error('Error deleting chats:', error);
        return res.status(500).json({ error: 'Internal server error', error });
    }
};

const getChatIdsByMemberId = async (req, res) => {
    try {
      const { memberId } = req.params;
  
      // Use Sequelize query instead of findAll to execute custom SQL query
      const existingChat = await sequelize.query(
        'SELECT `id`, `members` FROM `chats` WHERE JSON_CONTAINS(`members`, :memberId)',
        {
          replacements: { memberId: memberId },
          type: Sequelize.QueryTypes.SELECT,
          model: chatModel,
        }
      );
  
      console.log('existingChat', existingChat)
      // Extract chat IDs from the retrieved chats
      const chatIds = existingChat.map(chat => chat.id);
  
      res.json({ success: true, chatIds });
    } catch (error) {
      console.error('Error fetching chat IDs:', error);
      res.status(500).json({ success: false, error: 'Internal server error', error });
    }
  };
  
  
  


module.exports = {
    createChat,
    findUserChat,
    findChat,
    getAllChats,
    deleteChat,
    deleteChats,
    getChatIdsByMemberId,
}
