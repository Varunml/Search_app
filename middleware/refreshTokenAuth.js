// import { ref } from "joi";
import jwt from "jsonwebtoken";
import { hashTokens } from "../Utils/hashToken.js";
import "dotenv/config";
import {refreshTokenCompare} from "../model/user.model.js";

export const refreshToken = async (req, res, next) => {
  const refresh_token = req.cookies.refresh_token;

  if (!refresh_token) {
    return res
      .status(401)
      .json({ message: " Unauthotized access to the page" });
  }
  const timestamp = Date.now();
  let dateInSecs = Math.floor(timestamp / 1000);
  const decodeRefreshToken = jwt.verify(
    refresh_token,
    process.env.REFRESH_SECRET_KEY
  );
  if (!decodeRefreshToken) {
    return res.status(401).json("Entry restricted");
  }
  req.userID = decodeRefreshToken.userID;   
  const refresh_expire = decodeRefreshToken.exp;

  if (refresh_expire < dateInSecs) {
    return res.status(403).json({ message: "Expired access" });
  }

  const hashedToken = await hashTokens(refresh_token);
  const tokenVerify = await refreshTokenCompare(hashedToken);
  if (!tokenVerify) {
    return res.status(403).json({ message: "Invalid Token" });
  }
};
