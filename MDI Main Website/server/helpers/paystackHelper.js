const axios = require("axios");
const { paystackSecretKey } = require("../config/paystackConfig");

const paystack = axios.create({
  baseURL: "https://api.paystack.co",
  headers: {
    Authorization: `Bearer ${paystackSecretKey}`,
    "Content-Type": "application/json",
  },
});

module.exports = {
  initializePayment: async (paymentData) => {
    const response = await paystack.post("/transaction/initialize", paymentData);
    return response.data;
  },

  verifyPaystackPayment: async (reference) => {
    const response = await paystack.get(`/transaction/verify/${reference}`);
    return response.data;
  },
};

