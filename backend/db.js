import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

export const db = mysql.createPool({
  host: process.env.DB_HOST,          // gateway01.ap-southeast-1.prod.aws.tidbcloud.com
  user: process.env.DB_USER,          // xxxx.root
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,      // test
  port: Number(process.env.DB_PORT),  // 4000 (VERY IMPORTANT)
  ssl: {
    rejectUnauthorized: true,         // REQUIRED for TiDB
  },
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});
