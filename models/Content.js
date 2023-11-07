const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Instructor = require('./Instructor');

const Content = sequelize.define('Content', {
    title: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            len: {
                args: [5],
                msg: 'Title should be at least 5 characters long'
            }
        }
    },
    instructorId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Instructor',
            key: 'id',
        },
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            len: {
                args: [10],
                msg: 'Title should be at least 5 characters long'
            }
        }
    }, 
    contentType: {
        type: DataTypes.ENUM('Book', 'Audio Book', 'Video', 'Podcast', 'Article'),
        defaultValue: 'Active'
    },
    price: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true,
        validate: {
            is: /^\d{1,10}$/
        }
    },
    content: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    status: {
        type: DataTypes.ENUM('Pending', 'Approved', 'Disapproved', 'Removed'),
        defaultValue: 'Pending'
    },
});

Instructor.hasMany(Content, { foreignKey: 'instructorId' });
Content.belongsTo(Instructor, { foreignKey: 'instructorId' });

module.exports = Content;