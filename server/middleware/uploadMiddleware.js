const multer = require("multer");

// ======================================
// Storage
// ======================================

// Extension is derived from the validated MIME type below, not from
// the user-supplied original filename - see the security note on
// fileFilter for why.
const MIME_TO_EXTENSION = {

    "image/jpeg": ".jpg",
    "image/jpg": ".jpg",
    "image/png": ".png",
    "image/webp": ".webp"

};

const storage = multer.diskStorage({

    destination(req, file, cb) {

        cb(null, "server/uploads");

    },

    filename(req, file, cb) {

        const uniqueName =
            Date.now() +
            "-" +
            Math.round(Math.random() * 1E9);

        const extension = MIME_TO_EXTENSION[file.mimetype] || "";

        cb(

            null,

            uniqueName + extension

        );

    }

});

// ======================================
// File Filter
// ======================================

function fileFilter(req, file, cb) {

    // NOTE: file.mimetype is the Content-Type header the client sent
    // for this part of the multipart upload - it is client-supplied
    // and can be spoofed, so this check alone does not guarantee the
    // file's actual bytes are a real image. It is still useful as a
    // first line of defense combined with deriving the saved file's
    // extension from this same validated value (see MIME_TO_EXTENSION
    // above) rather than trusting the original filename's extension.
    const allowed = Object.keys(MIME_TO_EXTENSION);

    if (allowed.includes(file.mimetype)) {

        cb(null, true);

    }

    else {

        cb(new Error("Only image files are allowed."), false);

    }

}

module.exports = multer({

    storage,

    fileFilter,

    limits: {

        fileSize: 2 * 1024 * 1024

    }

});