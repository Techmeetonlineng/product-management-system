const { v2: cloudinary } = require("cloudinary");
require("dotenv").config();

console.log("========== CLOUDINARY ==========");
console.log("Cloud Name:", process.env.CLOUDINARY_CLOUD_NAME);
console.log("API Key:", process.env.CLOUDINARY_API_KEY);
console.log("Secret Exists:", !!process.env.CLOUDINARY_API_SECRET);
console.log("===============================");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

module.exports = cloudinary;
