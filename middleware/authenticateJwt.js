import jwt from "jsonwebtoken";
import "dotenv/config";

const authenticateJwt = async (req, res, next) => {
  try {
    // console.log("cookies", req.cookies);
    const token = req.cookies.Access_Token;
    if (!token) {
      return res.status(401).json({ message: "Unauthorized entry" });
    }
    const decoded = jwt.verify(token, process.env.ACCESS_SECRET_KEY);
    req.user = decoded;
    next();
  } catch (error) {
    console.error(error);
    return res.status(403).json({ message: "Issue with the user" });
  }
};

export default authenticateJwt;
