const OTPModel = require('../models/otpModel');

// Generate 6 digit OTP, and store it in the database
const generateOTP = async (req, res) => {
    try {
        const { email = null } = req.body;
        if (typeof email !== 'string') {
            return res.status(400).json({ message: 'Invalid email format' });
        }
        if (!email) {
            return res.status(400).json({ message: 'Email is required' });
        }
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const expiryTime = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now
        // Send the OTP via email
        const emailService = require('./emailService');
        const emailResult = await emailService.sendOTPEmail(email, otp, 'User');
        if (!emailResult) {
            return res.status(500).json({ message: 'Failed to send OTP email' });
        }
        // Store the OTP and its expiry time in the database
        await OTPModel.create({
            email: email,
            action: 'signup',
            otp: otp,
            expiry_time: expiryTime,
            verified: false,
            created_at: new Date(),
            updated_at: new Date()
        });
        return res.status(200).json({ message: 'OTP generated and sent successfully', otp: otp });
    } catch (error) {
        console.error('Error generating OTP:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}

const VerifyOTP = async (req, res) => {
    try {
        const { email, otp } = req.body;
        const record = await OTPModel.findOne({
            where: {
                email: email,
                action: 'signup',
                verified: false
            }
        });
        if (!record) {
            return res.status(400).json({ message: 'OTP not found' });
        }
        if (record.otp !== otp) {
            return res.status(400).json({ message: 'Invalid OTP' });
        }
        if (record.expiry_time < new Date()) {
            return res.status(400).json({ message: 'OTP expired' });
        }
        // Mark OTP as verified
        record.verified = true;
        await record.save();
        return res.status(200).json({ message: 'OTP verified successfully' });
    } catch (error) {
        console.error('Error verifying OTP:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};

module.exports = {
    generateOTP,
    VerifyOTP
};