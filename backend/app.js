require("dotenv").config();
const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const { globalErrorHandler } = require("./middleware/error.middleware.js");
const videoRoutes = require("./routes/video.routes.js");
const adminRoutes = require("./routes/admin.routes.js");

const app = express();

app.use(cors());
app.use(express.json({ limit: "100mb" }));
app.use(express.urlencoded({ extended: true, limit: "100mb" }));
app.use(cookieParser());

app.use("/api/v1/admin", adminRoutes);
app.use("/api/v1/videos", videoRoutes);

app.use(globalErrorHandler);

module.exports = app;
