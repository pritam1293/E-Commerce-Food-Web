const {DataTypes} = require('sequelize');
const sequelize = require('../config/database');
const bcrypt = require('bcrypt');

const UserModel = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    first_name: {
        type: DataTypes.STRING(50),
        allowNull: true,
    },
    middle_name: {
        type: DataTypes.STRING(50),
        allowNull: true,
    },
    last_name: {
        type: DataTypes.STRING(50),
        allowNull: true,
    },
    email: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true,
        }
    },
    contact_no: {
        type: DataTypes.STRING(20),
        allowNull: false,
        unique: true,
    },
    address: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    password: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    role: {
        type: DataTypes.ENUM('admin', 'user'),
        allowNull: false,
        defaultValue: 'user'
    }
}, {
    tableName: 'users',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false,

    hooks: {
        beforeCreate: async (user) => {
            if(user.password) {
                const salt = await bcrypt.genSalt(10);
                user.password = await bcrypt.hash(user.password, salt);
            }
        },
        beforeUpdate: async (user) => {
            if(user.changed('password')) {
                const salt = await bcrypt.genSalt(10);
                user.password = await bcrypt.hash(user.password, salt);
            }
        }
    }
});

UserModel.prototype.validatePassword = async function(password) {
    return await bcrypt.compare(password, this.password);
};

module.exports = UserModel;