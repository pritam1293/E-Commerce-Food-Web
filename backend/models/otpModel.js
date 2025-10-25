const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const OTPModel = sequelize.define('OTP', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    email: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true,
        }
    },
    action: {
        type: DataTypes.STRING(100),
        allowNull: true,
    },
    otp: {
        type: DataTypes.STRING(10),
        allowNull: false,
    },
    expiry_time: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    verified: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    },
    created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
    },
    updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
    }
}, {
    tableName: 'otp',
    timestamps: false,
    indexes: [{
        unique: true,
        fields: ['email']
    }]
})

module.exports = OTPModel;