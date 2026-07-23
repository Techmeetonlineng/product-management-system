const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

// ======================================
// Cloudinary Storage
// ======================================

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "product-management-system",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
    resource_type: "image",
  },
});

// ======================================
// File Filter
// ======================================

function fileFilter(req, file, cb) {
  const allowed = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

  if (allowed.includes(file.mimetype)) {
    return cb(null, true);
  }

  cb(new Error("Only image files are allowed."), false);
}

module.exports = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 2 * 1024 * 1024,
  },
});
