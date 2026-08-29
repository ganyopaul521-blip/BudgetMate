const sgMail = require("@sendgrid/mail");

sgMail.setApiKey(process.env.SENDGRID_API_KEY || "");

async function sendPasswordResetEmail(to, resetUrl) {
  await sgMail.send({
    to,
    from: process.env.SENDGRID_FROM_EMAIL,
    subject: "Reset your BudgetMate password",
    html: `
      <p>We received a request to reset your BudgetMate password.</p>
      <p><a href="${resetUrl}">Click here to reset your password</a></p>
      <p>This link expires in 1 hour. If you didn't request this, you can safely ignore this email.</p>
    `,
  });
}

module.exports = { sendPasswordResetEmail };
