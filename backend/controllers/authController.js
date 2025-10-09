const UserModel = require('../models/userModel');
const { Op } = require('sequelize');

const registerUser = async (req, res) => {
    try {
        let { firstName, middleName, lastName, email, contactNo, address, password } = req.body;
        // Trim input values to remove leading/trailing spaces
        firstName = firstName ? firstName.trim() : null;
        middleName = middleName ? middleName.trim() : null;
        lastName = lastName ? lastName.trim() : null;
        email = email ? email.trim() : null;
        contactNo = contactNo ? contactNo.trim() : null;
        address = address ? address.trim() : null;
        password = password ? password.trim() : null;
        // Spaces in password are not allowed
        if(!isValidEmail(email)) {
            return res.status(400).json({ error: 'Invalid email format' });
        }
        if (password && /\s/.test(password)) {
            return res.status(400).json({ error: 'Password should not contain spaces' });
        }
        // Basic validation
        if (!email || !contactNo || !password) {
            return res.status(400).json({ error: 'Email, Contact Number and Password are required' });
        }
        // Password length and strength validation
        if (password.length < 6 || password.length > 15) {
            return res.status(400).json({ error: 'Password must be between 6 and 15 characters' });
        }
        // At least one uppercase letter, one lowercase letter, one digit, and one special character
        const hasUpperCase = /[A-Z]/.test(password);
        const hasLowerCase = /[a-z]/.test(password);
        const hasNumber = /\d/.test(password);
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
        if (!hasUpperCase || !hasLowerCase || !hasNumber || !hasSpecialChar) {
            return res.status(400).json({ error: 'Password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character' });
        }
        // Check if email or contact no already exists
        let user = await UserModel.findOne({ where: { email } });
        if (user) {
            return res.status(400).json({ error: 'Email already exists' });
        }
        user = await UserModel.findOne({ where: { contact_no: contactNo } });
        if (user) {
            return res.status(400).json({ error: 'Contact number already exists' });
        }
        // Insert new user into the database
        const newUser = await UserModel.create({
            first_name: firstName,
            middle_name: middleName,
            last_name: lastName,
            email,
            contact_no: contactNo,
            address,
            password
        });
        // Return success response with created user details (excluding password)
        const userResponse = newUser.toJSON();
        delete userResponse.password;
        res.status(201).json({ message: 'User registered successfully', userDetails: userResponse });
    } catch (error) {
        // Handle Sequelize validation errors
        if(error.name === 'SequelizeValidationError') {
            return res.status(400).json({ error: error.errors.map(e => e.message) });
        }
        console.error('Error registering user:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

// Function to check if the email is valid or not
const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

const loginUser = async (req, res) => {
    try {
        let { email, contactNo, password } = req.body;
        // Trim input values to remove leading/trailing spaces
        email = email ? email.trim() : null;
        contactNo = contactNo ? contactNo.trim() : null;
        password = password ? password.trim() : null;
        // Passwoed should not contain spaces
        if (password && /\s/.test(password)) {
            return res.status(400).json({ error: 'Password should not contain spaces' });
        }
        // Email format validation
        if(email && !isValidEmail(email)) {
            return res.status(400).json({ error: 'Invalid email format' });
        }
        // Check if either email or contactNo is provided
        if (!email && !contactNo) {
            return res.status(400).json({ error: 'Email or Contact Number is required' });
        }
        // Password is required
        if (!password) {
            return res.status(400).json({ error: 'Password is required' });
        }
        const userQuery = await UserModel.findOne({
            where: {
                [Op.or]: [
                    email ? { email } : null,
                    contactNo ? { contact_no: contactNo } : null
                ].filter(Boolean)
            }
        });
        if (!userQuery) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }
        const isPasswordValid = await userQuery.validatePassword(password);
        if(isPasswordValid) {
            const userResponse = userQuery.toJSON();
            delete userResponse.password;
            return res.json({ message: 'Login successful', user: userResponse });
        } else {
            return res.status(400).json({ error: 'Invalid credentials' });
        }
    } catch (error) {
        console.error('Error logging in user:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

module.exports = { registerUser, loginUser };
