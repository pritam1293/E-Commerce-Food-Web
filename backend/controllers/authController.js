const db = require('../config/db');

const registerUser = async (req, res) => {
    try {
        const {firstName, middleName, lastName, email, countryCode, contactNo, address, password} = req.body;
        // Pushing the data to the database
        const [result] = await db.query(
            'INSERT INTO users (first_name, middle_name, last_name, email, country_code, contact_no, address, password) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [firstName, middleName, lastName, email, countryCode, contactNo, address, password]
        );
        res.status(201).json({ message: 'User registered successfully', userId: result.insertId });
    } catch (error) {
        // Handle duplicate entry error for unique fields
        if(error.code === 'ER_DUP_ENTRY') {
            // Check which field caused the duplicate entry
            if(error.message.includes('email')) {
                return res.status(400).json({ error: 'Email already exists' });
            }
            if(error.message.includes('contactNo')) {
                return res.status(400).json({ error: 'Contact number already exists' });
            }
        }
        console.error('Error registering user:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

const loginUser = (req, res) => {
    try {
        const { email, contactNo, password } = req.body;
        // Check if either email or contactNo is provided
        if (!email && !contactNo) {
            return res.status(400).json({ error: 'Email or Contact Number is required' });
        }
        // Query to find user by email or contact number and password
        db.query('SELECT * FROM users WHERE (email = ? OR contact_no = ?) AND password = ?', [email, contactNo, password])
            .then(([rows]) => {
                // If user is found, return success response
                if (rows.length > 0) {
                    res.json({ message: 'Login successful', user: rows[0] });
                } else {
                    res.status(401).json({ error: 'Invalid email or password' });
                }
            })
            .catch((error) => {
                console.error('Error logging in user:', error);
                res.status(500).json({ error: 'Internal Server Error' });
            });
    } catch (error) {
        console.error('Error logging in user:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

module.exports = { registerUser, loginUser };
