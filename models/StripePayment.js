const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Instructor = require('./Instructor');

const StripePayment = sequelize.define('StripePayment', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    instructorId: { 
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    amount: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    currency: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    type: {
      type: DataTypes.ENUM('momo', 'bank', 'cash'),
      defaultValue: 'momo'
    },
    number: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
          len: {
              args: [10],
              msg: 'Title should be at least 10 characters long'
          }
      }
    }
});

Instructor.hasMany(StripePayment, { foreignKey: 'instructorId' });
StripePayment.belongsTo(Instructor, { foreignKey: 'instructorId' });
  
module.exports = StripePayment;