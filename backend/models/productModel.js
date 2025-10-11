const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Product = sequelize.define('Product', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    product_id: {
        type: DataTypes.STRING(20),
        allowNull: false,
        unique: true,
        validate: {
            notEmpty: true
        }
    },
    product_type: {
        type: DataTypes.ENUM('burger', 'pizza', 'cake'),
        allowNull: false,
        validate: {
            isIn: [['burger', 'pizza', 'cake']]
        }
    },
    title: {
        type: DataTypes.STRING(100),
        allowNull: false,
        validate: {
            notEmpty: true,
            len: [1, 100]
        }
    },
    image_url: {
        type: DataTypes.STRING(255),
        allowNull: true
    }
}, {
    tableName: 'products',
    timestamps: false
});

module.exports = Product;

