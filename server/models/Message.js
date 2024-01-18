const Sequelize = require('sequelize')
const db = require('../connection.js')

const Message = db.sequelize.define(
    'messages',
    {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        chatId: {
            type: Sequelize.INTEGER
        },
        senderId: {
            type: Sequelize.INTEGER
        },
        text: {
            type: Sequelize.STRING
        },
    },
    {
        timestamps: false
    }
)

module.exports = Message;