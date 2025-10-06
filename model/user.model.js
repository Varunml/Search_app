import pool from "../config.js/db.js";
import bcrypt from "bcrypt";

export const authenticateUser = async (email) => {
  const result = await pool.query(`select * from users where email= $1`, [
    email,
  ]);

  return result.rows[0];
};

export const UserRegister = async (email, password, name) => {
  const salt = 10;
  const hashedPassword = await bcrypt.hash(password, salt);

  const result = await pool.query(
    `insert into users (email,password,name) values($1,$2,$3) returning user_id,email,name`,
    [email, hashedPassword, name]
  );

  return result.rows[0];
};

// export const loginUser = async()=>{

// }
