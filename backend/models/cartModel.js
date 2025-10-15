const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const CartModel = sequelize.define('Cart', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    email: {
        type: DataTypes.STRING(255),
        allowNull: false,
        validate: {
            isEmail: true
        }
    },
    product_id: {
        type: DataTypes.STRING(50),
        allowNull: false,
        references: {
            model: 'products',
            key: 'product_id'
        },
    },
    product_image_url: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    product_title: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    size: {
        type: DataTypes.ENUM('small', 'medium', 'large'),
        allowNull: false,
        validate: {
            isIn: [['small', 'medium', 'large']]
        }
    },
    price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        validate: {
            min: 0.01,
        }
    },
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            min: 1,
        }
    },
    total_price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
        // This is a GENERATED column in the database (price * quantity STORED)
    },
    added_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    }
}, {
    tableName: 'cart',
    timestamps: false,
    indexes: [
        {
            name: 'idx_cart_email',
            fields: ['email']
        },
        {
            unique: true,
            fields: ['email', 'product_id', 'size']
        }
    ]
});

module.exports = CartModel;