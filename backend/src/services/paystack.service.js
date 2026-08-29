const axios = require("axios");

const paystackClient = axios.create({
  baseURL: "https://api.paystack.co",
  headers: { Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}` },
});

/**
 * Registers a transaction with Paystack ahead of the inline checkout so the
 * reference we generate server-side is the one actually charged.
 */
async function initializeTransaction({ email, amountPesewas, reference, metadata }) {
  const res = await paystackClient.post("/transaction/initialize", {
    email,
    amount: amountPesewas,
    reference,
    currency: "GHS",
    metadata,
  });
  return res.data.data; // { authorization_url, access_code, reference }
}

async function verifyTransaction(reference) {
  const res = await paystackClient.get(`/transaction/verify/${encodeURIComponent(reference)}`);
  return res.data.data; // { status: 'success' | 'failed' | 'abandoned', amount, currency, reference, ... }
}

module.exports = { initializeTransaction, verifyTransaction };
