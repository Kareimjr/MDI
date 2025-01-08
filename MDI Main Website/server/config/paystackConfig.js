const dotenv = require("dotenv");
dotenv.config();

module.exports = {
  paystackSecretKey: process.env.PAYSTACK_SECRET_KEY,
  paystackPublicKey: process.env.PAYSTACK_PUBLIC_KEY,
  clientUrl: process.env.CLIENT_URL,
};
