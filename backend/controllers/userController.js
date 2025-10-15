const userModel = require('../models/userModel');
const OrderModel = require('../models/orderModel');
const OrderItemModel = require('../models/orderItemModel');
const CartModel = require('../models/cartModel');
const ProductModel = require('../models/productModel');
const ProductSizeModel = require('../models/productSizeModel');
const sequelize = require('../config/database');

const getAllUsers = async (req, res) => {
    try {
        // Fetch all users from the database
        const users = await userModel.findAll({
            attributes: { exclude: ['password'] } // Exclude password field
        });
        // Return the list of users in the form of JSON
        res.json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};


const getUserById = async (req, res) => {
    try {
        const { id } = req.params;
        // Fetch user by ID from the database
        const user = await userModel.findByPk(id, {
            attributes: { exclude: ['password'] } // Exclude password field
        });
        if (user) {
            res.json(user);
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const getMyOrderHistory = async (req, res) => {
    try {
        const userId = req.user.id;
        await orderHistory(userId, res);
    } catch (error) {
        console.error('Error fetching order history:', {
            message: error.message,
            stack: error.stack,
            userId: req.user?.id,
            timestamp: new Date().toISOString()
        });
        res.status(500).json({ error: 'Could not fetch order history' });
    }
};

const getUserOrderHistory = async (req, res) => {
    try {
        const { id: userId } = req.params;

        if (!userId) {
            return res.status(400).json({ error: 'User ID is required' });
        }

        await orderHistory(userId, res);
    } catch (error) {
        console.error('Error fetching user order history:', {
            message: error.message,
            stack: error.stack,
            adminId: req.user?.id,
            requestedUserId: req.params?.id,
            timestamp: new Date().toISOString()
        });
        res.status(500).json({ error: 'Could not fetch order history' });
    }
};

const getUserOrderHistoryByOrderId = async (req, res) => {
    try {
        const { orderId } = req.query;
        return res.status(200).json({ message: `Order history for order ID: ${orderId}` });
    } catch (error) {
        console.error('Error fetching user order history by order ID:', {
            message: error.message,
            stack: error.stack,
            userId: req.user?.id,
            requestedOrderId: req.params?.orderId,
            timestamp: new Date().toISOString()
        });
        res.status(500).json({ error: 'Could not fetch order history' });
    }
};

const getUserOrderByOrderId = async (req, res) => {
    const { orderId = null } = req.query;
    try {
        if (!orderId || typeof orderId !== 'string' || !orderId.trim()) {
            return res.status(400).json({
                error: 'orderId query parameter is required'
            });
        }
        const order = await OrderModel.findOne({
            where: { order_id: orderId },
            include: [
                {
                    model: OrderItemModel,
                    as: 'items'
                }
            ]
        });
        if (!order) {
            return res.status(404).json({ error: `Order with ID ${orderId} not found` });
        }
        return res.status(200).json({
            message: 'Order details fetched successfully',
            order: order
        });
    } catch (error) {
        console.error('Error fetching user order history by order ID:', {
            message: error.message,
            stack: error.stack,
            adminId: req.user?.id,
            requestedOrderId: orderId,
            timestamp: new Date().toISOString()
        });
        return res.status(500).json({ error: `Could not fetch order details for order ID: ${orderId}` });
    }
};

const addToCart = async (req, res) => {
    const transaction = await sequelize.transaction();

    try {
        const userId = req.user.id;
        if (!userId) {
            await transaction.rollback();
            return res.status(401).json({ error: 'Unauthorized' });
        }
        let { items = null } = req.body;
        if (!Array.isArray(items) || items.length === 0) {
            await transaction.rollback();
            return res.status(400).json({ error: 'Items array is required' });
        }
        let cartItemSet = new Set();
        for (const item of items) {
            // Validate data types
            if (!item || typeof item !== 'object') {
                await transaction.rollback();
                return res.status(400).json({ error: 'Each item must be a valid object' });
            }
            if (!item.productId || typeof item.productId !== 'string') {
                await transaction.rollback();
                return res.status(400).json({ error: 'The productId data type is String' });
            }
            if (!item.productSize || typeof item.productSize !== 'string') {
                await transaction.rollback();
                return res.status(400).json({ error: 'The productSize data type is String' });
            }
            if (typeof item.quantity !== 'number' || !Number.isInteger(item.quantity) || item.quantity === 0) {
                await transaction.rollback();
                return res.status(400).json({ error: 'The quantity data type is Integer and must be non-zero' });
            }
            item.productId = item.productId.trim().toLowerCase();
            item.productSize = item.productSize.trim().toLowerCase();
            if (item.productId.length === 0) {
                await transaction.rollback();
                return res.status(400).json({ error: 'A valid productId is required' });
            }
            if (!['small', 'medium', 'large'].includes(item.productSize)) {
                await transaction.rollback();
                return res.status(400).json({ error: 'A valid productSize is required (small, medium, large)' });
            }
            // Check if product and size exist and are available
            const product = await ProductModel.findOne({ where: { product_id: item.productId } });
            if (!product) {
                await transaction.rollback();
                return res.status(404).json({ error: `Product with ID ${item.productId} not found` });
            }
            const productSize = await ProductSizeModel.findOne({
                where: {
                    product_id: item.productId,
                    size: item.productSize
                }
            });
            if (!productSize) {
                await transaction.rollback();
                return res.status(404).json({ error: `Product size ${item.productSize} for product ID ${item.productId} not found` });
            }
            if (!productSize.is_available) {
                await transaction.rollback();
                return res.status(400).json({ error: `Product size ${item.productSize} for product ID ${item.productId} is not available` });
            }
            item.productData = {product: product, productSize: productSize};
            // Check for duplicate items in the request
            const key = `${item.productId}-${item.productSize}`;
            if (cartItemSet.has(key)) {
                await transaction.rollback();
                return res.status(400).json({
                    error: 'Duplicate items with same productId and productSize are not allowed',
                    productId: item.productId,
                    productSize: item.productSize
                });
            }
            cartItemSet.add(key);
        }
        const user = await userModel.findByPk(userId);
        if (!user) {
            await transaction.rollback();
            return res.status(404).json({ error: 'User not found' });
        }
        // Add or update items in cart
        let skippedItems = [];
        let processedItems = [];
        for (const item of items) {
             /*
            If the item already exists in the cart (Product ID + Size), 
            update the quantity instead of adding a new entry.
            If after updating, the quantity is zero or less, remove the item from the cart.
            */
            const existingCartItem = await CartModel.findOne({
                where: {
                    email: user.email,
                    product_id: item.productId,
                    size: item.productSize
                }
            });
            if (existingCartItem) {
                const oldQuantity = existingCartItem.quantity;
                existingCartItem.quantity = Math.max(0, existingCartItem.quantity + item.quantity);
                if (existingCartItem.quantity === 0) {
                    await existingCartItem.destroy({ transaction });
                    processedItems.push({
                        productId: item.productId,
                        productSize: item.productSize,
                        action: 'removed',
                    });
                } else {
                    await existingCartItem.save({ transaction });
                    processedItems.push({
                        productId: item.productId,
                        productSize: item.productSize,
                        action: 'updated',
                        oldQuantity: oldQuantity,
                        newQuantity: existingCartItem.quantity,
                        totalPrice: (existingCartItem.quantity * parseFloat(existingCartItem.price)).toFixed(2)
                    });
                }
            } else {
                // Add new item to cart
                if (item.quantity < 1) {
                    skippedItems.push({
                        productId: item.productId,
                        productSize: item.productSize,
                        quantity: item.quantity,
                        reason: 'Quantity must be at least 1 for new cart items'
                    });
                    continue; // Skip this item and move to next
                }
                const newCartItem = await CartModel.create({
                    email: user.email,
                    product_id: item.productId,
                    product_image_url: item.productData.product.image_url,
                    product_title: item.productData.product.title,
                    size: item.productSize,
                    price: item.productData.productSize.price,
                    quantity: item.quantity
                }, { transaction });
                processedItems.push({
                    productId: item.productId,
                    productSize: item.productSize,
                    action: 'added',
                    quantity: newCartItem.quantity,
                    totalPrice: (newCartItem.quantity * parseFloat(newCartItem.price)).toFixed(2)
                });
            }
        }
        await transaction.commit();
        const responsePayload = {
            message: 'Cart updated successfully',
            itemsProcessed: processedItems.length,
            totalItems: items.length,
            processedItems: processedItems
        }
        if(skippedItems.length > 0) {
            responsePayload.skippedItems = skippedItems;
            responsePayload.skippedCount = skippedItems.length;
            responsePayload.warning = `${skippedItems.length} item(s) were not added due to invalid quantity`;
        }
        return res.status(200).json(responsePayload);
    } catch (error) {
        await transaction.rollback();
        console.error('Add to cart error:', {
            message: error.message,
            stack: error.stack,
            userId: req.user?.id,
            timestamp: new Date().toISOString()
        });
        return res.status(500).json({ error: 'Could not add item to cart' });
    }
};

const getMyCart = async (req, res) => {
    const transaction = await sequelize.transaction();
    const userId = req.user.id;
    try {
        if (!userId) {
            await transaction.rollback();
            return res.status(401).json({ error: 'Unauthorized' });
        }
        const user = await userModel.findByPk(userId);
        if (!user) {
            await transaction.rollback();
            return res.status(404).json({ error: 'User not found' });
        }
        const cartItems = await CartModel.findAll({
            where: { email: user.email },
            order: [['added_at', 'DESC']]
        });
        let cartTotal = 0.00;
        let validCartItems = [];
        for(const item of cartItems) {
            if(item.quantity < 1) {
                // This should not happen, but just in case, remove such items
                await item.destroy({ transaction });
                continue;
            }
            cartTotal += parseFloat(item.total_price);
            validCartItems.push(item);
        }
        await transaction.commit();
        return res.status(200).json({
            message: validCartItems.length === 0 ? 'Cart is empty' : 'User cart fetched successfully',
            cartItems: validCartItems,
            cartTotal: cartTotal.toFixed(2)
        });
    } catch (error) {
        await transaction.rollback();
        console.error('Error fetching user cart:', {
            message: error.message,
            stack: error.stack,
            userId: req.user?.id,
            timestamp: new Date().toISOString()
        });
        return res.status(500).json({ error: 'Could not fetch user cart' });
    }
};

const orderHistory = async (userId, res) => {
    try {
        const user = await userModel.findByPk(userId, {
            attributes: { exclude: ['password'] }
        });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const orders = await OrderModel.findAll({
            where: { email: user.email },
            include: [
                {
                    model: OrderItemModel,
                    as: 'items'
                }
            ],
            order: [['created_at', 'DESC']]
        });

        return res.status(200).json({
            message: 'Order history fetched successfully',
            user: {
                id: user.id,
                name: user.name,
                email: user.email
            },
            totalOrders: orders.length,
            orders: orders
        });
    } catch (error) {
        console.error('Error in orderHistory:', {
            message: error.message,
            stack: error.stack,
            userId: userId,
            timestamp: new Date().toISOString()
        });
        return res.status(500).json({ error: 'Could not fetch order history' });
    }
};

module.exports = {
    getAllUsers,
    getUserById,
    getMyOrderHistory,
    getUserOrderHistory,
    getUserOrderByOrderId,
    addToCart,
    getMyCart
};
