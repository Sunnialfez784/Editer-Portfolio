const multer = require("multer");

// Vercel/serverless functions have a READ-ONLY filesystem (except /tmp),
// so diskStorage won't work in production. We keep the file in memory
// as a Buffer instead and stream it straight to Cloudinary.
const storage = multer.memoryStorage();

const videoFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('video/')) {
        cb(null, true);
    } else {
        cb(new Error('Only video required'), false);
    }
};

const upload = multer({
    storage: storage,
    fileFilter: videoFilter,
    limits: {
        // NOTE: Vercel Serverless Functions cap the request body around ~4.5MB
        // regardless of this number. See the deployment README for a fix.
        fileSize: 100 * 1024 * 1024
    }
});

module.exports = { upload };
