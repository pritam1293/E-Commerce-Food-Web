const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const OrderModel = sequelize.define('Order', {
    order_no: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    order_id: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
    },
    email: {
        type: DataTypes.STRING(100),
        allowNull: false,
        validate: {
            isEmail: true,
        }
    },
    total_amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
        defaultValue: 0.00,
    },
    status: {
        type: DataTypes.STRING(50),
        allowNull: true,
        defaultValue: 'Pending',
    },
    created_at: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: DataTypes.NOW,
    },
    updated_at: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: DataTypes.NOW,
    }
}, {
    tableName: 'orders',
    timestamps: false, // We're managing timestamps manually with created_at and updated_at
    indexes: [
        {
            name: 'idx_email',
            fields: ['email']
        }
    ]
});

module.exports = OrderModel;