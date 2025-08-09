import dotenv from "dotenv";

dotenv.config();

export const envConfig = {
  PRIVATE_KEY: process.env.PRIVATE_KEY,
};
