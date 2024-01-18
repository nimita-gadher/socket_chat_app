const Sequelize = require('sequelize')
const db = require('../connection.js')

const User = db.sequelize.define(
  'users',
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    firstName: {
      type: Sequelize.STRING
    },
    lastName: {
      type: Sequelize.STRING
    },
    userName: {
      type: Sequelize.STRING
    },
    email: {
      type: Sequelize.STRING
    },
    mobileNumber:{
      type: Sequelize.INTEGER
    },
    password: {
      type: Sequelize.STRING
    },
    image:{
      type: Sequelize.STRING
    }
  },
  {
    timestamps: false
  }
)

module.exports = User;