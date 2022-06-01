const nodeMailer = require("nodemailer");
const { google } = require("googleapis");
// const catchAsyncError = require("../middleware/catchAsyncError");
const User = require("./UserOTPVerification")

const CLIENT_ID =
  "649610982832-qhfemhgsqje52imcoblsjg58ukh85mjg.apps.googleusercontent.com";

const CLIENT_SECRET = "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";

const REDIRECT_URI = "https://developers.google.com/oauthplayground";

const REFRESH_TOKEN =
  "1//04st_V5CZciktCgYIARAAGAQSNwF-L9Ir8OMBJEdC2RB6wQhIaxG5_pDx9YsRi5nJA1IRDA-1bs9NUJnQ9wAF0gRZC1yBkEUpmVE";

const oauth2client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
);
oauth2client.setCredentials({ refresh_token: REFRESH_TOKEN });

const sendEmail = async (Option) => {
  const accessToken = await oauth2client.getAccessToken();

  const transporter = nodeMailer.createTransport({
    // host: process.env.SMPT_HOST,
    // host: "smtp.gmail.com",
    // port: process.env.SMPT_PORT,
    // port:465,
    service: process.env.SMPT_SERVICE,
    auth: {
      type: "OAuth2",
      user: process.env.SMPT_MAIL,
      clientId: CLIENT_ID,
      clientSecret: CLIENT_SECRET,
      refreshToken: REFRESH_TOKEN,
      accessToken: accessToken,
    },
  });

  const mailOptions = {
    from: process.env.SMPT_MAIL,
    to: Option.email,
    subject: Option.subject,
    text: Option.message,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
