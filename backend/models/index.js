const sequelize = require('../config/database');
const Product = require('./productModel');
const ProductSize = require('./productSizeModel');

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

module.exports = {
    Product,
    ProductSize
};