"use strict";

const nodemailer = require("nodemailer");
const transporter = nodemailer.createTransport({
    //host: "smtp.forwardemail.net",
    host:"smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL,
      pass:  process.env.EMAIL_PASSWORD
    }
});

const sendMail=async(subject,to,html)=>{
    const info = await transporter.sendMail({
        from:  process.env.EMAIL, // sender address
        to: to, 
        subject: subject, // Subject line
        html:html,
        date:Date.now(),
        priority:"high",
        encoding:'utf-8'
      });
      return info
}
// This function send the email verification mail to the user 
const sendVerificationMail = async(to,firstname,code)=>{
    const subject = "Email Verification"
    const html =`
    <p>Dear ${firstname},</p>
    <p>Thank you for registering with our app. To complete your registration, please use the following verification code:</p>
    <h2>${code}</h2>
    <p>If you did not register with us, please ignore this email.</p>
    <p>Thank you,</p>
    <p>Your Tiffin Team</p>
    
    `
  return await sendMail(subject,to,html)

}
const sendPasswordResetCodeMail = async(to,firstname,code)=>{
    const subject = "Password reset code"
    const currentTime = new Date(Date.now())
    const html =`
    <p>Hi ${firstname},</p>
    <p>This email is to inform you that a password reset request was made for your account at <a href="[website address]">[website address]</a>. The request was made at <strong>${currentTime}</strong>.</p>
    <p>To reset your password, please enter the following code on the password reset page:</p>
    <p><strong>${code}</strong></p>
    <p>The code will only be valid for 5 minutes. If you do not reset your password within 5 minutes, you will need to start the process again.</p>
    <p>If you did not request a password reset, please disregard this email.</p>
    <p>Thank you</p>
    <p>Your Tiffin Team</p>
    `
  return await sendMail(subject,to,html)

}


module.exports = {sendMail,sendVerificationMail,sendPasswordResetCodeMail}
