import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendOtpEmail = async (email, otp) => {
  await resend.emails.send({
    from: process.env.EMAIL_FROM,
    to: email,
    subject: "HRMS Email Verification OTP",
    html: `
      <div style="font-family:Arial,sans-serif">
        <h2>Email Verification</h2>

        <p>Your OTP is:</p>

        <h1 style="letter-spacing:5px;color:#2563eb">
          ${otp}
        </h1>

        <p>This OTP is valid for <b>10 minutes</b>.</p>

        <p>If you didn't request this, you can ignore this email.</p>
      </div>
    `,
  });
};