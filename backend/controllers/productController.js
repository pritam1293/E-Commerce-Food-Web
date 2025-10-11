const { Product, ProductSize } = require('../models');
const sequelize = require('../config/database');

const registerProduct = async (req, res) => {
    const transaction = await sequelize.transaction();

    try {
        let {
            productType = null,
            title = null,
            imageUrl = null,
            sizes = null
        } = req.body;
        // Validation of the request body
        productType = productType ? productType.trim().replace(/\s+/g, '').toLowerCase() : null;
        if (!productType || !['burger', 'pizza', 'cake'].includes(productType)) {
            await transaction.rollback();
            return res.status(400).json({ error: 'Invalid or missing productType' });
        }
        // Trim the title and imageUrl to remove leading/trailing spaces
        title = title ? title.trim() : null;
        imageUrl = imageUrl ? imageUrl.trim() : null;
        if (!title || title.length === 0 || title.length > 100) {
            await transaction.rollback();
            return res.status(400).json({ error: 'Invalid or missing title' });
        }
        if (!imageUrl || imageUrl.length > 255) {
            await transaction.rollback();
            return res.status(400).json({ error: 'Invalid or missing imageUrl' });
        }
        if (!sizes || !Array.isArray(sizes) || sizes.length === 0) {
            await transaction.rollback();
            return res.status(400).json({ error: 'Sizes must be a non-empty array' });
        }

        sizes = sizes.filter(sizeObj => {
            if (!sizeObj.size || !['small', 'medium', 'large'].includes(sizeObj.size)) {
                return false;
            }
            // is_available must be a boolean if provided
            if (sizeObj.is_available !== undefined && typeof sizeObj.is_available !== 'boolean') {
                return false;
            }
            if (!sizeObj.price || isNaN(sizeObj.price) || sizeObj.price <= 0) {
                return false;
            }
            return true;
        });

        // Check for duplicate sizes
        const sizeSet = new Set(sizes.map(s => s.size));
        if (sizeSet.size !== sizes.length) {
            await transaction.rollback();
            return res.status(400).json({ error: 'Duplicate sizes are not allowed' });
        }

        if(sizes.length === 0) {
            await transaction.rollback();
            return res.status(400).json({ error: 'Sizes array must contain valid size objects' });
        }

        // Generate a unique product_id
        let productId = generateProductId();
        let attemptToRegenerate = 0;
        // If the generated productId already exists, regenerate
        let existingProduct = await Product.findOne({
            where: { product_id: productId },
            transaction
        });
        while (existingProduct && attemptToRegenerate < 10) {
            productId = generateProductId();
            existingProduct = await Product.findOne({
                where: { product_id: productId },
                transaction
            });
            attemptToRegenerate++;
        }

        if(attemptToRegenerate === 10 && existingProduct) {
            await transaction.rollback();
            return res.status(500).json({ error: 'Failed to generate unique product ID. Please try again.' });
        }
        // Create the product
        const newProduct = await Product.create({
            product_id: productId,
            product_type: productType,
            title: title,
            image_url: imageUrl
        }, { transaction });

        // Prepare sizes data
        const sizesData = sizes.map(sizeObj => ({
            product_id: productId,
            size: sizeObj.size,
            price: parseFloat(parseFloat(sizeObj.price).toFixed(2)),
            is_available: sizeObj.is_available !== undefined ? sizeObj.is_available : true
        }));

        // Bulk create sizes
        await ProductSize.bulkCreate(sizesData, { transaction });
        await transaction.commit();

        await newProduct.reload({
            include: [{ model: ProductSize, as: 'sizes' }]
        });

        return res.status(201).json({
            message: 'Product created successfully',
            product: newProduct
        });
    } catch (error) {
        await transaction.rollback();
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(400).json({
                error: 'Product ID already exists. Please try again.'
            });
        }
        if (error.name === 'SequelizeValidationError') {
            return res.status(400).json({ error: 'Validation error', details: error.errors.map(e => e.message) });
        }
        console.error('Error creating product:', error);
        return res.status(500).json({ error: 'Failed to create product' });
    }
}

const getAllProducts = async (req, res) => {
    try {
        // Fetch all available products with their sizes
        const products = await Product.findAll({
            include: [{
                model: ProductSize,
                as: 'sizes',
                where: { is_available: true },
                required: false  // Include products even if they have no available sizes
            }]
        });
        return res.status(200).json({
            message: 'Products retrieved successfully',
            products
        });
    } catch (error) {
        console.error('Error fetching products:', error);
        return res.status(500).json({ error: 'Failed to retrieve products' });
    }
};

const getProductById = async (req, res) => {
    try {
        let { id = null } = req.params;
        // Trim, remove inbetween spaces and convert to lowercase
        id = id ? id.trim().replace(/\s+/g, '').toLowerCase() : null;
        if (!id || id.length === 0) {
            return res.status(400).json({ error: 'Invalid or missing product ID' });
        }
        const product = await Product.findOne({
            where: { product_id: id },
            include: [{ model: ProductSize, as: 'sizes' }]
        });
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }
        return res.status(200).json({
            message: 'Product retrieved successfully',
            product
        });
    } catch (error) {
        console.error('Error fetching product:', error);
        return res.status(500).json({ error: 'Failed to retrieve product' });
    }
};

