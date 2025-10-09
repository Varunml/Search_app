import crypto from "crypto";
import jwt from "jsonwebtoken";

export const hashTokens = async (token) =>
  crypto.createHash("sha256").update(token).digest("hex");
