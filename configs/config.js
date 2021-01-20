const dotenv = require("dotenv");
dotenv.config();

module.exports = {
  user: process.env.MONGO_USER,
  password: process.env.MONGO_PASSWORD,
  dbname: process.env.MONGO_DB,
};
