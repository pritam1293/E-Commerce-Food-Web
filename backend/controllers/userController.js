const userModel = require('../models/userModel');

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

// Exporting the functions to be used in routes
module.exports = {
    getAllUsers,
    getUserById,
};
