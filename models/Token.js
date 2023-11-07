const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Token = sequelize.define('Token', {
  userId: {
    type: DataTypes.STRING,
    allowNull: false,
    references: {
      model: 'User', 
      key: 'id',  
    },
  },
  token: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  timestamps: false, 
  tableName: 'tokens',
});

module.exports = Token;