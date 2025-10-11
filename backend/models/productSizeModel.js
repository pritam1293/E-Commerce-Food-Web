const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Product = require('./productModel');

const ProductSize = sequelize.define('ProductSize', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    product_id: {
        type: DataTypes.STRING(20),
        allowNull: false,
        references: {
            model: 'products',
            key: 'product_id'
        }
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
            min: 0,
            isDecimal: true
        }
    },
    is_available: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
    }
}, {
    tableName: 'product_sizes',
    timestamps: false
});

module.exports = ProductSize;