// Diagnostic script — run this LOCALLY (not on Vercel) to find out exactly
// why Cloudinary is rejecting requests with a 403.
//
// Usage:
//   cd api
//   node scripts/test-cloudinary.js
//
// It reads CLOUDINARY_CLOUD_NAME / CLOUDINARY_API_KEY / CLOUDINARY_API_SECRET
// from your .env file (same ones used by the app) and:
//   1. Pings Cloudinary to confirm the credentials themselves are valid.
//   2. Tries a tiny real video upload (a 1-second black clip generated
//      in-memory) so you see the *exact* JSON error Cloudinary sends back —
//      the upload_stream() error in production strips some detail, but
//      cloudinary.api / cloudinary.uploader errors here show the full body.
//
// This never touches your database or your deployed app — it only talks to
// Cloudinary directly, so it isolates "is it my Cloudinary account?" from
// "is it something in my Express/Vercel code?".

require("dotenv").config();
const cloudinary = require("cloudinary").v2;

const CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME;
const API_KEY = process.env.CLOUDINARY_API_KEY;
const API_SECRET = process.env.CLOUDINARY_API_SECRET;

console.log("Using credentials:");
console.log("  CLOUDINARY_CLOUD_NAME:", CLOUD_NAME || "(missing)");
console.log("  CLOUDINARY_API_KEY   :", API_KEY || "(missing)");
console.log("  CLOUDINARY_API_SECRET:", API_SECRET ? `${API_SECRET.slice(0, 4)}... (${API_SECRET.length} chars)` : "(missing)");
console.log("");

if (!CLOUD_NAME || !API_KEY || !API_SECRET) {
  console.error("One or more Cloudinary env vars are missing. Check your .env file.");
  process.exit(1);
}

cloudinary.config({
  cloud_name: CLOUD_NAME,
  api_key: API_KEY,
  api_secret: API_SECRET,
});

async function main() {
  console.log("Step 1/2: Pinging Cloudinary (cloudinary.api.ping) ...");
  try {
    const pingResult = await cloudinary.api.ping();
    console.log("  ✅ Ping succeeded:", pingResult);
  } catch (err) {
    console.error("  ❌ Ping failed. This means the CLOUD_NAME/API_KEY/API_SECRET");
    console.error("     combination itself is wrong, or this account/product doesn't");
    console.error("     allow API access. Full error below:");
    console.error(JSON.stringify(err, null, 2));
    process.exit(1);
  }

  console.log("");
  console.log("Step 2/2: Uploading a tiny test video ...");
  // A minimal, valid, ~1KB MP4 (single black frame) encoded as base64 —
  // good enough to trigger Cloudinary's real video-upload code path.
  const tinyMp4Base64 =
    "AAAAIGZ0eXBpc29tAAACAGlzb21pc28yYXZjMW1wNDEAAAAIZnJlZQAAAt1tZGF0AAACrgYF//+q3EXpvebZSLeWLNgg2SPu73gyNjQgLSBjb3JlIDE2NCByMzEwOCAzMWU5ZjljIC0gSC4yNjQvTVBFRy00IEFWQyBjb2RlYyAtIENvcHlsZWZ0IDIwMDMtMjAyMyAtIGh0dHA6Ly93d3cudmlkZW9sYW4ub3JnL3gyNjQuaHRtbA==";
  const fileBuffer = Buffer.from(tinyMp4Base64, "base64");

  cloudinary.uploader
    .upload_stream({ resource_type: "video" }, (error, result) => {
      if (error) {
        console.error("  ❌ Upload failed. Full Cloudinary error object:");
        console.error(JSON.stringify(error, null, 2));
        console.error("");
        console.error("If Step 1 (ping) succeeded but Step 2 (upload) failed with 403,");
        console.error("the credentials are valid but the account/plan/security settings");
        console.error("are blocking video uploads specifically. Check, in the Cloudinary");
        console.error("console:");
        console.error("  - Settings -> Security -> any 'Allowed IP addresses' / restricted");
        console.error("    media types for this API key");
        console.error("  - Settings -> Product Environment -> confirm this is a");
        console.error("    'Programmable Media' environment (not Media Optimizer only)");
        console.error("  - Billing -> account isn't suspended / over quota");
        process.exit(1);
      }
      console.log("  ✅ Upload succeeded:", result.secure_url);
      console.log("");
      console.log("Everything works! If your deployed app still fails, the deployed");
      console.log("environment variables on Vercel don't match what you just tested —");
      console.log("re-check Project Settings -> Environment Variables there.");
    })
    .end(fileBuffer);
}

main();
