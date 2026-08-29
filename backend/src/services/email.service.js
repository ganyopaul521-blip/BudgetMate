const axios = require("axios");

const brevoClient = axios.create({
  baseURL: "https://api.brevo.com/v3",
  headers: {
    "api-key": process.env.BREVO_API_KEY || "",
    "content-type": "application/json",
    accept: "application/json",
  },
});

async function sendPasswordResetEmail(to, resetUrl) {
  await brevoClient.post("/smtp/email", {
    sender: { name: "BudgetMate", email: process.env.BREVO_FROM_EMAIL },
    to: [{ email: to }],
    subject: "Reset your BudgetMate password",
    htmlContent: `
      <p>We received a request to reset your BudgetMate password.</p>
      <p><a href="${resetUrl}">Click here to reset your password</a></p>
      <p>This link expires in 1 hour. If you didn't request this, you can safely ignore this email.</p>
    `,
  });
}

module.exports = { sendPasswordResetEmail };
