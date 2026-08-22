// Serverless-safe: reuse the SAME Sequelize instance created in models/index.js
// (models/index.js already builds it from config/config.json + env vars).
// Having two separate Sequelize instances (one here, one in models) breaks
// transactions across model queries — so we don't create a second connection.
const db = require("../models/index.js");

module.exports = { sequelize: db.sequelize };
