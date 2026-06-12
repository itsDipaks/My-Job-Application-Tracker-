import nodemailer from "nodemailer";
import dotenv from "dotenv";
import crypto from "crypto";
import { responsehandler } from "./responsehandeler.js";
dotenv.config()
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});
 export class services extends responsehandler {
  constructor() {
    super()
  }
  GanerateEmailOtp = () => {
    const otp = crypto.randomInt(100000, 999999).toString();
    return otp
  };
  sendOTPEmail = async (toEmail, otp) => {
    try {
      let response = await transporter.sendMail({
        from: `"Job Tracker" <${process.env.SMTP_USER}>`,
        to: toEmail,
        subject: "Your verification OTP",
        html: `
      <div style="font-family: Arial, sans-serif; max-width: 400px; margin: auto;">
        <h2>Verify your email</h2>
        <p>Your OTP is:</p>
        <h1 style="letter-spacing: 8px; color: #4F46E5;">${otp}</h1>
        <p>This OTP expires in <strong>10 minutes</strong>.</p>
        <p>If you didn't request this, ignore this email.</p>
      </div>
    `,
      });
      if (response?.accepted?.length) {
        return response;
      }
      console.error("OTP email was not accepted:", response);
      return null;
    } catch (error) {
      console.error("Error sending OTP email:", error);
      return null;
    }
  }
  sendPasswordResetOTP = async (toEmail, otp) => {
    try {
      let response = await transporter.sendMail({
        from: `"Job Tracker" <${process.env.SMTP_USER}>`,
        to: toEmail,
        subject: "Password Reset OTP",
        html: `
      <div style="font-family: Arial, sans-serif; max-width: 400px; margin: auto;">
        <h2>Reset Your Password</h2>
        <p>You requested to reset your password. Your OTP is:</p>
        <h1 style="letter-spacing: 8px; color: #4F46E5;">${otp}</h1>
        <p>This OTP expires in <strong>10 minutes</strong>.</p>
        <p><strong>Security Notice:</strong> If you didn't request this password reset, please ignore this email and ensure your account is secure.</p>
      </div>
    `,
      });
      if (response?.accepted?.length) {
        return response;
      }
      console.error("Password reset email was not accepted:", response);
      return null;
    } catch (error) {
      console.error("Error sending password reset email:", error);
      return null;
    }
  }
  SendVerificationotp = () => {



  };
}
let serviceData=new services()
export default serviceData;