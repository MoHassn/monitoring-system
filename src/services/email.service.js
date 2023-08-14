const nodemailer = require('nodemailer');
const userService = require('./user.service')
require('dotenv').config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
});

const sendVerificationEmail = async (recipientEmail, verificationToken) => {
  const mailOptions = {
    from: process.env.GMAIL_USER,
    to: recipientEmail,
    subject: 'Verify Your Email',
    text: `Click the following link to verify your email: ${process.env.APP_URL}/users/verify/${verificationToken}`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Verification email sent successfully');
  } catch (error) {
    console.error('Error sending verification email:', error);
    throw error;
  }
};

const sendStatusReportEmail = async (urlCheck) => {
  const {status, name: urlCheckName} = urlCheck;
  const {name, email} = await userService.getUserById(urlCheck.userId);
  
  const emailSubject = `URL Check Status Update: ${urlCheckName}`;
    const emailText = `Dear ${name},\n\nThe status of your URL check "${urlCheckName}" is now ${status}.\n\nBest regards,\nThe Monitoring System Team`;

    const mailOptions = {
      from: process.env.EMAIL_USERNAME,
      to: email,
      subject: emailSubject,
      text: emailText,
    };

    try{
      await transporter.sendMail(mailOptions);
      console.log('Status Email sent to user:', urlCheck.userId);
    } catch (error) {
    console.error('Error');
  }

};


module.exports = { sendVerificationEmail, sendStatusReportEmail };
