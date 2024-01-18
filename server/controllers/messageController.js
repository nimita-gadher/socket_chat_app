const messageModel = require("../models/Message");

const createMessage = async (req, res) => {

    const { chatId, senderId, text} = req.body 
  
    try{

        const message = await messageModel.create({
            chatId,
            senderId,
            text,
        });
        res.status(200).json(message);

    }catch(error){
        res.status(500).json('error'+error)
    }
}

const getMessages = async (req, res) => {
    
    const {chatId} = req.params
    try{

        const message  = await messageModel.findAll({
            where:{
                chatId,
            }
        });

        res.status(200).json(message);

    }catch(error){
        res.status(500).json(error);
    }
}

module.exports = {
    createMessage,
    getMessages,
}