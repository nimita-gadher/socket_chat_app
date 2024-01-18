const { DataTypes } = require('sequelize');
const Sequelize = require('sequelize');
const db = require('../connection.js');

const Chat = db.sequelize.define(
  'chats',
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    members: {
      type: Sequelize.JSON, // Assuming MySQL version 5.7 or higher
      allowNull: false,
    },
  },
  {
    timestamps: false,
  }
);

module.exports = Chat;

