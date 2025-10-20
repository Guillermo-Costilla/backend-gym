import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

export const transporter = nodemailer.createTransport({
  service: "gmail", // o SMTP personalizado
  auth: {
    user: process.env.EMAIL_AUTH_USER,
    pass: process.env.EMAIL_AUTH_PASS,
  },
});

export async function enviarEmail({ to, subject, html }) {
  return transporter.sendMail({
    from: `"CRM Gym" <${process.env.EMAIL_AUTH_USER}>`,
    to,
    subject,
    html,
  });
}