const updateProductDetails = async (req, res) => {
    const transaction = await sequelize.transaction();

    try {
        let { id: productId = null } = req.params;
        let {
            productType = null,
            title = null,
            imageUrl = null,
            sizes = null
        } = req.body;

        // Validation of the request body
        productId = productId ? productId.trim().replace(/\s+/g, '').toLowerCase() : null;
        if (!productId || productId.length === 0) {
            await transaction.rollback();
            return res.status(400).json({ error: 'Invalid or missing productId' });
        }
        productType = productType ? productType.trim().replace(/\s+/g, '').toLowerCase() : null;
        if (!productType || !['burger', 'pizza', 'cake'].includes(productType)) {
            await transaction.rollback();
            return res.status(400).json({ error: 'Invalid productType' });
        }
        title = title ? title.trim() : null;
        if (!title || title.length === 0 || title.length > 100) {
            await transaction.rollback();
            return res.status(400).json({ error: 'Invalid or missing title' });
        }
        imageUrl = imageUrl ? imageUrl.trim() : null;
        if (!imageUrl || imageUrl.length === 0) {
            await transaction.rollback();
            return res.status(400).json({ error: 'Invalid or missing imageUrl' });
        }
        if (!Array.isArray(sizes) || sizes.length === 0) {
            await transaction.rollback();
            return res.status(400).json({ error: 'Invalid or missing sizes' });
        }
        sizes = sizes.filter(sizeObj => {
            if (!sizeObj.size || !['small', 'medium', 'large'].includes(sizeObj.size)) {
                return false;
            }
            // is_available is optional, but if provided must be boolean
            if (sizeObj.is_available !== undefined && typeof sizeObj.is_available !== 'boolean') {
                return false;
            }
            // price is optional, but if provided must be valid
            if (sizeObj.price !== undefined && (isNaN(sizeObj.price) || sizeObj.price <= 0)) {
                return false;
            }
            return true;
        });

        // Check for duplicate sizes
        const sizeSet = new Set(sizes.map(s => s.size));
        if (sizeSet.size !== sizes.length) {
            await transaction.rollback();
            return res.status(400).json({ error: 'Duplicate sizes are not allowed' });
        }

        if (sizes.length === 0) {
            await transaction.rollback();
            return res.status(400).json({ error: 'Sizes array must contain valid size objects' });
        }

        // Find the product
        const product = await Product.findOne({
            where: { product_id: productId },
            transaction
        });
        if (!product) {
            await transaction.rollback();
            return res.status(404).json({ error: `Product not found for ${productId}` });
        }

        // Update product details
        product.product_type = productType;
        product.title = title;
        product.image_url = imageUrl;
        await product.save({ transaction });

        // Get existing sizes for this product
        const existingSizes = await ProductSize.findAll({
            where: { product_id: productId },
            transaction
        });

        // Update or create sizes
        for (let sizeObj of sizes) {
            const existingSize = existingSizes.find(s => s.size === sizeObj.size);

            if (existingSize) {
                // Update existing size - only update fields that are provided
                if (sizeObj.price !== undefined) {
                    existingSize.price = parseFloat(parseFloat(sizeObj.price).toFixed(2));
                }
                if (sizeObj.is_available !== undefined) {
                    existingSize.is_available = sizeObj.is_available;
                }
                await existingSize.save({ transaction });
            } else {
                // Create new size - price is required for new sizes
                if (sizeObj.price === undefined) {
                    await transaction.rollback();
                    return res.status(400).json({
                        error: `Price is required when adding new size: ${sizeObj.size}`
                    });
                }
                await ProductSize.create({
                    product_id: productId,
                    size: sizeObj.size,
                    price: parseFloat(parseFloat(sizeObj.price).toFixed(2)),
                    is_available: sizeObj.is_available !== undefined ? sizeObj.is_available : true
                }, { transaction });
            }
        }

        // Delete sizes that weren't included in the update
        const updatedSizeNames = sizes.map(s => s.size);
        const sizesToDelete = existingSizes.filter(s => !updatedSizeNames.includes(s.size));

        for (let sizeToDelete of sizesToDelete) {
            await sizeToDelete.destroy({ transaction });
        }

        // Commit transaction
        await transaction.commit();

        // Reload product with sizes
        await product.reload({
            include: [{ model: ProductSize, as: 'sizes' }]
        });

        return res.status(200).json({ message: 'Product updated successfully', product });
    } catch (error) {
        await transaction.rollback();
        if (error.name === 'SequelizeValidationError') {
            return res.status(400).json({ error: 'Validation error' });
        }
        console.error('Error updating product:', error);
        return res.status(500).json({ error: 'Failed to update product' });
    }
}

const generateProductId = () => {
    const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let productId = '';
    for (let i = 0; i < 10; i++) {
        productId += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return productId;
}

module.exports = {
    registerProduct,
    getAllProducts,
    getProductById,
    updateProductDetails
};