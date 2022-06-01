const express = require('express');
const router = express.Router();


// const nodemailer = require("nodemailer")
// const { v4: uuidv4 } = require("uuid");

const User = require("./User")
const UserOTPVerification = require("./UserOTPVerification")
const bcrypt = require("bcryptjs")
// const sendToken = require("JWTtoken");
// const crypto = require("crypto");
const sendEmail = require("./sendEmail");
// const validator = require("validator");
// const UserOTPVerification = require("./UserOTPVerification")

// //send otp email
//   try {
//     await sendEmail({
//       email: user.email,
//       subject: `Ecommerce password recovery`,
//       message,
//     });

//     res.status(200).json({
//       success: true,
//       message: `Email sent to ${user.email} successfully`,
//     });
//   } catch (error) {
//     user.resetPasswordToken = undefined;
//     user.resetPasswordExpire = undefined;

//     await user.save({ validateBeforeSave: false });

// };




//singup 
router.post('/signup', (req, res) => {
    let { name, email, password, dateOfbirth } = req.body;

    name = name;
    email = email;
    password = password;
    dateOfbirth = dateOfbirth;

    if (password.length < 8) {
        res.json({
            status: "FAILED", 
            message : "password is too short!"
        })
    }else{
        User.find({ email }).then(result => {
            if (result.length) {
                res.json({
                    status: "failed",
                    message: " User with the provided email already exists"
                })
            } else {
                const saltRounds = 10;
                bcrypt.hash(password, saltRounds).then(hashedPassword => {
                    const newUser = new User({
                        name,
                        email,
                        password: hashedPassword,
                        dateOfbirth,
                        verified: false
                    });

                    newUser.save().then((result) => {
                        sendOTPVerificationEmail(result, res);
                    }).catch(() => {
                        res.json({
                            status: "FAILED",
                            message: " error with saving user account"
                        })
                    })
                })
            }
        })
    };

});

//otp request




const sendOTPVerificationEmail = async ({_id, email }, res) => {
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
        const newOTPVerification = await new UserOTPVerification({
            userId: _id,
            otp: hashedOTP,
            createdAt: Date.now(),
            expiresAt: Date.now() + 3600000,
        });

        // save otp record
        await newOTPVerification.save();
        // await transporter.sendMail(mailOptions);
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


module.exports = router;

