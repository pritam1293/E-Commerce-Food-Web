const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const OrderItemModel = sequelize.define('OrderItem', {
    item_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    order_id: {
        type: DataTypes.STRING(50),
        allowNull: false,
        references: {
            model: 'orders',
            key: 'order_id'
        },
        onDelete: 'CASCADE'
    },
    product_id: {
        type: DataTypes.STRING(20),
        allowNull: false,
    },
    product_name: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    product_size: {
        type: DataTypes.ENUM('small', 'medium', 'large'),
        allowNull: false,
        validate: {
            isIn: [['small', 'medium', 'large']]
        }
    },
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            min: 1,
        }
    },
    price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
    total_amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
        // This is a GENERATED column in the database (quantity * price STORED)
        // Do NOT set this value manually - MySQL calculates it automatically
    }
}, {
    tableName: 'order_items',
    timestamps: false,
});

module.exports = OrderItemModel;
