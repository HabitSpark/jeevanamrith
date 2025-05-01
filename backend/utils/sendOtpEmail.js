const nodemailer = require('nodemailer');
const dotenv = require('dotenv');

dotenv.config();

const sendOtpEmail = async(email, otp) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.GMAIL_EMAIL,
            pass: process.env.GMAIL_APP_PASSWORD,
        },
    });

    const mailOptions = {
        from: process.env.GMAIL_EMAIL,
        to: email,
        subject: 'Your OTP for Login',
        text: `Your OTP is: ${otp}`,
    };

    await transporter.sendMail(mailOptions);
};

module.exports = sendOtpEmail;