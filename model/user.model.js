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

export const allUserHome = async () => {
  // console.log("DB starting");
  const result = await pool.query(`select * from users`);
  // console.log(result);
  //  console.log(result.rows);
  return result.rows;
};

export const findUserId = async (id) => {
  const result = await pool.query(`select * from users where user_id=$1`, [id]);
  console.log(result);
  return result.rows[0];
};

export const insertRefreshToken = async (
  user_id,
  refresh_token,
  expiryDate
) => {
  const result = await pool.query(
    ` insert into refresh_tokens(user_id,token,expires_at) 
    values($1,$2,$3)`,
    [user_id, refresh_token, expiryDate]
  );
  return result.rows[0];
};
// export const loginUser = async()=>{
export const userLogout = async (refresh_token) => {
  const result = await pool.query(`delete from refresh_tokens where token=$1`, [
    refresh_token,
  ]);
  return result.rows[0];
};

export const refreshTokenCompare = async (refresh_token) => {
  const result = await pool.query(
    `select * from refresh_tokens where token=$1 and expires_at > NOW()`,
    [refresh_token]
  );

  return result.rows[0];
};

// }
