const UserModel = require('../models/userModel');
const sequelize = require('../config/database');
const { Op } = require('sequelize');
const jwt = require('jsonwebtoken');

const { clearUsersCache  } = require('../utils/cache');

const registerUser = async (req, res) => {
    const transaction = await sequelize.transaction();
    try {
        let {
            firstName = null,
            middleName = null,
            lastName = null,
            email = null,
            contactNo = null,
            address = null,
            password = null,
            adminSecretCode = null
        } = req.body;
        // Validate the data types
        if (typeof firstName !== 'string' && firstName !== null) {
            await transaction.rollback();
            return res.status(400).json({ error: 'Invalid data type for first name' });
        }
        if (typeof middleName !== 'string' && middleName !== null) {
            await transaction.rollback();
            return res.status(400).json({ error: 'Invalid data type for middle name' });
        }
        if (typeof lastName !== 'string' && lastName !== null) {
            await transaction.rollback();
            return res.status(400).json({ error: 'Invalid data type for last name' });
        }
        if (typeof email !== 'string' && email !== null) {
            await transaction.rollback();
            return res.status(400).json({ error: 'Invalid data type for email' });
        }
        if (typeof contactNo !== 'string' && contactNo !== null) {
            await transaction.rollback();
            return res.status(400).json({ error: 'Invalid data type for contact number' });
        }
        if (typeof address !== 'string' && address !== null) {
            await transaction.rollback();
            return res.status(400).json({ error: 'Invalid data type for address' });
        }
        if (typeof password !== 'string' && password !== null) {
            await transaction.rollback();
            return res.status(400).json({ error: 'Invalid data type for password' });
        }
        if (typeof adminSecretCode !== 'string' && adminSecretCode !== null) {
            await transaction.rollback();
            return res.status(400).json({ error: 'Invalid data type for admin secret code' });
        }

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
            await transaction.rollback();
            return res.status(400).json({ error: 'Email, Contact Number and Password are required' });
        }
        // Email format validation
        if (!isValidEmail(email)) {
            await transaction.rollback();
            return res.status(400).json({ error: 'Invalid email format' });
        }
        if (!isValidPhoneNumber(contactNo)) {
            await transaction.rollback();
            return res.status(400).json({ error: 'Invalid contact number format' });
        }
        // Password validation
        const passwordValidation = PasswordTest(password);
        if (!passwordValidation.valid) {
            await transaction.rollback();
            return res.status(400).json({ error: passwordValidation.message });
        }
        // Check if email or contact no already exists
        let user = await UserModel.findOne({
            where: { email },
            transaction
        });
        if (user) {
            await transaction.rollback();
            return res.status(400).json({ error: 'Email already exists' });
        }
        user = await UserModel.findOne({ where: { contact_no: contactNo }, transaction });
        if (user) {
            await transaction.rollback();
            return res.status(400).json({ error: 'Contact number already exists' });
        }
        let role = 'user';
        if (adminSecretCode) {
            if (adminSecretCode === process.env.ADMIN_SECRET_CODE) {
                role = 'admin';
            } else {
                await transaction.rollback();
                return res.status(400).json({ error: 'Invalid admin secret code' });
            }
        }
        // Insert new user into the database
        const newUser = await UserModel.create({
            first_name: firstName,
            middle_name: middleName,
            last_name: lastName,
            email,
            contact_no: contactNo,
            address,
            password,
            role
        }, { transaction });
        await transaction.commit();
        // Return success response with created user details (excluding password)
        const userResponse = newUser.toJSON();
        delete userResponse.password;

        // Clear users cache
        clearUsersCache();

        const authToken = jwt.sign(
            {
                id: userResponse.id,
                email: userResponse.email,
                role: userResponse.role
            },
            process.env.JWT_SECRET,
            { expiresIn: '28d' }
        );

        return res.status(201).json({ 
            message: `User registered successfully${role === 'admin' ? ' as an admin' : ''}`, 
            userDetails: userResponse,
            token: authToken
        });
    } catch (error) {
        await transaction.rollback();
        // Handle Sequelize unique constraint errors, race condition protection
        if (error.name === 'SequelizeUniqueConstraintError') {
            const field = Object.keys(error.fields)[0];
            const fieldName = field.replace('_', ' ');
            return res.status(400).json({
                error: `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} already exists`
            });
        }
        // Handle Sequelize validation errors
        if (error.name === 'SequelizeValidationError') {
            return res.status(400).json({ error: error.errors.map(e => e.message) });
        }
        console.error('Error registering user:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}

const loginUser = async (req, res) => {
    try {
        let {
            email = null,
            contactNo = null,
            password = null
        } = req.body;
        // Validation of the data types
        if (email !== null && typeof email !== 'string') {
            return res.status(400).json({ error: 'Invalid data type for email' });
        }
        if (contactNo !== null && typeof contactNo !== 'string') {
            return res.status(400).json({ error: 'Invalid data type for contact number' });
        }
        if (password !== null && typeof password !== 'string') {
            return res.status(400).json({ error: 'Invalid data type for password' });
        }
        // Trim input values to remove leading/trailing spaces
        email = email ? email.trim() : null;
        contactNo = contactNo ? contactNo.trim() : null;
        password = password ? password.trim() : null;
        // Password should not contain spaces
        if (password && /\s/.test(password)) {
            return res.status(400).json({ error: 'Password should not contain spaces' });
        }
        // Email format validation
        if (email && !isValidEmail(email)) {
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
        if (isPasswordValid) {
            const userResponse = userQuery.toJSON();
            delete userResponse.password;

            // Generate JWT token with user ID and email
            const authToken = jwt.sign(
                {
                    id: userResponse.id,
                    email: userResponse.email,
                    role: userResponse.role
                },
                process.env.JWT_SECRET,
                { expiresIn: '28d' }
            );

            return res.json({
                message: 'Login successful',
                user: userResponse,
                token: authToken
            });
        } else {
            return res.status(400).json({ error: 'Invalid credentials' });
        }
    } catch (error) {
        console.error('Error logging in user:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}

const updateUserDetails = async (req, res) => {
    const transaction = await sequelize.transaction();
    try {
        // Get user ID from JWT token (set by authenticateToken middleware)
        const userId = req.user.id;

        let {
            updatedEmail = null,
            firstName = null,
            middleName = null,
            lastName = null,
            contactNo = null,
            address = null,
            currentPassword = null,
            newPassword = null,
        } = req.body;
        // Validate the data types
        if (updatedEmail != null && typeof updatedEmail !== 'string') {
            await transaction.rollback();
            return res.status(400).json({ error: 'Invalid data type for updated email' });
        }
        if (firstName != null && typeof firstName !== 'string') {
            await transaction.rollback();
            return res.status(400).json({ error: 'Invalid data type for first name' });
        }
        if (middleName != null && typeof middleName !== 'string') {
            await transaction.rollback();
            return res.status(400).json({ error: 'Invalid data type for middle name' });
        }
        if (lastName != null && typeof lastName !== 'string') {
            await transaction.rollback();
            return res.status(400).json({ error: 'Invalid data type for last name' });
        }
        if (contactNo != null && typeof contactNo !== 'string') {
            await transaction.rollback();
            return res.status(400).json({ error: 'Invalid data type for contact number' });
        }
        if (address != null && typeof address !== 'string') {
            await transaction.rollback();
            return res.status(400).json({ error: 'Invalid data type for address' });
        }
        if (currentPassword != null && typeof currentPassword !== 'string') {   
            await transaction.rollback();
            return res.status(400).json({ error: 'Invalid data type for current password' });
        }
        if (newPassword != null && typeof newPassword !== 'string') {
            await transaction.rollback();
            return res.status(400).json({ error: 'Invalid data type for new password' });
        }
        // Trim input values to remove leading/trailing spaces
        updatedEmail = updatedEmail ? updatedEmail.trim() : null;
        firstName = firstName ? firstName.trim() : null;
        middleName = middleName ? middleName.trim() : null;
        lastName = lastName ? lastName.trim() : null;
        contactNo = contactNo ? contactNo.trim() : null;
        address = address ? address.trim() : null;
        currentPassword = currentPassword ? currentPassword.trim() : null;
        newPassword = newPassword ? newPassword.trim() : null;

        // Validate updated email format if provided
        if (updatedEmail && !isValidEmail(updatedEmail)) {
            await transaction.rollback();
            return res.status(400).json({ error: 'Invalid updated email format' });
        }
        if (contactNo && !isValidPhoneNumber(contactNo)) {
            await transaction.rollback();
            return res.status(400).json({ error: 'Invalid contact number format' });
        }
        // Password validation if password change is requested
        if (currentPassword && newPassword) {
            const currentPasswordValidation = PasswordTest(currentPassword);
            const newPasswordValidation = PasswordTest(newPassword);
            if (!currentPasswordValidation.valid) {
                await transaction.rollback();
                return res.status(400).json({ error: 'Current password: ' + currentPasswordValidation.message });
            }
            if (!newPasswordValidation.valid) {
                await transaction.rollback();
                return res.status(400).json({ error: 'New password: ' + newPasswordValidation.message });
            }
        }

        // Check if updated email or contact no already exists (for other users)
        if (updatedEmail) {
            let user = await UserModel.findOne({
                where: {
                    email: updatedEmail,
                    id: { [Op.ne]: userId }  // Exclude current user
                },
                transaction
            });
            if (user) {
                await transaction.rollback();
                return res.status(400).json({ error: 'Updated email already exists' });
            }
        }
        if (contactNo) {
            let user = await UserModel.findOne({
                where: {
                    contact_no: contactNo,
                    id: { [Op.ne]: userId }  // Exclude current user
                },
                transaction
            });
            if (user) {
                await transaction.rollback();
                return res.status(400).json({ error: 'Contact number already exists' });
            }
        }

        // Find user by ID from token (not from request body)
        const userDetails = await UserModel.findByPk(userId, { transaction });

        if (!userDetails) {
            await transaction.rollback();
            return res.status(404).json({ error: 'User not found' });
        }

        // Update the fields if they are provided i.e. not null
        let isEmailUpdated = false;
        let isPasswordChanged = false;
        if (firstName !== null && firstName !== userDetails.first_name) userDetails.first_name = firstName;
        if (middleName !== null && middleName !== userDetails.middle_name) userDetails.middle_name = middleName;
        if (lastName !== null && lastName !== userDetails.last_name) userDetails.last_name = lastName;
        if (updatedEmail !== null && updatedEmail !== userDetails.email) {
            userDetails.email = updatedEmail;
            isEmailUpdated = true;
        }
        if (contactNo !== null && contactNo !== userDetails.contact_no) userDetails.contact_no = contactNo;
        if (address !== null && address !== userDetails.address) userDetails.address = address;
        if(currentPassword !== null && newPassword !== null) {
            const isCurrentPasswordValid = await userDetails.validatePassword(currentPassword);
            if (!isCurrentPasswordValid) {
                await transaction.rollback();
                return res.status(400).json({ error: 'Current password is incorrect' });
            }
            const isSamePassword = await userDetails.validatePassword(newPassword);
            if (isSamePassword) {
                await transaction.rollback();
                return res.status(400).json({ error: 'New password must be different from current password' });
            }
            userDetails.password = newPassword;
            isPasswordChanged = true;
        }
        await userDetails.save({ transaction });
        await transaction.commit();

        // Return success response with updated user details (excluding password)
        const updatedUserDetails = userDetails.toJSON();
        delete updatedUserDetails.password;
        let newAuthToken = null;
        if (isEmailUpdated || isPasswordChanged) {
            newAuthToken = jwt.sign(
                {
                    id: updatedUserDetails.id,
                    email: updatedUserDetails.email,
                    role: updatedUserDetails.role
                },
                process.env.JWT_SECRET,
                { expiresIn: '28d' }
            );
        }
        return res.json({ 
            message: 'User details updated successfully', 
            user: updatedUserDetails,
            // Return new token if email or password was changed otherwise no token
            ...(newAuthToken && { token: newAuthToken })
        });
    } catch (error) {
        await transaction.rollback();
        // Handle Sequelize unique constraint errors, race condition protection
        if (error.name === 'SequelizeUniqueConstraintError') {
            const field = Object.keys(error.fields)[0];
            const fieldName = field.replace('_', ' ');
            return res.status(400).json({
                error: `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} already exists`
            });
        }
        // Handle Sequelize validation errors
        if (error.name === 'SequelizeValidationError') {
            return res.status(400).json({ error: error.errors.map(e => e.message) });
        }
        console.error('Error updating user details:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}

const deleteUser = async (req, res) => {
    try {
        // Get user ID from JWT token (set by authenticateToken middleware)
        const userId = req.user.id;

        let { password = null } = req.body;

        // Trim input values to remove leading/trailing spaces
        password = password ? password.trim() : null;

        // Password is required for confirmation
        if (!password) {
            return res.status(400).json({ error: 'Password is required for account deletion' });
        }

        // Password validation
        const passwordValidation = PasswordTest(password);
        if (!passwordValidation.valid) {
            return res.status(400).json({ error: passwordValidation.message });
        }

        // Find user by ID from token
        const userQuery = await UserModel.findByPk(userId);

        if (!userQuery) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Verify password before deletion
        const isPasswordValid = await userQuery.validatePassword(password);
        if (!isPasswordValid) {
            return res.status(400).json({ error: 'Invalid password' });
        }

        await userQuery.destroy();
        return res.json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error('Error deleting user:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}

const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

const isValidPhoneNumber = (phoneNumber) => {
    // Country code with mobile number validation (not necessarily 10 digits)
    const phoneRegex = /^\+?\d{1,4}[\s-]?\d{4,15}$/;
    return phoneRegex.test(phoneNumber);
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

module.exports = { registerUser, loginUser, updateUserDetails, deleteUser };
