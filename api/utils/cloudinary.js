require("dotenv").config();

const cloudinary = require("cloudinary").v2;

const CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME;
const API_KEY = process.env.CLOUDINARY_API_KEY;
const API_SECRET = process.env.CLOUDINARY_API_SECRET;

cloudinary.config({
  cloud_name: CLOUD_NAME,
  api_key: API_KEY,
  api_secret: API_SECRET,
});

console.log("Cloudinary config:", {
  cloud_name: CLOUD_NAME || "Missing",
  api_key: API_KEY ? "Loaded" : "Missing",
  api_secret: API_SECRET ? "Loaded" : "Missing",
});

const uploadOnCloudinary = (fileBuffer) => {
  return new Promise((resolve, reject) => {
    if (!fileBuffer) {
      return reject(new Error("File buffer is missing"));
    }

    // Fail fast with a clear message instead of letting Cloudinary return a
    // generic 401/403 that's hard to debug. This is the #1 cause of the
    // "Server returned unexpected status code - 403" error: the .env file
    // is git-ignored, so on Vercel these vars only exist if you added them
    // yourself in Project Settings -> Environment Variables (and then
    // redeployed).
    if (!CLOUD_NAME || !API_KEY || !API_SECRET) {
      const missing = [
        !CLOUD_NAME && "CLOUDINARY_CLOUD_NAME",
        !API_KEY && "CLOUDINARY_API_KEY",
        !API_SECRET && "CLOUDINARY_API_SECRET",
      ].filter(Boolean).join(", ");
      const err = new Error(
        `Cloudinary is not configured: missing ${missing}. Set these in Vercel Project Settings -> Environment Variables (for Production/Preview/Development) and redeploy.`
      );
      err.http_code = 500;
      return reject(err);
    }

    const uploadStream = cloudinary.uploader.upload_stream(
      {
        resource_type: "video",
      },
      (error, result) => {
        if (error) {
          console.error("========== CLOUDINARY ERROR ==========");
          console.error("Message:", error.message);
          console.error("HTTP Code:", error.http_code);
          console.error("Name:", error.name);
          console.error("Full Error (JSON):", JSON.stringify(error, Object.getOwnPropertyNames(error)));
          console.error("======================================");

          // Normalize so callers always have a usable statusCode.
          if (error.http_code === 403 || error.http_code === 401) {
            error.message = `Cloudinary rejected the upload (HTTP ${error.http_code}): ${error.message}. Double-check CLOUDINARY_CLOUD_NAME/API_KEY/API_SECRET on your deployment and that the account/plan allows video uploads.`;
          }

          return reject(error);
        }

        console.log("========== CLOUDINARY SUCCESS ==========");
        console.log("URL:", result.secure_url);
        console.log("Public ID:", result.public_id);
        console.log("========================================");

        resolve(result.secure_url);
      },
    );

    uploadStream.end(fileBuffer);
  });
};

module.exports = {uploadOnCloudinary};
