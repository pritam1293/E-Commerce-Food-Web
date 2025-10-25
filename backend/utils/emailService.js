const createTransporter = require('../config/email');

// Send OTP Email
const sendOTPEmail = async (toEmail, otp, fullName) => {
    try {
        if (!fullName) {
            fullName = 'User';
        }
        const transporter = createTransporter();
        const mailOptions = {
            from: process.env.GMAIL_USER,
            to: toEmail,
            subject: 'Your OTP Code - Verify Your Email',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #333;">Email Verification</h2>
                    <p>Dear ${fullName},</p>
                    <p>Your OTP code for email verification is:</p>
                    <div style="background-color: #f4f4f4; padding: 15px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 5px; margin: 20px 0;">
                        ${otp}
                    </div>
                    <p>This OTP will expire in 10 minutes.</p>
                    <p>If you didn't request this, please ignore this email.</p>
                    <br>
                    <p>Best regards,<br>Eato Team</p>
                </div>
            `
        };
        await transporter.sendMail(mailOptions);
        return { success: true };
    } catch (error) {
        console.error('Error sending OTP email:', error);
        return { success: false, error: error.message };
    }
};

// Send Welcome Email
const sendWelcomeEmail = async (toEmail, fullName) => {
    try {
        if (!fullName) {
            fullName = 'User';
        }
        const transporter = createTransporter();
        const mailOptions = {
            from: process.env.GMAIL_USER,
            to: toEmail,
            subject: 'Welcome to Our Platform! 🎉',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #4CAF50;">Welcome Aboard, ${fullName}! 🎉</h2>
                    <p>Thank you for joining our platform. We're excited to have you!</p>
                    <p>Your account has been successfully created and verified.</p>
                    <p>You can now:</p>
                    <ul>
                        <li>Browse our menu</li>
                        <li>Place orders</li>
                        <li>Track your deliveries</li>
                        <li>And much more!</li>
                    </ul>
                    <p>If you have any questions, feel free to reach out to our support team.</p>
                    <br>
                    <p>Happy shopping!<br>Eato Team</p>
                </div>
            `
        };
        await transporter.sendMail(mailOptions);
        return { success: true };
    } catch (error) {
        console.error('Error sending welcome email:', error);
        return { success: false, error: error.message };
    }
};

// Send Login Notification Email
const sendLoginNotificationEmail = async (toEmail, fullName = {}) => {
    try {
        const transporter = createTransporter();
        const loginTime = new Date().toLocaleString();
        const mailOptions = {
            from: process.env.GMAIL_USER,
            to: toEmail,
            subject: 'New Login to Your Account',
            html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #333;">New Login Detected</h2>
                <p>Hi ${fullName},</p>
                <p>We detected a new login to your account on ${loginTime}.</p>
                <p>If this was you, you can safely ignore this email.</p>
                <p style="color: #d32f2f;"><strong>If this wasn't you, please change your password immediately or contact our support team.</strong></p>
                <br>
                <p>Best regards,<br>Eato Team</p>
            </div>
            `
        };
        await transporter.sendMail(mailOptions);
        return { success: true };
    } catch (error) {
        console.error('Error sending login notification email:', error);
        return { success: false, error: error.message };
    }
};

// Send Password Changed Email
const sendPasswordChangedEmail = async (toEmail, fullName) => {
    try {
        const transporter = createTransporter();
        const changeTime = new Date().toLocaleString();
        const mailOptions = {
            from: process.env.GMAIL_USER,
            to: toEmail,
            subject: 'Your Password Has Been Changed',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #333;">Password Changed Successfully</h2>
                    <p>Hi ${fullName},</p>
                    <p>Your password was successfully changed on ${changeTime}.</p>
                    <div style="background-color: #e8f5e9; padding: 15px; border-left: 4px solid #4CAF50; margin: 20px 0;">
                        <p><strong>✓ Your password has been updated</strong></p>
                    </div>
                    <p>If you made this change, you can safely ignore this email.</p>
                    <p style="color: #d32f2f;"><strong>If you did NOT make this change, please contact our support team immediately.</strong></p>
                    <br>
                    <p>Best regards,<br>Eato Team</p>
                </div>
            `
        };
        await transporter.sendMail(mailOptions);
        return { success: true };
    } catch (error) {
        console.error('Error sending password changed email:', error);
        return { success: false, error: error.message };
    }
};

// Send Email Change Notification (to both old and new email)
const sendEmailChangeNotification = async (oldEmail, newEmail, fullName) => {
    try {
        const transporter = createTransporter();
        const changeTime = new Date().toLocaleString();

        // Email to OLD email address
        const mailOptionsOld = {
            from: process.env.GMAIL_USER,
            to: oldEmail,
            subject: 'Email Change Request on Your Account',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #ff9800;">Email Change Request</h2>
                    <p>Hi ${fullName},</p>
                    <p>Your account email was changed on ${changeTime}.</p>
                    <div style="background-color: #fff3e0; padding: 15px; border-left: 4px solid #ff9800; margin: 20px 0;">
                        <p><strong>Previous Email:</strong> ${oldEmail}</p>
                        <p><strong>New Email:</strong> ${newEmail}</p>
                    </div>
                    <p>If you made this change, you can safely ignore this email.</p>
                    <p style="color: #d32f2f;"><strong>If you did NOT make this change, please contact our support team immediately as your account may be compromised.</strong></p>
                    <br>
                    <p>Best regards,<br>Eato Team</p>
                </div>
            `
        };

        // Email to NEW email address
        const mailOptionsNew = {
            from: process.env.GMAIL_USER,
            to: newEmail,
            subject: 'Your Email Has Been Updated',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #4CAF50;">Email Successfully Updated</h2>
                    <p>Hi ${fullName},</p>
                    <p>This email confirms that ${newEmail} is now your new account email as per your request on ${changeTime}.</p>
                    <div style="background-color: #e8f5e9; padding: 15px; border-left: 4px solid #4CAF50; margin: 20px 0;">
                        <p><strong>✓ Email updated successfully</strong></p>
                        <p><strong>Your new email:</strong> ${newEmail}</p>
                    </div>
                    <p>You can now use this email to log in to your account.</p>
                    <p>If you didn't make this change, please contact our support team immediately.</p>
                    <br>
                    <p>Best regards,<br>Your E-Commerce Team</p>
                </div>
            `
        };

        // Send both emails
        await Promise.all([
            transporter.sendMail(mailOptionsOld),
            transporter.sendMail(mailOptionsNew)
        ]);

        return { success: true };
    } catch (error) {
        console.error('Error sending email change notification:', error);
        return { success: false, error: error.message };
    }
};

const deleteAccountMessage = async (toEmail, fullName) => {
    try {
        const transporter = createTransporter();
        const mailOptions = {
            from: process.env.GMAIL_USER,
            to: toEmail,
            subject: 'Account Deletion Confirmation',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #d32f2f;">Account Deletion Confirmation</h2>
                    <p>Hi ${fullName},</p>
                    <p>We're sorry to see you go! Your account has been successfully deleted.</p>
                    <p>If you have any feedback or questions, feel free to reach out to our support team.</p>
                    <br>
                    <p>Best regards,<br>Eato Team</p>
                </div>
            `
        };
        await transporter.sendMail(mailOptions);
        return { success: true };
    } catch (error) {
        console.error('Error sending account deletion message:', error);
        return { success: false, error: error.message };
    }
};

module.exports = {
    sendOTPEmail,
    sendWelcomeEmail,
    sendLoginNotificationEmail,
    sendPasswordChangedEmail,
    sendEmailChangeNotification,
    deleteAccountMessage
};
