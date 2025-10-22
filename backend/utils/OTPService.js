// In-memory OTP storage (for production, use Redis or database)
const otpStorage = new Map();

// OTP expiry time in milliseconds (10 minutes)
const OTPExpiryTime = 10 * 60 * 1000;

// Generate 6-digit OTP
const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

// Store OTP with expiry time
const storeOTP = (email, otp) => {
    const expiryTime = Date.now() + OTPExpiryTime;
    otpStorage.set(email.toLowerCase(), {
        otp,
        expiryTime,
        attempts: 0
    });
};

// Verify OTP
const verifyOTP = (email, otp) => {
    const emailKey = email.toLowerCase();
    const otpData = otpStorage.get(emailKey);

    if (!otpData) {
        return { valid: false, error: 'OTP not found or expired. Please request a new OTP.' };
    }

    // Check if OTP has expired
    if (Date.now() > otpData.expiryTime) {
        otpStorage.delete(emailKey);
        return { valid: false, error: 'OTP has expired. Please request a new OTP.' };
    }

    // Check attempt limit (max 3 attempts)
    if (otpData.attempts >= 3) {
        otpStorage.delete(emailKey);
        return { valid: false, error: 'Maximum OTP verification attempts exceeded. Please request a new OTP.' };
    }

    // Verify OTP
    if (otpData.otp === otp.trim()) {
        otpStorage.delete(emailKey); // Remove OTP after successful verification
        return { valid: true };
    } else {
        otpData.attempts += 1;
        otpStorage.set(emailKey, otpData);
        return { valid: false, error: `Invalid OTP. ${3 - otpData.attempts} attempts remaining.` };
    }
};

// Clear expired OTPs periodically (cleanup function)
const clearExpiredOTPs = () => {
    const now = Date.now();
    for (const [email, otpData] of otpStorage.entries()) {
        if (now > otpData.expiryTime) {
            otpStorage.delete(email);
        }
    }
};

// Run cleanup every 10 minutes
setInterval(clearExpiredOTPs, 10 * 60 * 1000);

module.exports = {
    generateOTP,
    storeOTP,
    verifyOTP
};