const userModel = require('../models/userModel');
const OrderModel = require('../models/orderModel');
const OrderItemModel = require('../models/orderItemModel');
const { or } = require('sequelize');

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
}

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
}

module.exports = {
    getAllUsers,
    getUserById,
    getMyOrderHistory,
    getUserOrderHistory,
    getUserOrderByOrderId
};
