import dotenv from "dotenv";
dotenv.config();
import nodemailer from "nodemailer";



// Email transporter
export const transporter = nodemailer.createTransport({
  host: process.env.SENDGRID_HOST,
  port: process.env.SENDGRID_PORT,
  secure: process.env.SENDGRID_SECURE,
  auth: {
    user: process.env.SENDGRID_USER, 
    pass: process.env.SENDGRID_API_KEY
  }
}); 

// Verify connection configuration
transporter.verify((error, success) => {
  if (error) {
    console.error("Email connection failed:", error.message);
  } else {
    console.log("Email server is ready to take messages");
  }
});

// General sendMail function
export const sendMail = async ({ from, to, subject, html }) => {
  try {
    const info = await transporter.sendMail({ from, to, subject, html });
    console.log("Email sent!");
    return info;
  } catch (error) {
    console.error("Error sending email:", error);
  }
};


// Verification link before full login
export const verifyAccountEmail = (email, verificationToken) => {
  const verificationLink = `${process.env.BASE_URL}/api/auth/verify-email?verificationToken=${verificationToken}`;

  return {
    from: `${process.env.SENDGRID_SENDER_EMAIL}>`,
    to: email,
    subject: "Verify your Todo-App account",
    html: `
      <p>Please verify your account by clicking the link below:</p>
      <p><a href='${verificationLink}'>Verify Email</a></p>
      <p>This link will expire in 30 minutes.</p>
      <p>If the link doesn't work, copy and paste this URL into your browser:</p>
      <p>${verificationLink}</p>
      <p>To test manually in postman, Copy and paste <strong>${verificationToken}</strong> in postman</p>
      <br>
      <p>If you requested a new link, only the latest one will work</p>
    `
  };
};

// Successful account verification email
export const successfulVerificationEmail = (email, username) => ({
  from: ` <${process.env.SENDGRID_SENDER_EMAIL}>`,
  to: email,
  subject: "Account Successfully Verified 🎉",
  html: `<h1>Welcome <strong>${username}</strong>! 🎉</h1>
         <br>
         <p>Your account has been successfully verified.</p>
         <p>We are excited to have you onboard and look forward to serving you.</p>`
});


// Password reset email
export const passwordResetEmail = (email, username, resetToken) => {
  return {
    from: ` <${process.env.SENDGRID_SENDER_EMAIL}>`,
    to: email,
    subject: "Password Reset Request",
    html: `
      <p>Hi <strong>${username},</strong></p>
      <p>We received a request to reset your password.</p>
      <p>Use the token below to reset it via the API (Postman or your client):</p>
      <p><b>${resetToken}</b></p>
      <p>This token will expire in 15 minutes.</p>
      <p>If you did not make this request, please ignore this email.</p>
    `
  };
};

// Successful password reset email
export const successfulPasswordReset = (email, username) => ({
  from: ` <${process.env.SENDGRID_SENDER_EMAIL}>`,
  to: email,
  subject: "Password Reset Successful",
  html: `
    <p>Hi <strong>${username},</strong></p>
    <p>Your password has been successfully reset.</p>
    <p>If you did not make this change, please reset it immediately and contact support.</p>
  `
});


// Account deletion confirmation email
export const accountDeletionConfirm = (email, username) => ({
  from: ` <${process.env.SENDGRID_SENDER_EMAIL}>`,
  to: email,
  subject: "Todo-App Account Deletion",
  html: ` <p>Hi <strong>${username},</strong></p>
          <p>This is to confirm that your Shopmate account has been successfully deleted</p>
          <p>If this was not you, please contact our support team immediately.</p>
        `
});









          




      
      
