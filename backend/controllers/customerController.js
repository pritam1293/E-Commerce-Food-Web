const db = require('../config/db');

/* Function to get all users */
const getAllUsers = async (req, res) => {
    try {
        // Fetch all users from the database
        const [users] = await db.query('SELECT * FROM users');
        // Return the list of users in the form of JSON
        res.json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};


/* Function to get a user by ID */
const getUserById = async (req, res) => {
    try {
        const { id } = req.params;
        const [user] = await db.query('SELECT * FROM users WHERE id = ?', [id]);
        // If user is found, return user data, else return 404
        if (user.length > 0) {
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
