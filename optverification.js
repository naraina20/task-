const { UserOtpVerification } = require("verifyEmail.js")
const sendToken = require("JWTtoken");
const crypto = require("crypto");
const sendEmail = require("sendEmail");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const User = require("./UserOTPVerification")


const sendOTPVerificationEmail = async () => {
    const otp = `${Math.floor(1000 + Math.random() * 9000)}`
    try {
        sendEmail({
            from: process.env.SMPT_MAIL,
            to: email,
            subject: "Verify your Email",
            html: `<p>Enter <b> ${otp}</b> in the box</p>`,
        });
         
        // hash the otp
        const saltRounds = 10;
        const hashedOTP = await bcrypt.hash(otp, saltRounds);
        const newOTPVerification = await new UserOtpVerification({
            userId: _id,
            otp: hashedOTP,
            createdAt: Date.now(),
            expiresAt: Date.now() + 3600000,
        });

        // save otp record
        await newOTPVerification.save();
        await transporter.sendMail(mailOptions);
        res.json({
            status: "PENDING",
            message: "Verification otp email sent",
            data: {
                userId: _id,
                email
            },
        });
    } catch (error) {
        res.json({
            status: "FAILED",
            message: error.message,
        });
    }
};