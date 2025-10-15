const userModel = require('../models/userModel');
const OrderModel = require('../models/orderModel');
const OrderItemModel = require('../models/orderItemModel');
const CartModel = require('../models/cartModel');
const ProductModel = require('../models/productModel');
const ProductSizeModel = require('../models/productSizeModel');
const sequelize = require('../config/database');

const { cache, CACHE_KEYS, CACHE_TTL, clearUsersCache, clearUserCartCache, clearUserOrdersCache } = require('../utils/cache');

const getAllUsers = async (req, res) => {
    try {
        const cacheKey = CACHE_KEYS.ALL_USERS;
        const cachedUsers = cache.get(cacheKey);
        if (cachedUsers) {
            return res.json({
                message: 'Users fetched from successfully (cache)',
                users: cachedUsers,
                cached: true
            });
        }
        // Cache missing, fetch from database
        const users = await userModel.findAll({
            attributes: { exclude: ['password'] } // Exclude password field
        });
        // Store in cache for future requests
        cache.set(cacheKey, users, CACHE_TTL.USERS);
        // Return the list of users in the form of JSON
        return res.json({
            message: 'Users fetched successfully',
            users: users,
            cached: false
        });
    } catch (error) {
        console.error('Error fetching users:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
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
            item.productData = { product: product, productSize: productSize };
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
        // Clear relevant cache entries
        clearUserCartCache(user.email);
        // Return summary of operations
        const responsePayload = {
            message: 'Cart updated successfully',
            itemsProcessed: processedItems.length,
            totalItems: items.length,
            processedItems: processedItems
        }
        if (skippedItems.length > 0) {
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
    const userId = req.user.id;
    try {
        if (!userId) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        const user = await userModel.findByPk(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        const cacheKey = CACHE_KEYS.USER_CART(user.email);
        const cachedCart = cache.get(cacheKey);
        if (cachedCart) {
            return res.status(200).json({
                message: 'User cart fetched successfully (cache)',
                cartItems: cachedCart.cartItems,
                cartTotal: cachedCart.cartTotal,
                cached: true
            })
        }
        const cartItems = await CartModel.findAll({
            where: {
                email: user.email,
                quantity: { [sequelize.Op.gte]: 1 }
            },
            order: [['added_at', 'DESC']]
        });

        const cartTotal = cartItems.reduce((sum, item) =>
            sum + parseFloat(item.total_price), 0.00
        );

        const responseData = {
            cartItems: cartItems,
            cartTotal: cartTotal.toFixed(2)
        };

        // Cache the cart data for future requests
        cache.set(cacheKey, responseData, CACHE_TTL.CARTS);

        return res.status(200).json({
            message: cartItems.length === 0 ? 'Cart is empty' : 'User cart fetched successfully',
            cartItems: cartItems,
            cartTotal: cartTotal.toFixed(2),
            cached: false
        });
    } catch (error) {
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
        // Check the cache first
        const cacheKey = CACHE_KEYS.USER_ORDERS(user.email);
        const cachedOrders = cache.get(cacheKey);
        if (cachedOrders) {
            return res.status(200).json({
                message: 'Order history fetched successfully (cache)',
                user: {
                    id: user.id,
                    email: user.email
                },
                totalOrders: cachedOrders.length,
                orders: cachedOrders,
                cached: true
            });
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

        // Store in cache for future requests
        cache.set(cacheKey, orders, CACHE_TTL.ORDERS);

        return res.status(200).json({
            message: 'Order history fetched successfully',
            user: {
                id: user.id,
                email: user.email
            },
            totalOrders: orders.length,
            orders: orders,
            cached: false
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
