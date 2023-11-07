const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Instructor = sequelize.define('Instructor', {
    fname: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            len: {
                args: [4],
                msg: 'Name should be at least 4 characters long'
            }
        }
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          isEmail: {
            msg: 'Invalid email format',
          },
        },
    },      
    countryCode: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
            is: /^\+\d{1,3}$/ 
        }
    },
    phoneNumber: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true,
        validate: {
            is: /^\d{8,10}$/  
        }
    },
    language: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    section: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    picture: {
        type: DataTypes.STRING,
        defaultValue: 'https://static.independent.co.uk/s3fs-public/thumbnails/image/2015/02/02/20/22-Black-Teacher-Corbis.jpg'
    },
    status: {
        type: DataTypes.ENUM('Active', 'Banned', 'Pending'),
        defaultValue: 'Active'
    },
});

module.exports = Instructor;