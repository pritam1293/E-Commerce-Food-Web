const UserModel = require('../models/userModel');
const { Op } = require('sequelize');

const registerUser = async (req, res) => {
    try {
        let {
            firstName = null, 
            middleName = null, 
            lastName = null, 
            email = null, 
            contactNo = null, 
            address = null, 
            password = null
        } = req.body;
        // Trim input values to remove leading/trailing spaces
        firstName = firstName ? firstName.trim() : null;
        middleName = middleName ? middleName.trim() : null;
        lastName = lastName ? lastName.trim() : null;
        email = email ? email.trim() : null;
        contactNo = contactNo ? contactNo.trim() : null;
        address = address ? address.trim() : null;
        password = password ? password.trim() : null;
        // Basic validation
        if (!email || !contactNo || !password) {
            return res.status(400).json({ error: 'Email, Contact Number and Password are required' });
        }
        // Email format validation
        if(!isValidEmail(email)) {
            return res.status(400).json({ error: 'Invalid email format' });
        }
        // Password validation
        const passwordValidation = PasswordTest(password);
        if (!passwordValidation.valid) {
            return res.status(400).json({ error: passwordValidation.message });
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
        return res.status(201).json({ message: 'User registered successfully', userDetails: userResponse });
    } catch (error) {
        // Handle Sequelize validation errors
        if(error.name === 'SequelizeValidationError') {
            return res.status(400).json({ error: error.errors.map(e => e.message) });
        }
        console.error('Error registering user:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}

// Function to check if the email is valid or not
const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

const PasswordTest = (password) => {
    // Check if password is provided
    if (!password) {
        return { valid: false, message: 'Password is required' };
    }
    // Spaces in password are not allowed
    if (/\s/.test(password)) {
        return { valid: false, message: 'Password should not contain spaces' };
    }
    // Password Length validation
    if (password.length < 6 || password.length > 15) {
        return { valid: false, message: 'Password must be between 6 and 15 characters' };
    }
    // At least one uppercase letter, one lowercase letter, one digit, and one special character
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    if (!hasUpperCase || !hasLowerCase || !hasNumber || !hasSpecialChar) {
        return { valid: false, message: 'Password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character' };
    }
    return { valid: true };
}

const loginUser = async (req, res) => {
    try {
        let {
            email = null, 
            contactNo = null, 
            password = null 
        } = req.body;
        // Trim input values to remove leading/trailing spaces
        email = email ? email.trim() : null;
        contactNo = contactNo ? contactNo.trim() : null;
        password = password ? password.trim() : null;
        // Password should not contain spaces
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
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}

const updateUserDetails = async (req, res) => {
    try {
        // Implementation for updating user details
        let {
            email = null, 
            updatedEmail = null, 
            firstName = null, 
            middleName = null, 
            lastName = null, 
            contactNo = null, 
            address = null, 
            password = null
        } = req.body;
        // Trim input values to remove leading/trailing spaces
        email = email ? email.trim() : null;
        updatedEmail = updatedEmail ? updatedEmail.trim() : null;
        firstName = firstName ? firstName.trim() : null;    
        middleName = middleName ? middleName.trim() : null;
        lastName = lastName ? lastName.trim() : null;
        contactNo = contactNo ? contactNo.trim() : null;
        address = address ? address.trim() : null;
        password = password ? password.trim() : null;
        // If a field is null then it will not be updated
        // Email format validation
        if (!email) {
            return res.status(400).json({ error: 'Current email is required to identify user' });
        }
        if(!isValidEmail(email)) {
            return res.status(400).json({ error: 'Invalid email format' });
        }
        // Password validation
        if (password) {
            const passwordValidation = PasswordTest(password);
            if (!passwordValidation.valid) {
                return res.status(400).json({ error: passwordValidation.message });
            }
        }
        if(updatedEmail && !isValidEmail(updatedEmail)) {
            return res.status(400).json({ error: 'Invalid updated email format' });
        }
        // Check if updated email or contact no already exists
        if (updatedEmail) {
            let user = await UserModel.findOne({ where: { email: updatedEmail } });
            if (user) {
                return res.status(400).json({ error: 'Updated email already exists' });
            }
        }
        if (contactNo) {
            let user = await UserModel.findOne({ where: { contact_no: contactNo } });
            if (user) {
                return res.status(400).json({ error: 'Contact number already exists' });
            }
        }
        const userDetails = await UserModel.findOne({ where: { email } });
        if (!userDetails) {
            return res.status(404).json({ error: 'User not found' });
        }
        // Update the fields if they are provided i.e. not null
        if (firstName !== null && firstName !== userDetails.first_name) userDetails.first_name = firstName;
        if (middleName !== null && middleName !== userDetails.middle_name) userDetails.middle_name = middleName;
        if (lastName !== null && lastName !== userDetails.last_name) userDetails.last_name = lastName;
        if (updatedEmail !== null && updatedEmail !== userDetails.email) userDetails.email = updatedEmail;
        if (contactNo !== null && contactNo !== userDetails.contact_no) userDetails.contact_no = contactNo;
        if (address !== null && address !== userDetails.address) userDetails.address = address;
        // Hashing of password will be done in the model hook
        if (password !== null) userDetails.password = password;
        await userDetails.save();
        const updatedUserDetails = userDetails.toJSON();
        delete updatedUserDetails.password;
        return res.json({ message: 'User details updated successfully', user: updatedUserDetails });
    } catch (error) {
        console.error('Error updating user details:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}

module.exports = { registerUser, loginUser, updateUserDetails };
