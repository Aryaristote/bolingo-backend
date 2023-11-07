const { DataTypes } = require('sequelize');
const bcrypt = require('bcrypt');
const sequelize = require('../config/database');

const User = sequelize.define('User', {
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
    picture: {
        type: DataTypes.STRING,
        defaultValue: 'https://firefoxusercontent.com/00000000000000000000000000000000'
    },
    provider: {
        type: DataTypes.STRING,
        defaultValue: 'local'
    },
    password: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
            len: {
                args: [8],
                msg: 'Password should be at least 8 characters long'
            }
        }
    },
    resetToken: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    verified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
});

User.beforeSave(async (user, options) => {
    if (user.changed('password')) {
        const salt = await bcrypt.genSalt();
        user.password = await bcrypt.hash(user.password, salt);
    }
});

// Static method to login user
User.login = async function(email, password) {
    const user = await this.findOne({ where: { email } });
    if (user) {
        const auth = await bcrypt.compare(password, user.password);
        if (auth) {
            return user;
        }
        throw new Error('Incorrect password');
    }
    throw new Error('Incorrect email');
};

module.exports = User;