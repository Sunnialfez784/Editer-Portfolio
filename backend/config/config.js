const dotenv = require("dotenv");

dotenv.config();

const legacyConfig = require("./database-config.json");

const devLegacy = legacyConfig.development || {};
const testLegacy = legacyConfig.test || {};

const base = {
  dialect: process.env.DB_DIALECT || devLegacy.dialect || "mysql",
  host: process.env.DB_HOST || devLegacy.host || "127.0.0.1",
  port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306,
};

module.exports = {
  development: {
    ...base,
    username: process.env.DB_USER || devLegacy.username || "root",
    password: process.env.DB_PASSWORD ?? devLegacy.password ?? undefined,
    database: process.env.DB_NAME || devLegacy.database || "video_manager",
  },
  test: {
    ...base,
    username: process.env.DB_USER || testLegacy.username || "root",
    password: process.env.DB_PASSWORD ?? testLegacy.password ?? undefined,
    database: process.env.DB_TEST_NAME || testLegacy.database || "database_test",
  },
  production: {
    ...base,
    use_env_variable: "DB_URL",
  },
};
