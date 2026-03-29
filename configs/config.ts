import dotenv from "dotenv";
dotenv.config();

const config = {
  user: process.env.MONGO_USER,
  password: process.env.MONGO_PASSWORD,
  dbname: process.env.MONGO_DB,
};

export default config;
