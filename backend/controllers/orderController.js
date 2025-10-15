const UserModel = require('../models/userModel');
const ProductModel = require('../models/productModel');
const ProductSizeModel = require('../models/productSizeModel');
const OrderModel = require('../models/orderModel');
const OrderItemModel = require('../models/orderItemModel');
const sequelize = require('../config/database');
const { stack } = require('sequelize/lib/utils');
const { or } = require('sequelize');

const { clearUserOrdersCache, clearUserCartCache } = require('../utils/cache');

const placeOrder = async (req, res) => {
    const transaction = await sequelize.transaction();

    try {
        // Extract user ID from the authenticated request
        const userId = req.user.id;
        let { items } = req.body;
        if (!Array.isArray(items) || items.length === 0) {
            return res.status(400).json({ error: 'Order items must be a non-empty array' });
        }
        /*
        each item in the items array should be an object with:
        {
            productId: string,
            productDetails: an array of objects with size and quantity
            [
                {
                    size: 'small' | 'medium' | 'large',
                    quantity: number (>=1)
                },
                ...
            ]
        }
        */
        // Validate each item
        for (const item of items) {
            if (typeof item.productId !== 'string' || !Array.isArray(item.productDetails) || item.productDetails.length === 0) {
                return res.status(400).json({ error: 'Each item must have a valid productId and a non-empty productDetails array' });
            }
            const productId = item.productId;
            // Validate productId exists in the database
            const product = await ProductModel.findOne({ where: { product_id: productId } });
            if (!product) {
                return res.status(404).json({ error: `Product with ID ${productId} not found` });
            }
            for (const detail of item.productDetails) {
                if (typeof detail.size !== 'string' || !['small', 'medium', 'large'].includes(detail.size)) {
                    return res.status(400).json({ error: 'Each productDetail must have a valid size (small, medium, large)' });
                }
                if (typeof detail.quantity !== 'number' || detail.quantity < 1) {
                    return res.status(400).json({ error: 'Each productDetail must have a valid quantity (>= 1)' });
                }
                // Validate that the size exists for the given product and if exists and then it should be available
                const productSize = await ProductSizeModel.findOne({ where: { product_id: productId, size: detail.size } });
                if (!productSize) {
                    return res.status(400).json({ error: `Size ${detail.size} not found for product ID ${productId}` });
                }
                else if (!productSize.is_available) {
                    return res.status(400).json({ error: `Size ${detail.size} for product ID ${productId} is currently unavailable` });
                }
            }
        }
        // Create a new order
        const user = await UserModel.findByPk(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found, Please login again and place your order' });
        }
        let orderId = generateOrderId();
        // Ensure orderId is unique
        let existingOrder = await OrderModel.findOne({ where: { order_id: orderId } });
        let orderIdGeneratedCount = 0;
        while (existingOrder && orderIdGeneratedCount < 10) { // Limit to 10 attempts
            orderIdGeneratedCount++;
            orderId = generateOrderId();
            existingOrder = await OrderModel.findOne({ where: { order_id: orderId } });
        }
        if (existingOrder) {
            return res.status(500).json({ error: 'exist Could not place the order, please try again' });
        }

        let totalOrderAmount = 0.00;
        let validatedItems = [];

        for (const item of items) {
            const productId = item.productId;
            const product = await ProductModel.findOne({ where: { product_id: productId } });

            for (const detail of item.productDetails) {
                const size = detail.size;
                const quantity = detail.quantity;

                // Fetch price from ProductSizeModel
                const productSize = await ProductSizeModel.findOne({ where: { product_id: productId, size: size } });

                // This should not happen due to prior validation, but just in case
                if (!productSize) {
                    await transaction.rollback();
                    return res.status(400).json({ error: `Size ${size} not found for product ID ${productId}` });
                }

                const price = parseFloat(productSize.price);
                const itemTotal = price * quantity;
                totalOrderAmount += itemTotal;

                validatedItems.push({
                    productId,
                    productName: product.title,
                    size,
                    quantity,
                    price
                });
            }
        }

        // Create a new order
        const newOrder = await OrderModel.create({
            order_id: orderId,
            email: user.email,
            total_amount: totalOrderAmount,
            status: 'Pending'
        }, { transaction });

        // Create order items using stored validated data
        let orderItems = [];
        for (const validatedItem of validatedItems) {
            await OrderItemModel.create({
                order_id: orderId,
                product_id: validatedItem.productId,
                product_name: validatedItem.productName,
                product_size: validatedItem.size,
                quantity: validatedItem.quantity,
                price: validatedItem.price
                // total_amount is auto-calculated by MySQL
            }, { transaction });

            orderItems.push({
                productId: validatedItem.productId,
                productName: validatedItem.productName,
                size: validatedItem.size,
                quantity: validatedItem.quantity,
                price: validatedItem.price,
                totalAmount: validatedItem.price * validatedItem.quantity
            });
        }

        await transaction.commit();
        // Clear user's orders and cart cache
        clearUserOrdersCache(user.email);
        clearUserCartCache(user.email);
        return res.status(201).json({
            message: 'Order placed successfully',
            orderId: orderId,
            totalAmount: totalOrderAmount,
            orderItems
        });
    } catch (error) {
        console.error('Order placement error:', {
            message: error.message,
            stack: error.stack,
            userId: req.user?.id,
            timestamp: new Date().toISOString()
        });
        await transaction.rollback();
        return res.status(500).json({
            error: 'Could not place the order, please try again'
        });
    }
};

const updateOrderStatus = async (req, res) => {
    const transaction = await sequelize.transaction();

    try {
        let { orderId = null, status = null } = req.body;
        if (typeof orderId !== 'string' || !orderId.trim()) {
            await transaction.rollback();
            return res.status(400).json({ error: 'A valid orderId is required' });
        }
        if (typeof status !== 'string' || !['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'].includes(status)) {
            await transaction.rollback();
            return res.status(400).json({ error: 'A valid status is required (Pending, Processing, Shipped, Delivered, Cancelled)' });
        }
        const order = await OrderModel.findOne({
            where: { order_id: orderId },
            lock: transaction.LOCK.UPDATE,
            transaction
        });
        if (!order) {
            await transaction.rollback();
            return res.status(404).json({ error: `Order with ID ${orderId} not found` });
        }
        if (order.status === status) {
            await transaction.rollback();
            return res.status(400).json({ error: `Order is already in status ${status}` });
        }
        const PreviousStatus = order.status;
        order.status = status;
        await order.save({ transaction });
        await transaction.commit();
        return res.status(200).json({
            message: 'Order status updated successfully',
            orderId: orderId,
            previousStatus: PreviousStatus,
            newStatus: status
        });
    } catch (error) {
        await transaction.rollback();
        console.error('Update order status error:', {
            message: error.message,
            stack: error.stack,
            userId: req.user?.id,
            timestamp: new Date().toISOString()
        });
        return res.status(500).json({ error: 'Could not update order status, please try again' });
    }
};

const generateOrderId = () => {
    const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let orderId = 'ORD-';
    for (let i = 0; i < 10; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        orderId += characters[randomIndex];
    }
    return orderId;
}

module.exports = {
    placeOrder,
    updateOrderStatus
};