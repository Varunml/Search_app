import { Pool } from "pg";
import "dotenv/config";

const pool = new Pool({
  user: process.env.DB_user,
  //   host: process.env.DB_host,
  database: process.env.DB_name,
  password: process.env.DB_password,
  port: process.env.DB_port,
});

export default pool;
