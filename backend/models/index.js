const sequelize = require('../config/database');
const Product = require('./productModel');
const ProductSize = require('./productSizeModel');
const Order = require('./orderModel');
const OrderItem = require('./orderItemModel');

// Product and ProductSize relationship
Product.hasMany(ProductSize, {
    foreignKey: 'product_id',
    sourceKey: 'product_id',
    as: 'sizes',  // Alias for easier access
    onDelete: 'CASCADE',
});

ProductSize.belongsTo(Product, {
    foreignKey: 'product_id',
    targetKey: 'product_id',
    as: 'product',
});

// Order and OrderItem relationship
Order.hasMany(OrderItem, {
    foreignKey: 'order_id',
    sourceKey: 'order_id',
    as: 'items',  // Alias for easier access
    onDelete: 'CASCADE',
});

OrderItem.belongsTo(Order, {
    foreignKey: 'order_id',
    targetKey: 'order_id',
    as: 'order',
});

module.exports = {
    Product,
    ProductSize,
    Order,
    OrderItem
};