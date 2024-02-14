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
        createdAt: {
            type: Sequelize.DATE,
            defaultValue: () => new Date(),
            allowNull: false,
        },
        updatedAt:{
            type: Sequelize.DATE,
        },
        status: {
            type: Sequelize.STRING
        },
    },
    {
        timestamps: true
    }
)

module.exports = Message;